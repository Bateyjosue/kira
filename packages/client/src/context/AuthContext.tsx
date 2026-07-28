import React, { createContext, useContext, useState, useEffect } from 'react';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
}

interface AuthContextType {
  token: string | null;
  doctor: Doctor | null;
  login: (token: string, doctor: Doctor) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('carebridge_token'));
  const [doctor, setDoctor] = useState<Doctor | null>(
    localStorage.getItem('carebridge_doctor') ? JSON.parse(localStorage.getItem('carebridge_doctor')!) : null
  );

  const login = (newToken: string, newDoctor: Doctor) => {
    localStorage.setItem('carebridge_token', newToken);
    localStorage.setItem('carebridge_doctor', JSON.stringify(newDoctor));
    setToken(newToken);
    setDoctor(newDoctor);
  };

  const logout = () => {
    localStorage.removeItem('carebridge_token');
    localStorage.removeItem('carebridge_doctor');
    setToken(null);
    setDoctor(null);
  };

  return (
    <AuthContext.Provider value={{ token, doctor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
