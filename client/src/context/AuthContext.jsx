import { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(undefined);

const API_BASE = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('avikesh-admin-token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('avikesh-admin-token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
        setToken(storedToken);
      } else {
        localStorage.removeItem('avikesh-admin-token');
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem('avikesh-admin-token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('avikesh-admin-token', data.token);
    setToken(data.token);
    setUser(data.data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('avikesh-admin-token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, logout, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
