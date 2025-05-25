// src/scripts/pages/auth/register-page.js
import { registerUser } from '../../data/api';
import UserAuth from '../../data/user-auth';

class RegisterPage {
  async render() {
    return `
      <section class="auth-section container">
        <h1 class="section-title">Daftar Akun Baru</h1>
        <form id="registerForm" class="auth-form">
          <div class="form-group mb-3">
            <label for="registerName" class="form-label">Nama Lengkap <span class="required">*</span></label>
            <input type="text" class="form-control" id="registerName" name="name" placeholder="Nama Lengkap Anda" required aria-label="Nama Lengkap">
          </div>
          <div class="form-group mb-3">
            <label for="registerEmail" class="form-label">Email <span class="required">*</span></label>
            <input type="email" class="form-control" id="registerEmail" name="email" placeholder="contoh@domain.com" required aria-label="Email Anda">
          </div>
          <div class="form-group mb-4">
            <label for="registerPassword" class="form-label">Password <span class="required">*</span></label>
            <input type="password" class="form-control" id="registerPassword" name="password" required minlength="6" aria-label="Password Anda">
          </div>
          <button type="submit" class="btn btn-primary btn-lg w-100">Daftar</button>
          <p class="auth-switch">Sudah punya akun? <a href="#/login">Login di sini</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;

      // Basic client-side validation
      if (password.length < 6) {
        alert('Password harus memiliki minimal 6 karakter.');
        return;
      }

      try {
        const response = await registerUser({ name, email, password }); // Panggil fungsi registerUser dari API

        if (response.error) {
          alert(`Registrasi gagal: ${response.message}`);
        } else {
          alert('Registrasi berhasil! Anda akan segera diarahkan ke halaman login.');
          window.location.hash = '#/login'; // Redirect ke halaman login
          if (document.startViewTransition) {
            document.startViewTransition(() => {
              window.location.reload(); // Reload untuk memperbarui status UI
            });
          } else {
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Error saat registrasi:', error);
        alert('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
      }
    });
  }
}

export default RegisterPage;