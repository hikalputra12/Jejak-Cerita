import { addNewStory } from '../../../data/api';
import UserAuth from '../../../data/user-auth';
import { startup as initCamera } from '../../../utils/camera-helper';
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
            <div class="camera">
              <video id="camera-video" class="camera__video">Video stream not available.</video>
              <canvas id="camera-canvas" class="camera__canvas"></canvas>

              <div class="camera__tools">
                <select id="camera-list-select"></select>
                <div class="camera__tools_buttons">
                  <button id="camera-take-button" class="camera__tools__take-button" type="button">
                    Ambil Gambar
                  </button>
                </div>
              </div>
              <img id="photoPreview" class="d-none" alt="Preview Foto" />
            </div>
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
    initCamera();
    const addStoryForm = document.getElementById('addStoryForm');
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

    mapInstance = initMap('mapInputPreview', -6.2, 106.816666, 13);
    mapInstance.invalidateSize();

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

   addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const description = document.getElementById('storyDescription').value;
      const photoPreview = document.getElementById('photoPreview');
      const token = UserAuth.getUserToken();
      if (
        !description ||
        !photoPreview.src ||
        photoPreview.classList.contains('d-none') ||
        !photoPreview.src.startsWith('data:image/')
      ) {
        alert('Deskripsi dan Foto harus diisi!');
        return;
      }

      // Konversi dataURL ke File
      function dataURLtoFile(dataurl, filename) {
        if (!dataurl || !dataurl.includes(',')) {
          throw new Error('Data URL tidak valid');
        }
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) {
          throw new Error('Mime type tidak ditemukan');
        }
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      }

      const photoFile = dataURLtoFile(photoPreview.src, 'photo.png');

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photoFile);
      if (currentLat && currentLon) {
        formData.append('lat', currentLat);
        formData.append('lon', currentLon);
      }

      try {
        const response = await addNewStory(formData, token);

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