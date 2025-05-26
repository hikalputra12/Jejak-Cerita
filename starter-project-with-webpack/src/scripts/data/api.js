// src/scripts/data/api.js
import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_NEW_STORY_WITH_GUEST_ACCOUNT: `${CONFIG.BASE_URL}/stories/guest`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  DETAIL_STORY: `${CONFIG.BASE_URL}/stories/:id`,
  SUBSCRIBE_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE_NOTIFICATION: `${CONFIG.BASE_URL}/notifications/unsubscribe`,
};


export async function registerUser(userData) {
  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return await fetchResponse.json();
}
export async function loginUser(userData) {
  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  // Perubahan di sini: Mengakses data dari 'loginResult'
  const responseJson = await fetchResponse.json();
  if (!responseJson.error && responseJson.loginResult) {
      return {
          error: false,
          message: responseJson.message,
          data: { // Bungkus data ke dalam objek 'data' sesuai harapan kode Anda
              token: responseJson.loginResult.token,
              user: { // Simpan data user jika diperlukan
                  userId: responseJson.loginResult.userId,
                  name: responseJson.loginResult.name
              }
          }
      };
  }
  return responseJson; // Kembalikan respons asli jika ada error
}
export async function addNewStory(storyData, token) {
  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json', // FormData tidak memerlukan Content-Type ini
      Authorization: `Bearer ${token}`,
    },
    body: storyData, // Mengirimkan FormData secara langsung
  });
  return await fetchResponse.json();
}
export async function addNewStoryWithGuestAccount(storyData) {
  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY_WITH_GUEST_ACCOUNT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storyData),
  });
  return await fetchResponse.json();
}
export async function getAllStories(token = null) { // Tambahkan parameter token
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const fetchResponse = await fetch(ENDPOINTS.GET_ALL_STORIES, { headers }); // Kirim headers dengan token
  return await fetchResponse.json();
}
export async function getDetailStory(id) {
  const fetchResponse = await fetch(ENDPOINTS.DETAIL_STORY.replace(':id', id));
  return await fetchResponse.json();
}


export async function subscribeNotification(subscription, token) {
  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE_NOTIFICATION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscription),
  });
  return await fetchResponse.json();
}

export async function unsubscribeNotification(endpoint, token) {
  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE_NOTIFICATION, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });
  return await fetchResponse.json();
}