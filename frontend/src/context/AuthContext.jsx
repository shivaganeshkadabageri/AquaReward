import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API_URL = 'http://localhost:8080/api';

// Create a globally pre-configured Axios instance
export const api = axios.create({
  baseURL: API_URL,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aq_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('aq_token') || null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('aq_theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Keep axios authorization header in sync
  useEffect(() => {
    if (token) {
      localStorage.setItem('aq_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('aq_token');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Keep user in localstorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('aq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aq_user');
    }
  }, [user]);

  // Handle dark mode theme change on DOM
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('aq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('aq_theme', 'light');
    }
  }, [darkMode]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const data = response.data;
      setToken(data.token);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        hotelId: data.hotelId,
        roomNumber: data.roomNumber,
      });
      return { success: true, role: data.role };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data || error.message || 'Authentication failed. Please verify credentials.',
      };
    }
  };

  const register = async (signUpData) => {
    try {
      await axios.post(`${API_URL}/auth/register`, signUpData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data || error.message || 'Registration failed.',
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aq_token');
    localStorage.removeItem('aq_user');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, register, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
