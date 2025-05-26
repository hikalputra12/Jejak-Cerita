// src/scripts/index.js
import '../styles/styles.css'; //
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.css';

import App from './pages/app'; //
import UserAuth from './data/user-auth'; //
import { showFormattedDate } from './utils/index'; //

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const updateAuthLinks = () => {
    const authLinksContainer = document.getElementById('auth-links');
    const navList = document.getElementById('nav-list');

    // Clear existing dynamic links
    const existingLogin = navList?.querySelector('a[href="#/login"]')?.parentElement;
    if (existingLogin) existingLogin.remove();
    const existingRegister = navList?.querySelector('a[href="#/register"]')?.parentElement;
    if (existingRegister) existingRegister.remove();

    // Remove existing 'Semua Cerita' and 'Tambah Cerita' links if they were added dynamically
    const existingAddStory = navList?.querySelector('a[href="#/add-story"]')?.parentElement;
    if (existingAddStory) existingAddStory.remove();
    const existingStories = navList?.querySelector('a[href="#/stories"]')?.parentElement;
    if (existingStories) existingStories.remove();

    // Clear auth buttons in the header
    if (authLinksContainer) {
      authLinksContainer.innerHTML = '';
    }

    if (UserAuth.isAuthenticated()) {
      // Update auth buttons in the header
      if (authLinksContainer) {
        authLinksContainer.innerHTML = `
          <button id="logoutButton" class="btn btn-secondary btn-sm" aria-label="Logout dari akun">Logout</button>
        `;
        document.getElementById('logoutButton').addEventListener('click', () => {
          UserAuth.removeUserAuth();
          alert('Anda telah logout.');
          window.location.hash = '#/';
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              window.location.reload();
            });
          } else {
            window.location.reload();
          }
        });
      }

      // Add "Semua Cerita" and "Tambah Cerita" to navigation drawer if logged in
      if (navList) {
        const homeLink = navList.querySelector('a[href="#/"]');
        if (homeLink) {
            const storiesItem = document.createElement('li');
            storiesItem.innerHTML = '<li><a href="#/stories">Semua Cerita</a></li>';
            navList.insertBefore(storiesItem, homeLink.parentElement.nextElementSibling);

            const addStoryItem = document.createElement('li');
            addStoryItem.innerHTML = '<li><a href="#/add-story">Tambah Cerita</a></li>';
            navList.insertBefore(addStoryItem, storiesItem.nextElementSibling);
        }
      }

    } else {
      // Update auth buttons in the header for non-logged-in users
      if (authLinksContainer) {
        authLinksContainer.innerHTML = `
          <a href="#/login" class="btn btn-secondary btn-sm me-2" aria-label="Login ke akun">Login</a>
          <a href="#/register" class="btn btn-primary btn-sm" aria-label="Daftar akun baru">Daftar</a>
        `;
      }
    }
  };


  await app.renderPage();
  updateAuthLinks();

  window.addEventListener('hashchange', async () => {
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await app.renderPage();
        updateAuthLinks();
      });
    } else {
      await app.renderPage();
      updateAuthLinks();
    }
  });

  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#main-content');
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      mainContent.focus();
    });
  }
});