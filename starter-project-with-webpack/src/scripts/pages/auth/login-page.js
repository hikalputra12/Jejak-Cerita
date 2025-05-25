// src/scripts/pages/auth/login-page.js
import { loginUser } from '../../data/api';
import UserAuth from '../../data/user-auth';

class LoginPage {
  async render() {
    return `
      <section class="auth-section container my-5">
        <h1 class="section-title">Login ke Akun Anda</h1>
        <form id="loginForm" class="auth-form">
          <div class="form-group mb-3">
            <label for="loginEmail" class="form-label">Email <span class="required">*</span></label>
            <input type="email" class="form-control" id="loginEmail" name="email" placeholder="contoh@domain.com" required aria-label="Email Anda">
          </div>
          <div class="form-group mb-4">
            <label for="loginPassword" class="form-label">Password <span class="required">*</span></label>
            <input type="password" class="form-control" id="loginPassword" name="password" required minlength="6" aria-label="Password Anda">
          </div>
          <p id="loginError" class="text-danger text-center d-none">
            </p>
          <button type="submit" class="btn btn-primary btn-lg w-100">Login</button>
          <p class="auth-switch">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.getElementById('loginForm');
    const loginErrorDisplay = document.getElementById('loginError');

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      loginErrorDisplay.classList.add('d-none'); // Sembunyikan pesan error sebelumnya

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const response = await loginUser({ email, password }); // Panggil fungsi loginUser dari API

        if (response.error) {
          loginErrorDisplay.textContent = `Login gagal: ${response.message}`; // Tampilkan pesan error dari API
          loginErrorDisplay.classList.remove('d-none');
        } else {
          // Akses 'response.data.token' dan 'response.data.user' karena api.js sudah memformatnya
          UserAuth.setUserToken(response.data.token);
          if (response.data.user) {
            UserAuth.setUserData(response.data.user);
          }
          alert('Login berhasil! Selamat datang kembali.');
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
        console.error('Error saat login:', error);
        loginErrorDisplay.textContent = 'Terjadi kesalahan saat login (jaringan/server). Silakan coba lagi.'; // Pesan error umum untuk error jaringan/tak terduga
        loginErrorDisplay.classList.remove('d-none');
      }
    });
  }
}

export default LoginPage;