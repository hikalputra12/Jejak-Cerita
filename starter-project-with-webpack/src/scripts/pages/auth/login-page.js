// src/scripts/pages/auth/login-page.js
import { loginUser } from '../../data/api'; // Menggunakan loginUser sesuai API Anda
import UserAuth from '../../data/user-auth';

class LoginPage {
  async render() {
    return `
      <section class="auth-section container">
        <h1 class="section-title">Login ke Akun Anda</h1>
        <form id="loginForm" class="auth-form">
          <div class="form-group">
            <label for="loginEmail">Email <span class="required">*</span></label>
            <input type="email" id="loginEmail" name="email" placeholder="contoh@domain.com" required>
          </div>
          <div class="form-group">
            <label for="loginPassword">Password <span class="required">*</span></label>
            <input type="password" id="loginPassword" name="password" required minlength="6">
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-100">Login</button>
          <p class="auth-switch">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const response = await loginUser({ email, password }); // Panggil fungsi loginUser dari API

        if (response.error) {
          alert(`Login gagal: ${response.message}`);
        } else {
          // Simpan token akses ke localStorage menggunakan UserAuth
          UserAuth.setUserToken(response.data.token);
          // Jika API mengembalikan data user, simpan juga:
          // UserAuth.setUserData(response.data.user);
          alert('Login berhasil! Selamat datang kembali.');
          window.location.hash = '#/'; // Redirect ke halaman beranda
          window.location.reload(); // Reload halaman untuk memperbarui status UI (misal: menu navigasi)
        }
      } catch (error) {
        console.error('Error saat login:', error);
        alert('Terjadi kesalahan saat login. Silakan coba lagi.');
      }
    });
  }
}

export default LoginPage;