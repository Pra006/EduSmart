import React, { createContext, useState, useContext, useEffect } from 'react';

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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // --- SYNC STORAGE ---
        // If the user is found, ensure the ID is in localStorage
        if (data.user && data.user._id) {
          localStorage.setItem("userId", data.user._id);
        }
      } else {
        // If auth fails, clear the storage to prevent "undefined" strings
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem("userId");
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    
    // --- CRITICAL FIX ---
    // Save the ID to localStorage as soon as login happens
    if (userData && userData._id) {
      localStorage.setItem("userId", userData._id);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/user/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      
      // --- CLEANUP ---
      // Remove the ID so the next user doesn't use the old ID
      localStorage.removeItem("userId");
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};