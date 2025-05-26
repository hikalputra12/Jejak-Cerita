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
  try {
    const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const responseJson = await fetchResponse.json();
    console.log('Register API Response:', responseJson);
    return responseJson;
  } catch (error) {
    console.error('Error during registration API call:', error);
    return { error: true, message: 'Network error during registration. Please try again.' };
  }
}

export async function loginUser(userData) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const responseJson = await fetchResponse.json();
    console.log('Login API Raw Response:', responseJson);

    if (!fetchResponse.ok) {
      return { error: true, message: responseJson.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    if (!responseJson.error && responseJson.loginResult) {
      return {
        error: false,
        message: responseJson.message,
        data: {
          token: responseJson.loginResult.token,
          user: {
            userId: responseJson.loginResult.userId,
            name: responseJson.loginResult.name,
          },
        },
      };
    }
    return responseJson;
  } catch (error) {
    console.error('Error during login API call:', error);
    return { error: true, message: 'Network error during login. Please try again.' };
  }
}

export async function addNewStory(storyData, token) {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
      method: 'POST',
      headers: headers,
      body: storyData,
    });
    const responseJson = await fetchResponse.json();
    console.log('Add New Story API Response:', responseJson);

    if (!fetchResponse.ok) {
      return { error: true, message: responseJson.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return responseJson;
  } catch (error) {
    console.error('Error during add new story API call:', error);
    return { error: true, message: 'Network error when adding story. Please try again.' };
  }
}

export async function addNewStoryWithGuestAccount(storyData) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY_WITH_GUEST_ACCOUNT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(storyData),
    });
    const responseJson = await fetchResponse.json();
    console.log('Add New Story Guest API Response:', responseJson);

    if (!fetchResponse.ok) {
      return { error: true, message: responseJson.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return responseJson;
  } catch (error) {
    console.error('Error during add new story as guest API call:', error);
    return { error: true, message: 'Network error when adding guest story. Please try again.' };
  }
}

export async function getAllStories(token = null) {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('getAllStories called without a token. This might limit results or cause errors if API requires auth.');
    }

    const fetchResponse = await fetch(ENDPOINTS.GET_ALL_STORIES, { headers });
    const responseJson = await fetchResponse.json();
    console.log('Get All Stories API Response:', responseJson);

    if (!fetchResponse.ok) {
      return { error: true, message: responseJson.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return responseJson;
  } catch (error) {
    console.error('Error during get all stories API call:', error);
    return { error: true, message: 'Network error when fetching stories. Please try again.' };
  }
}

export async function getDetailStory(id, token = null) {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchResponse = await fetch(ENDPOINTS.DETAIL_STORY.replace(':id', id), { headers });
    const responseJson = await fetchResponse.json();
    console.log('Get Detail Story API Response:', responseJson);

    if (!fetchResponse.ok) {
      return { error: true, message: responseJson.message || `HTTP error! Status: ${fetchResponse.status}` };
    }

    return responseJson;
  } catch (error) {
    console.error('Error during get detail story API call:', error);
    return { error: true, message: 'Network error when fetching story detail. Please try again.' };
  }
}

export async function subscribeNotification(subscription, token) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE_NOTIFICATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });
    const responseJson = await fetchResponse.json();
    console.log('Subscribe Notification API Response:', responseJson);
    return responseJson;
  } catch (error) {
    console.error('Error during subscribe notification API call:', error);
    return { error: true, message: 'Network error during subscription. Please try again.' };
  }
}

export async function unsubscribeNotification(endpoint, token) {
  try {
    const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE_NOTIFICATION, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });
    const responseJson = await fetchResponse.json();
    console.log('Unsubscribe Notification API Response:', responseJson);
    return responseJson;
  } catch (error) {
    console.error('Error during unsubscribe notification API call:', error);
    return { error: true, message: 'Network error during unsubscription. Please try again.' };
  }
}