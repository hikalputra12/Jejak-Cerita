import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_NEW_STORY_WITH_GUEST_ACCOUNT: `${CONFIG.BASE_URL}/stories/guest`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  DETAIL_STORY: `${CONFIG.BASE_URL}/stories/:id`,// notes penting id bakalan di ganti
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
  return await fetchResponse.json();
}
export async function addNewStory(storyData, token) {
  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storyData),
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
export async function getAllStories() {
  const fetchResponse = await fetch(ENDPOINTS.GET_ALL_STORIES);
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


