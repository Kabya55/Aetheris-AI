"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  mockGoogleLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Read persisted token and user data on load
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('aetheris_token');
      const savedUser = localStorage.getItem('aetheris_user');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userProfile } = res.data;
      
      localStorage.setItem('aetheris_token', jwtToken);
      localStorage.setItem('aetheris_user', JSON.stringify(userProfile));
      
      setToken(jwtToken);
      setUser(userProfile);
      
      router.push('/explore');
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/register', { name, email, password });
      const { token: jwtToken, user: userProfile } = res.data;
      
      localStorage.setItem('aetheris_token', jwtToken);
      localStorage.setItem('aetheris_user', JSON.stringify(userProfile));
      
      setToken(jwtToken);
      setUser(userProfile);
      
      router.push('/explore');
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const mockGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Simulate OAuth exchange
      const mockData = {
        name: 'Kabya Rahman',
        email: 'kabya@aetheris.ai',
        googleId: 'g-9847120398',
      };
      
      const res = await api.post('/auth/google-mock', mockData);
      const { token: jwtToken, user: userProfile } = res.data;
      
      localStorage.setItem('aetheris_token', jwtToken);
      localStorage.setItem('aetheris_user', JSON.stringify(userProfile));
      
      setToken(jwtToken);
      setUser(userProfile);
      
      router.push('/explore');
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('aetheris_token');
    localStorage.removeItem('aetheris_user');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, mockGoogleLogin, logout }}>
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
