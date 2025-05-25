// src/scripts/pages/add-story/add-story-page.js
import { addNewStory } from '../../../data/api';
import UserAuth from '../../../data/user-auth';
import { initMap, setMapClickListener, clearMap, addMarker, setupGeolocation } from '../../../utils/map-helper'; // Import map helper

export default class AddStoryPage {
  async render() {
    return `
      <section class="add-story-section container my-5">
        <h1 class="section-title">Tambahkan Cerita Baru</h1>
        <form id="addStoryForm" class="story-form">
          <div class="form-group mb-3">
            <label for="storyDescription" class="form-label">Deskripsi Cerita <span class="required">*</span></label>
            <textarea class="form-control" id="storyDescription" name="description" rows="5" required aria-label="Deskripsi cerita Anda"></textarea>
          </div>

          <div class="form-group mb-3">
            <label for="storyPhoto" class="form-label">Unggah Foto (dari Kamera/Galeri) <span class="required">*</span></label>
            <input type="file" class="form-control" id="storyPhoto" name="photo" accept="image/*" capture="environment" required aria-label="Unggah foto cerita">
            <img id="photoPreview" class="photo-preview mt-3 d-none img-fluid" src="#" alt="Pratinjau Foto" />
          </div>

          <div class="form-group mb-4">
            <label class="form-label">Lokasi Cerita (Opsional)</label>
            <div id="mapInputPreview" class="map-input-preview"></div>
            <p id="mapCoordinates" class="map-coordinates">Klik pada peta untuk memilih lokasi, atau aktifkan GPS.</p>
            <input type="hidden" id="latitudeInput" name="lat">
            <input type="hidden" id="longitudeInput" name="lon">
          </div>

          <button type="submit" class="btn btn-primary w-100 btn-lg">Posting Cerita</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const addStoryForm = document.getElementById('addStoryForm');
    const storyPhotoInput = document.getElementById('storyPhoto');
    const photoPreview = document.getElementById('photoPreview');
    const latitudeInput = document.getElementById('latitudeInput');
    const longitudeInput = document.getElementById('longitudeInput');
    const mapCoordinates = document.getElementById('mapCoordinates');
    let currentLat = null;
    let currentLon = null;
    let mapInstance = null;

    // Redirect if not authenticated
    if (!UserAuth.isAuthenticated()) {
      alert('Anda harus login untuk menambahkan cerita.');
      window.location.hash = '#/login';
      return;
    }

    // Initialize map and try to get geolocation
    mapInstance = initMap('mapInputPreview', -6.2, 106.816666, 13); // Default to Jakarta, Indonesia
    setupGeolocation(mapInstance, latitudeInput, longitudeInput, mapCoordinates); // Try to get current location

    setMapClickListener(mapInstance, (lat, lon) => {
      currentLat = lat;
      currentLon = lon;
      latitudeInput.value = lat;
      longitudeInput.value = lon;
      mapCoordinates.textContent = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`;

      clearMap(mapInstance); // Clear previous markers
      addMarker(mapInstance, lat, lon, 'Lokasi Cerita Anda');
    });

    // Handle photo input change (for preview)
    storyPhotoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.src = e.target.result;
          photoPreview.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
      } else {
        photoPreview.classList.add('d-none');
        photoPreview.src = '#';
      }
    });

    // Handle form submission
    addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const description = document.getElementById('storyDescription').value;
      const photoFile = storyPhotoInput.files[0];
      const token = UserAuth.getUserToken();

      if (!description || !photoFile) {
        alert('Deskripsi dan Foto harus diisi!');
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photoFile);
      if (currentLat && currentLon) {
        formData.append('lat', currentLat);
        formData.append('lon', currentLon);
      }

      try {
        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }).then(res => res.json());

        if (response.error) {
          alert(`Gagal menambahkan cerita: ${response.message}`);
        } else {
          alert('Cerita berhasil ditambahkan!');
          window.location.hash = '#/'; // Redirect to home or stories page
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              window.location.reload();
            });
          } else {
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Error saat menambahkan cerita:', error);
        alert('Terjadi kesalahan saat menambahkan cerita. Silakan coba lagi.');
      }
    });
  }
}