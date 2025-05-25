// src/scripts/pages/home/home-page.js
import UserAuth from '../../data/user-auth'; // Import UserAuth untuk mengecek status login
import { getAllStories } from '../../data/api'; // Import fungsi untuk mengambil cerita
import { showFormattedDate } from '../../utils'; // Import untuk format tanggal

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
            <p class="text-center w-100" id="loading-stories">Memuat cerita...</p>
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
              <a href="#/login" class="btn btn-primary btn-lg"><i class="fas fa-sign-in-alt me-2"></i>Login</a>
              <a href="#/register" class="btn btn-secondary btn-lg"><i class="fas fa-user-plus me-2"></i>Daftar Sekarang</a>
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
             <a href="#/add-story" class="btn btn-primary btn-lg rounded-pill"><i class="fas fa-plus me-2"></i>Mulai Bagikan Cerita</a>
             <a href="#/stories" class="btn btn-outline-light btn-lg rounded-pill"><i class="fas fa-book-open me-2"></i>Jelajahi Semua Cerita</a>
          </div>
        </div>
      </section>
      ${storyListHtml}
    `;
  }

  async afterRender() {
    const isAuthenticated = UserAuth.isAuthenticated();

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
            const storyCard = `
              <div class="col">
                <article class="story-card h-100">
                  <img src="${story.photoUrl}" alt="Foto cerita: ${story.description.substring(0, 50)}..." class="story-card-image" loading="lazy">
                  <div class="card-body d-flex flex-column">
                    <h3 class="story-card-title card-title">${story.name || 'Cerita Tanpa Judul'}</h3>
                    <p class="story-card-description card-text">${story.description.substring(0, 150)}${story.description.length > 150 ? '...' : ''}</p>
                    <div class="story-card-meta mt-auto">
                      <span class="story-card-author"><i class="fas fa-user me-1"></i>oleh ${story.name}</span>
                      <span class="story-card-date"><i class="fas fa-calendar-alt me-1"></i>${showFormattedDate(story.createdAt)}</span>
                    </div>
                    <div class="story-card-actions mt-3">
                        <a href="#/stories/${story.id}" class="btn btn-primary btn-sm rounded-pill"><i class="fas fa-eye me-1"></i>Baca Selengkapnya</a>
                        ${story.lat && story.lon ? `<button class="btn btn-outline-secondary btn-sm rounded-pill" data-lat="${story.lat}" data-lon="${story.lon}"><i class="fas fa-map-marker-alt me-1"></i>Lihat di Peta</button>` : ''}
                    </div>
                  </div>
                </article>
              </div>
            `;
            storyListContainer.innerHTML += storyCard;
          });

          // Tambahkan event listener untuk tombol "Lihat di Peta" (jika ada)
          storyListContainer.querySelectorAll('.btn-outline-secondary').forEach(button => {
            button.addEventListener('click', (event) => {
              const lat = event.target.dataset.lat;
              const lon = event.target.dataset.lon;
              // Redirect atau tampilkan modal peta
              alert(`Arahkan ke peta di Lat: ${lat}, Lon: ${lon}`); // Ini hanya contoh, Anda bisa mengarahkan ke halaman detail atau modal peta
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