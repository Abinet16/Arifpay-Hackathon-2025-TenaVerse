import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = authService.getCurrentUser();
      
      if (token && savedUser) {
        setUser(savedUser);
        try {
          // Verify token is still valid
          const profile = await authService.getProfile();
          setUser(profile.user);
        } catch (error) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};