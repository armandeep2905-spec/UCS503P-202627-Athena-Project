import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('athena_token');
    const savedUser = localStorage.getItem('athena_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('athena_user');
      }
    }
    setLoading(false);
  }, []);

  const persistAuth = useCallback((tokenValue, userData) => {
    localStorage.setItem('athena_token', tokenValue);
    localStorage.setItem('athena_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    if (result.data) {
      persistAuth(result.data.token, result.data.user);
    }
    return result;
  }, [persistAuth]);

  const register = useCallback(async (data) => {
    const result = await authApi.register(data);
    if (result.data) {
      persistAuth(result.data.token, result.data.user);
    }
    return result;
  }, [persistAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('athena_token');
    localStorage.removeItem('athena_user');
    localStorage.removeItem('athena_institution');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
