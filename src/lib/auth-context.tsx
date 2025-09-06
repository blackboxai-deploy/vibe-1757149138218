"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const storedUser = localStorage.getItem('mindcare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call - in production, this would hit your auth API
      const storedUsers = JSON.parse(localStorage.getItem('mindcare_users') || '[]');
      const foundUser = storedUsers.find((u: any) => 
        u.email === email && u.password === password
      );

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: foundUser.createdAt,
          lastLogin: new Date(),
        };
        
        setUser(userSession);
        localStorage.setItem('mindcare_user', JSON.stringify(userSession));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('mindcare_users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        return false;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, this would be hashed
        name,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      storedUsers.push(newUser);
      localStorage.setItem('mindcare_users', JSON.stringify(storedUsers));

      const userSession = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin,
      };

      setUser(userSession);
      localStorage.setItem('mindcare_user', JSON.stringify(userSession));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindcare_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}