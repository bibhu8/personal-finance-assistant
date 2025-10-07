import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/axios'; // Ensure this path is correct

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    // This function now works because authAPI.getMe() exists
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (error) {
      // Your axios interceptor already handles 401 errors, 
      // but this catch is good for other potential issues.
      console.error("Could not fetch user.", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // We only fetch the user if a token exists.
    if (token) {
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      await fetchUser(); // This will now succeed
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      localStorage.setItem('token', response.data.token);
      await fetchUser(); // This will also succeed
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optional: redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};