// src/scripts/pages/add-story/add-story-page.js
import { addNewStory } from '../../../data/api'; // Menggunakan addNewStory dari API
import UserAuth from '../../../data/user-auth';
import { initMap, setMapClickListener, clearMap, addMarker, setupGeolocation } from '../../../utils/map-helper';

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
            <small id="photoError" class="text-danger d-none">Gagal memuat pratinjau gambar. Pastikan file valid.</small>
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
    const photoErrorDisplay = document.getElementById('photoError');
    const latitudeInput = document.getElementById('latitudeInput');
    const longitudeInput = document.getElementById('longitudeInput');
    const mapCoordinates = document.getElementById('mapCoordinates');
    let currentLat = null;
    let currentLon = null;
    let mapInstance = null;

    if (!UserAuth.isAuthenticated()) {
      alert('Anda harus login untuk menambahkan cerita.');
      window.location.hash = '#/login';
      return;
    }

    // Inisialisasi peta setelah elemennya ada di DOM
    mapInstance = initMap('mapInputPreview', -6.2, 106.816666, 13);
    mapInstance.invalidateSize(); // Penting untuk memastikan peta dirender dengan benar

    // Setup geolokasi (jika diizinkan dan didukung)
    setupGeolocation(mapInstance, latitudeInput, longitudeInput, mapCoordinates);

    setMapClickListener(mapInstance, (lat, lon) => {
      currentLat = lat;
      currentLon = lon;
      latitudeInput.value = lat;
      longitudeInput.value = lon;
      mapCoordinates.textContent = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`;

      clearMap(mapInstance);
      addMarker(mapInstance, lat, lon, 'Lokasi Cerita Anda');
    });

    storyPhotoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        photoErrorDisplay.classList.add('d-none'); // Sembunyikan error sebelumnya
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.src = e.target.result;
          photoPreview.classList.remove('d-none');
        };
        reader.onerror = () => {
          photoErrorDisplay.textContent = 'Gagal memuat pratinjau gambar. Format tidak didukung atau rusak.';
          photoErrorDisplay.classList.remove('d-none');
          photoPreview.classList.add('d-none');
          photoPreview.src = '#'; // Reset src
        };
        reader.readAsDataURL(file);
      } else {
        photoPreview.classList.add('d-none');
        photoPreview.src = '#';
        photoErrorDisplay.classList.add('d-none');
      }
    });

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
        const response = await addNewStory(formData, token); // Panggil addNewStory dari api.js

        if (response.error) {
          alert(`Gagal menambahkan cerita: ${response.message}`);
        } else {
          alert('Cerita berhasil ditambahkan!');
          window.location.hash = '#/';
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