// src/scripts/pages/home/home-page.js
import UserAuth from '../../data/user-auth'; // Import UserAuth untuk mengecek status login
import { getAllStories } from '../../data/api'; // Import fungsi untuk mengambil cerita
import { showFormattedDate } from '../../utils'; // Import untuk format tanggal
import { showMap, clearMap } from '../../utils/map-helper'; // Import map helper functions


export default class HomePage {
  async render() {
    const isAuthenticated = UserAuth.isAuthenticated(); // Cek status login
    let storyListHtml = '';

    if (isAuthenticated) {
      // Jika sudah login, tampilkan bagian untuk daftar cerita
      storyListHtml = `
        <section class="latest-stories container my-5">
          <h2 class="section-title">Jejak Cerita Terbaru</h2>
          <div class="story-grid row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="story-list-container">
            <p class="text-center w-100 mt-5" id="loading-stories">Memuat cerita...</p>
          </div>
        </section>
      `;
    } else {
      // Jika belum login, tampilkan pesan atau ajakan untuk login
      storyListHtml = `
        <section class="not-logged-in-section container my-5 text-center">
          <div class="card shadow-sm p-5 bg-white">
            <h2 class="section-title-alt mb-4">Mari Bergabung dengan Jejak Cerita!</h2>
            <p class="lead mb-4">Untuk melihat dan membagikan kisah-kisah menarik dari seluruh dunia, silakan login atau daftar akun baru.</p>
            <div class="d-grid gap-2 col-md-6 mx-auto">
              <a href="#/login" class="btn btn-primary btn-lg" aria-label="Login to your account"><i class="fas fa-sign-in-alt me-2"></i>Login</a>
              <a href="#/register" class="btn btn-secondary btn-lg" aria-label="Register for a new account"><i class="fas fa-user-plus me-2"></i>Daftar Sekarang</a>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="hero-section">
        <div class="hero-content container">
          <h1 class="hero-title">Temukan Petualangan Anda. Bagikan Cerita Anda.</h1>
          <p class="hero-subtitle">Jelajahi kisah-kisah menakjubkan dari seluruh dunia atau mulai tulis jejak cerita Anda sendiri.</p>
          <div class="d-flex justify-content-center flex-wrap gap-3">
             <a href="#/add-story" class="btn btn-primary btn-lg rounded-pill" aria-label="Mulai Bagikan Cerita"><i class="fas fa-plus me-2"></i>Mulai Bagikan Cerita</a>
             <a href="#/stories" class="btn btn-outline-light btn-lg rounded-pill" aria-label="Jelajahi Semua Cerita"><i class="fas fa-book-open me-2"></i>Jelajahi Semua Cerita</a>
          </div>
        </div>
      </section>
      ${storyListHtml}
    `;
  }

  async afterRender() {
    const isAuthenticated = UserAuth.isAuthenticated();

    // Clear any existing map instances on the page before rendering new content
    clearMap();

    if (isAuthenticated) {
      const storyListContainer = document.getElementById('story-list-container');
      const loadingIndicator = document.getElementById('loading-stories');

      try {
        const stories = await getAllStories(); // Ambil semua cerita

        if (loadingIndicator) {
          loadingIndicator.remove(); // Hapus indikator loading
        }

        if (stories && stories.data && stories.data.length > 0) {
          storyListContainer.innerHTML = ''; // Kosongkan container sebelum mengisi
          stories.data.forEach(story => {
            const photoAltText = story.description ? `Gambar cerita: ${story.description.substring(0, 50)}...` : 'Gambar cerita';

            const storyCard = `
              <div class="col">
                <article class="story-card h-100">
                  <img src="${story.photoUrl}" alt="${photoAltText}" class="story-card-image" loading="lazy">
                  <div class="card-body d-flex flex-column">
                    <h3 class="story-card-title card-title">${story.name || 'Cerita Tanpa Judul'}</h3>
                    <p class="story-card-description card-text">${story.description.substring(0, 150)}${story.description.length > 150 ? '...' : ''}</p>
                    <div class="story-card-meta mt-auto">
                      <span class="story-card-author"><i class="fas fa-user me-1"></i>oleh ${story.name}</span>
                      <span class="story-card-date"><i class="fas fa-calendar-alt me-1"></i>${showFormattedDate(story.createdAt)}</span>
                      ${story.lat && story.lon ? `
                        <span class="story-card-location">
                          <i class="fas fa-map-marker-alt me-1"></i>
                          <button class="btn-link view-on-map-button" data-lat="${story.lat}" data-lon="${story.lon}" data-name="${story.name}" aria-label="Lihat lokasi cerita ${story.name} di peta">Lihat di Peta</button>
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

            // Add a container for the map after each story card, but initially hidden
            if (story.lat && story.lon) {
                const mapContainerId = `map-story-${story.id}`;
                storyListContainer.innerHTML += `
                    <div class="col-12 mt-3 mb-5">
                        <div id="${mapContainerId}" class="map-output-preview d-none"></div>
                    </div>
                `;
            }
          });

          // Add event listeners for "Lihat di Peta" buttons
          storyListContainer.querySelectorAll('.view-on-map-button').forEach(button => {
            button.addEventListener('click', (event) => {
              const lat = parseFloat(event.target.dataset.lat);
              const lon = parseFloat(event.target.dataset.lon);
              const name = event.target.dataset.name;
              // Get the story ID from the nearest story-card's read-more link
              const storyId = event.target.closest('.story-card').querySelector('a[href^="#/stories/"]').getAttribute('href').split('/').pop();
              const mapContainer = document.getElementById(`map-story-${storyId}`);

              // Toggle visibility of the map container
              if (mapContainer.classList.contains('d-none')) {
                mapContainer.classList.remove('d-none');
                showMap(mapContainer.id, lat, lon, name);
              } else {
                mapContainer.classList.add('d-none');
                clearMap(mapContainer.id); // Clear map if hidden
              }
            });
          });

        } else {
          storyListContainer.innerHTML = '<p class="text-center w-100">Belum ada cerita yang tersedia.</p>';
        }

      } catch (error) {
        console.error('Error fetching stories:', error);
        if (loadingIndicator) {
          loadingIndicator.remove();
        }
        storyListContainer.innerHTML = '<p class="text-danger text-center w-100">Gagal memuat cerita. Silakan coba lagi nanti.</p>';
      }
    }
    // Jika belum login, afterRender untuk bagian storyListHtml tidak perlu melakukan apa-apa.
  }
}