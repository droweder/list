// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Member } from '@/types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: Member | null;
  login: (user: Member) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Member | null>(null);

  const login = (loggedInUser: Member) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
