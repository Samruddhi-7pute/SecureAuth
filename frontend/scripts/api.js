/**
 * ============================================================
 * API CONFIGURATION — edit this one line for your setup
 * ============================================================
 * Local development (backend running on your machine): keep as-is.
 * Production (after deploying the backend to Render): replace the
 * PRODUCTION_API_URL value below with your actual Render URL, e.g.
 * "https://secureauth-api.onrender.com/api".
 */
const PRODUCTION_API_URL = 'https://your-backend-app.onrender.com/api';
const LOCAL_API_URL = 'http://localhost:5000/api';

const API_BASE_URL = (() => {
  const { hostname, protocol } = window.location;

  // Covers: served from a local dev server (localhost/127.0.0.1),
  // opened directly as a file (protocol === 'file:', hostname === ''),
  // or any other loopback-style address.
  const isLocal =
    protocol === 'file:' ||
    hostname === '' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local');

  return isLocal ? LOCAL_API_URL : PRODUCTION_API_URL;
})();

/**
 * Wraps fetch with JSON headers, credentials (for the httpOnly cookie), and
 * a Bearer-token fallback for environments that restrict third-party cookies.
 */
async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const token = Storage.getToken();

  const config = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (networkErr) {
    throw new Error(
      `Could not reach the API at ${API_BASE_URL}. Make sure the backend server is running (npm run dev in /backend) and that PRODUCTION_API_URL in scripts/api.js is correct.`
    );
  }

  let data = {};
  try {
    data = await response.json();
  } catch (_) {
    /* no JSON body */
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong. Please try again.');
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }

  return data;
}

const AuthAPI = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  me: () => apiRequest('/auth/me', { method: 'GET' }),
};

const UserAPI = {
  getProfile: () => apiRequest('/users/profile', { method: 'GET' }),
  updateProfile: (payload) => apiRequest('/users/profile', { method: 'PUT', body: payload }),
};
