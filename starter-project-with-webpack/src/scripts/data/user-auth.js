// src/scripts/data/user-auth.js

const AUTH_TOKEN_KEY = 'user_auth_token';
const USER_DATA_KEY = 'user_data'; // Untuk menyimpan data user seperti nama, jika diperlukan

class UserAuth {
  /**
   * Menyimpan token autentikasi pengguna ke Local Storage.
   * @param {string} token - Token JWT dari server.
   */
  static setUserToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * Mengambil token autentikasi pengguna dari Local Storage.
   * @returns {string|null} Token JWT atau null jika tidak ada.
   */
  static getUserToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Menyimpan data pengguna (misal: nama, email) ke Local Storage.
   * @param {object} userData - Objek berisi data pengguna.
   */
  static setUserData(userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }

  /**
   * Mengambil data pengguna dari Local Storage.
   * @returns {object|null} Objek data pengguna atau null jika tidak ada.
   */
  static getUserData() {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Menghapus token dan data pengguna dari Local Storage.
   */
  static removeUserAuth() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  /**
   * Mengecek apakah pengguna sedang dalam status terautentikasi (memiliki token).
   * @returns {boolean} True jika terautentikasi, false jika tidak.
   */
  static isAuthenticated() {
    return !!UserAuth.getUserToken();
  }
}

export default UserAuth;