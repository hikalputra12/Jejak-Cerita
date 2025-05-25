// src/scripts/index.js
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Hanya jika Anda menggunakan komponen JS Bootstrap interaktif
import '@fortawesome/fontawesome-free/css/all.css'; // Untuk ikon

import App from './pages/app';
import UserAuth from './data/user-auth'; // Import UserAuth

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    // Pastikan drawerButton dan navigationDrawer sudah ada di HTML utama Anda
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // Fungsi untuk memperbarui tampilan link autentikasi di header
  const updateAuthLinks = () => {
    const authLinksContainer = document.getElementById('auth-links');
    if (authLinksContainer) {
      if (UserAuth.isAuthenticated()) {
        // Jika sudah login, tampilkan tombol logout
        authLinksContainer.innerHTML = `
          <button id="logoutButton" class="btn btn-secondary btn-sm">Logout</button>
        `;
        document.getElementById('logoutButton').addEventListener('click', () => {
          UserAuth.removeUserAuth(); // Panggil removeUserAuth untuk menghapus token & data
          alert('Anda telah logout.');
          window.location.hash = '#/';
          window.location.reload(); // Reload untuk memperbarui UI
        });
      } else {
        // Tampilkan link login/daftar jika belum login
        authLinksContainer.innerHTML = `
          <a href="#/login" class="btn btn-secondary btn-sm me-2">Login</a>
          <a href="#/register" class="btn btn-primary btn-sm">Daftar</a>
        `;
      }
    }
  };

  await app.renderPage();
  updateAuthLinks(); // Panggil saat aplikasi dimuat

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    updateAuthLinks(); // Perbarui link autentikasi setelah navigasi
  });
});