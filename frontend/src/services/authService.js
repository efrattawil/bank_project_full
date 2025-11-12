import api from './api';

// מזהה ייחודי ללשונית
const tabId = sessionStorage.getItem('tabId') || crypto.randomUUID();
sessionStorage.setItem('tabId', tabId);

const clearOldSessions = () => {
  Object.keys(sessionStorage)
    .filter(key => key.startsWith('token-') || key.startsWith('user-'))
    .forEach(key => sessionStorage.removeItem(key));
};

const signup = (email, password, phoneNumber) => {
  return api.post('/signup', { email, password, phoneNumber })
    .then(response => response.data);
};

const login = async (email, password) => {
  clearOldSessions();

  const response = await api.post('/login', { email, password });

  if (response.data.token) {
    sessionStorage.setItem(`token-${tabId}`, response.data.token);
    sessionStorage.setItem(`user-${tabId}`, JSON.stringify(response.data.user));
  }

  return response.data;
};

const logout = () => {
  sessionStorage.removeItem(`token-${tabId}`);
  sessionStorage.removeItem(`user-${tabId}`);
};

const getToken = () => {
  return sessionStorage.getItem(`token-${tabId}`);
};

const authService = {
  signup,
  login,
  logout,
  getToken, 
};

export default authService;
