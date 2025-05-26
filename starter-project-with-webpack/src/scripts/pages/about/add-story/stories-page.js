// src/scripts/pages/about/add-story/stories-page.js
import { getAllStories } from '../../../data/api';
import { showFormattedDate } from '../../../utils';
import { clearMap, showMap } from '../../../utils/map-helper';
import UserAuth from '../../../data/user-auth';

export default class StoriesPage {
  async render() {
    return `
      <section class="latest-stories container my-5">
        <h1 class="section-title">Semua Jejak Cerita</h1>
        <div class="story-grid row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="all-story-list-container">
          <p class="text-center w-100 mt-5" id="loading-all-stories">Memuat semua cerita...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const storyListContainer = document.getElementById('all-story-list-container');
    const loadingIndicator = document.getElementById('loading-all-stories');

    clearMap(); // Clear any existing map instances on the page before rendering new content

    try {
      const token = UserAuth.getUserToken();
      console.log('Fetching stories for StoriesPage with token:', token ? 'exists' : 'none');
      const storiesResponse = await getAllStories(token);

      if (loadingIndicator) {
        loadingIndicator.remove();
      }

      if (storiesResponse.error) {
        storyListContainer.innerHTML = `<p class="text-danger text-center w-100">Gagal memuat cerita: ${storiesResponse.message}</p>`;
      } else if (storiesResponse.listStory && storiesResponse.listStory.length > 0) {
        storyListContainer.innerHTML = '';
        storiesResponse.listStory.forEach(story => {
          const photoAltText = story.description ? `Gambar cerita: ${story.description.substring(0, 50)}...` : 'Gambar cerita';

          // Tambahkan log konsol untuk memeriksa URL gambar
          console.log(`Story ID: ${story.id}, Photo URL: ${story.photoUrl}`);

          const storyCard = `
            <div class="col">
              <article class="story-card h-100">
                <img src="${story.photoUrl}" alt="${photoAltText}" class="story-card-image" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/400x220?text=Gambar+Tidak+Tersedia';">
                <div class="card-body d-flex flex-column">
                  <h3 class="story-card-title card-title">${story.name || 'Cerita Tanpa Judul'}</h3>
                  <p class="story-card-description card-text">${story.description.substring(0, 150)}${story.description.length > 150 ? '...' : ''}</p>
                  <div class="story-card-meta mt-auto">
                    <span class="story-card-author"><i class="fas fa-user me-1"></i>oleh ${story.name}</span>
                    <span class="story-card-date"><i class="fas fa-calendar-alt me-1"></i>${showFormattedDate(story.createdAt)}</span>
                    ${story.lat && story.lon ? `
                      <span class="story-card-location">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        <button class="btn-link view-on-map-button" data-lat="${story.lat}" data-lon="${story.lon}" data-name="${story.name}" data-story-id="${story.id}" aria-label="Lihat lokasi cerita ${story.name} di peta">Lihat di Peta</button>
                      </span>
                    ` : ''}
                  </div>
                  <div class="story-card-actions mt-3">
                      <a href="#/stories/${story.id}" class="btn btn-primary btn-sm rounded-pill"><i class="fas fa-eye me-1"></i>Baca Selengkapnya</a>
                  </div>
                </div>
              </article>
            </div>
          `;
          storyListContainer.innerHTML += storyCard;
        });

        // Tambahkan event listener untuk tombol "Lihat di Peta" (jika ada)
        storyListContainer.querySelectorAll('.view-on-map-button').forEach(button => {
          button.addEventListener('click', (event) => {
            const storyId = event.target.dataset.storyId;
            window.location.hash = `#/stories/${storyId}`; // Arahkan ke halaman detail
          });
        });

      } else {
        storyListContainer.innerHTML = '<p class="text-center w-100">Belum ada cerita yang tersedia.</p>';
      }
    } catch (error) {
      console.error('Error fetching all stories:', error);
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      storyListContainer.innerHTML = '<p class="text-danger text-center w-100">Gagal memuat cerita. Silakan coba lagi nanti.</p>';
    }
  }
}