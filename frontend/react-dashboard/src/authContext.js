import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  const updateToken = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setAuthToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ authToken, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);