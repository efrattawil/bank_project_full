import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/bank_app/api/v1';

let tabId = sessionStorage.getItem('tabId');
if (!tabId) {
  tabId = crypto.randomUUID();
  sessionStorage.setItem('tabId', tabId);
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // מאפשר cookie/session אם צריך
});

api.interceptors.request.use(
  (config) => {
    const currentTabId = sessionStorage.getItem('tabId');
    const token = sessionStorage.getItem(`token-${currentTabId}`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // מנקה אם אין טוקן
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired – clearing this tab session.');
      const currentTabId = sessionStorage.getItem('tabId');
      sessionStorage.removeItem(`token-${currentTabId}`);
      sessionStorage.removeItem(`user-${currentTabId}`);
    }
    return Promise.reject(error);
  }
);

export default api;
