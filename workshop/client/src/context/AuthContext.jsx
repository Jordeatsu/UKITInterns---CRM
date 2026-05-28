import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem('advisor_token'));
  const [advisor, setAdvisor] = useState(() => {
    try { return JSON.parse(localStorage.getItem('advisor_user')); } catch { return null; }
  });

  const login = useCallback((newToken, advisorData) => {
    localStorage.setItem('advisor_token', newToken);
    localStorage.setItem('advisor_user', JSON.stringify(advisorData));
    setToken(newToken);
    setAdvisor(advisorData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('advisor_token');
    localStorage.removeItem('advisor_user');
    setToken(null);
    setAdvisor(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, advisor, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
