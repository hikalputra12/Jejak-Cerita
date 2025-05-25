import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    // Menutup drawer saat mengklik di luar drawer atau mengklik tautan di dalamnya
    document.body.addEventListener('click', (event) => {
      // Jika yang diklik bukan drawer atau tombol drawer, tutup drawer
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      // Menutup drawer saat mengklik salah satu tautan di dalamnya
      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        // Cek apakah event.target adalah link itu sendiri atau anak dari link (misal: ikon di dalam link)
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
        this.#content.innerHTML = '<h2 class="text-center my-5">Halaman tidak ditemukan.</h2>';
        return;
    }

    this.#content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;