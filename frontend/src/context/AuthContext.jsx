import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // מזהה ייחודי ללשונית
  const tabId = sessionStorage.getItem('tabId') || crypto.randomUUID();
  sessionStorage.setItem('tabId', tabId);

  // state המשתמש מבוסס על ה-sessionStorage של הלשונית
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem(`user-${tabId}`)) || null
  );
  const [token, setToken] = useState(sessionStorage.getItem(`token-${tabId}`) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    
    // שמירת הטוקן ומידע המשתמש ב-sessionStorage ייחודי ללשונית
    sessionStorage.setItem(`token-${tabId}`, data.token);
    sessionStorage.setItem(`user-${tabId}`, JSON.stringify(data.user));

    setUser(data.user);
    setToken(data.token);
    setIsAuthenticated(true);

    return data;
  };

  const logout = () => {
    sessionStorage.removeItem(`token-${tabId}`);
    sessionStorage.removeItem(`user-${tabId}`);
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    authService.logout();
  };

  const value = { user, token, isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
