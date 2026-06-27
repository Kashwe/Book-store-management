import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setLogoutHandler } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Verify token is still valid by fetching current profile
      api.get('/api/users/profile')
        .then((res) => {
          const updatedUser = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone,
            address: res.data.address,
            role: res.data.role
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    setLogoutHandler(logout);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, id, name, email: userEmail, role } = response.data;
    
    const loggedUser = { id, name, email: userEmail, role };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    
    setToken(token);
    setUser(loggedUser);
    
    return loggedUser;
  };

  const register = async (name, email, password, phone, address) => {
    await api.post('/api/auth/register', { name, email, password, phone, address });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
