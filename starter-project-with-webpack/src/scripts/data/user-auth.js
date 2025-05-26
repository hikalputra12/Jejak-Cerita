const AUTH_TOKEN_KEY = 'user_auth_token';
const USER_DATA_KEY = 'user_data';

class UserAuth {

  static setUserToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  static getUserToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  static setUserData(userData) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }

  static getUserData() {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static removeUserAuth() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  static isAuthenticated() {
    return !!UserAuth.getUserToken();
  }
}

export default UserAuth;