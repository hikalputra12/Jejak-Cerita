// src/scripts/index.js
import '../../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Pastikan ini benar
import '@fortawesome/fontawesome-free/css/all.css'; // Untuk ikon

import App from '../pages/app';
import UserAuth from '../data/user-auth'; // Import UserAuth

export function showFormattedDate(date) {
  return new Date(date).toLocaleDateString('id-ID');
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // Fungsi untuk memperbarui tampilan link autentikasi di header dan drawer
  const updateAuthLinks = () => {
    const authLinksContainer = document.getElementById('auth-links');
    const navList = document.getElementById('nav-list');
    
    // Clear existing auth links in both places
    if (authLinksContainer) {
      authLinksContainer.innerHTML = '';
    }

    // Remove existing login/register items from navList if they exist
    const existingLoginNav = navList?.querySelector('li a[href="#/login"]')?.parentElement;
    const existingRegisterNav = navList?.querySelector('li a[href="#/register"]')?.parentElement;
    if (existingLoginNav) existingLoginNav.remove();
    if (existingRegisterNav) existingRegisterNav.remove();

    if (UserAuth.isAuthenticated()) {
      // Jika sudah login, tampilkan tombol logout di header
      if (authLinksContainer) {
        authLinksContainer.innerHTML = `
          <button id="logoutButton" class="btn btn-secondary btn-sm" aria-label="Logout dari akun">Logout</button>
        `;
        document.getElementById('logoutButton').addEventListener('click', () => {
          UserAuth.removeUserAuth(); // Panggil removeUserAuth untuk menghapus token & data
          alert('Anda telah logout.');
          window.location.hash = '#/'; // Redirect ke halaman beranda
          // Gunakan View Transition API jika didukung
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              window.location.reload(); // Reload untuk memperbarui UI
            });
          } else {
            window.location.reload(); // Fallback
          }
        });
      }
      // Tambahkan item "Tambah Cerita" dan "Semua Cerita" ke navigasi drawer jika belum ada
      if (navList) {
        const hasAddStory = navList.querySelector('a[href="#/add-story"]');
        const hasStories = navList.querySelector('a[href="#/stories"]');
        const hasAbout = navList.querySelector('a[href="#/about"]');

        if (!hasAddStory) {
          const addStoryItem = document.createElement('li');
          addStoryItem.innerHTML = '<li><a href="#/add-story">Tambah Cerita</a></li>';
          if (hasAbout) { // Insert before About
            navList.insertBefore(addStoryItem, hasAbout.parentElement);
          } else { // Or just append
            navList.appendChild(addStoryItem);
          }
        }
         if (!hasStories) {
          const storiesItem = document.createElement('li');
          storiesItem.innerHTML = '<li><a href="#/stories">Semua Cerita</a></li>';
          const homeLink = navList.querySelector('a[href="#/"]');
          if (homeLink) { // Insert after Home
            navList.insertBefore(storiesItem, homeLink.parentElement.nextSibling);
          } else { // Or just append
            navList.appendChild(storiesItem);
          }
        }
      }

    } else {
      // Tampilkan link login/daftar di header jika belum login
      if (authLinksContainer) {
        authLinksContainer.innerHTML = `
          <a href="#/login" class="btn btn-secondary btn-sm me-2" aria-label="Login ke akun">Login</a>
          <a href="#/register" class="btn btn-primary btn-sm" aria-label="Daftar akun baru">Daftar</a>
        `;
      }
      // Tambahkan item "Login" dan "Daftar" ke navigasi drawer jika belum ada
      if (navList) {
        const hasLogin = navList.querySelector('a[href="#/login"]');
        const hasRegister = navList.querySelector('a[href="#/register"]');
        const hasAddStory = navList.querySelector('a[href="#/add-story"]');
        const hasStories = navList.querySelector('a[href="#/stories"]');
        
        // Remove "Tambah Cerita" and "Semua Cerita" if not logged in
        if (hasAddStory) hasAddStory.parentElement.remove();
        if (hasStories) hasStories.parentElement.remove();

        if (!hasLogin) {
          const loginItem = document.createElement('li');
          loginItem.innerHTML = '<li><a href="#/login">Login</a></li>';
          navList.appendChild(loginItem);
        }
        if (!hasRegister) {
          const registerItem = document.createElement('li');
          registerItem.innerHTML = '<li><a href="#/register">Daftar</a></li>';
          navList.appendChild(registerItem);
        }
      }
    }
  };


  await app.renderPage();
  updateAuthLinks(); // Panggil saat aplikasi dimuat

  window.addEventListener('hashchange', async () => {
    // Gunakan View Transition API untuk hashchange events
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await app.renderPage();
        updateAuthLinks(); // Perbarui link autentikasi setelah navigasi
      });
    } else {
      await app.renderPage();
      updateAuthLinks(); // Fallback untuk browser yang tidak mendukung View Transition API
    }
  });

  // Accessibility: Handle focus on skip-link
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#main-content');
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      mainContent.focus(); // Focus on the main content area
    });
  }
});