import { parseActivePathname } from '../../../routes/url-parser';
import { getDetailStory } from '../../../data/api';
import { showFormattedDate } from '../../../utils';
import { initMap, addMarker, clearMap } from '../../../utils/map-helper';
import UserAuth from '../../../data/user-auth';

export default class DetailStoryPage {
  async render() {
    return `
      <section class="detail-story-section container my-5">
        <h1 class="section-title text-center mb-4">Detail Cerita</h1>
        <div id="story-detail-container" class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <div class="story-detail-card" id="story-card-content">
              <p class="text-center w-100" id="loading-story-detail">Memuat detail cerita...</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const { id: storyId } = parseActivePathname();
    console.log('Extracted storyId for detail page:', storyId);

    const storyDetailContainer = document.getElementById('story-card-content');
    const loadingIndicator = document.getElementById('loading-story-detail');

    clearMap();

    if (!storyId) {
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      storyDetailContainer.innerHTML = '<p class="text-danger text-center">ID cerita tidak ditemukan.</p>';
      return;
    }

    try {
      const token = UserAuth.getUserToken();
      console.log('Fetching detail story with token:', token ? 'exists' : 'none');
      const response = await getDetailStory(storyId, token);
      console.log('Get Detail Story API Response:', response);

      if (loadingIndicator) {
        loadingIndicator.remove();
      }

      if (response.error) {
        storyDetailContainer.innerHTML = `<p class="text-danger text-center">Gagal memuat cerita: ${response.message}</p>`;
      } else if (response.data && response.data.story) {
        const story = response.data.story;
        console.log('Detail Story data:', story);

        const photoAltText = story.description ? `Gambar cerita: ${story.description.substring(0, 50)}...` : 'Gambar cerita';

        storyDetailContainer.innerHTML = `
          <img src="${story.photoUrl}" alt="${photoAltText}" class="story-detail-image img-fluid mb-4">
          <h2 class="story-detail-title">${story.name || 'Cerita Tanpa Judul'}</h2>
          <div class="story-detail-meta">
            <span class="story-detail-author"><i class="fas fa-user me-1"></i>oleh ${story.name}</span>
            <span class="story-detail-date"><i class="fas fa-calendar-alt me-1"></i>${showFormattedDate(story.createdAt)}</span>
            ${story.lat && story.lon ? `
              <span class="story-detail-location"><i class="fas fa-map-marker-alt me-1"></i>Lat: ${story.lat.toFixed(4)}, Lon: ${story.lon.toFixed(4)}</span>
            ` : ''}
          </div>
          <p class="story-detail-description">${story.description}</p>
          ${story.lat && story.lon ? `
            <div id="detailMap" class="story-detail-map"></div>
          ` : ''}
        `;

        if (story.lat && story.lon) {
          const mapInstance = initMap('detailMap', story.lat, story.lon, 13);
          addMarker(mapInstance, story.lat, story.lon, story.name);
          mapInstance.invalidateSize();
        }
      } else {
        storyDetailContainer.innerHTML = '<p class="text-center">Cerita tidak ditemukan.</p>';
      }
    } catch (error) {
      console.error('Error fetching story detail:', error);
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      storyDetailContainer.innerHTML = '<p class="text-danger text-center">Terjadi kesalahan saat memuat detail cerita.</p>';
    }
  }
}