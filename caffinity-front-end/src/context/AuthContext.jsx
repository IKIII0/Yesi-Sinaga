import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cek session saat pertama kali load
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const savedUser = localStorage.getItem('user_data');
      const token = localStorage.getItem('user_token');
      
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Call backend API (deploy Vercel)
      const response = await fetch('https://caffinity-be.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Simpan data user ke state dan localStorage
        const userData = {
          id: data.user.id,
          name: data.user.full_name || data.user.username,
          email: data.user.email,
          phone: data.user.phone || '',
          address: data.user.address || '',
        };
        
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
        localStorage.setItem('user_token', data.token);
        
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Kirim data registrasi ke backend
      const response = await fetch('https://caffinity-be.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Otomatis login setelah registrasi sukses
        const loginResponse = await login(userData.email, userData.password);
        return loginResponse;
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  // Update profile function
  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('user_token');
      const response = await fetch('https://caffinity-be.vercel.app/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update state user
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};