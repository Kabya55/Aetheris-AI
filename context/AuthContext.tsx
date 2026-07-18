"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '../lib/auth-client';

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

  // Load session status from Better Auth Client on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData) {
          const formattedUser = {
            id: sessionData.user.id,
            name: sessionData.user.name,
            email: sessionData.user.email,
            role: (sessionData.user as any).role || 'user',
          };
          setUser(formattedUser);
          
          // Better Auth stores the token in localStorage/cookies.
          // We can read the bearer token if we need it for Axios, or read from localStorage.
          const localToken = localStorage.getItem('aetheris_token');
          setToken(localToken);
        }
      } catch (err) {
        console.error('Failed to sync Better Auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: (ctx) => {
          // Retrieve bearer token from response header set by bearer plugin
          const authToken = ctx.response.headers.get("set-auth-token");
          if (authToken) {
            localStorage.setItem('aetheris_token', authToken);
          }
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      if (!data?.user) {
        throw new Error('Authentication returned empty user data.');
      }
      
      const userProfile = data.user;
      const formattedUser = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: (userProfile as any).role || 'user',
      };
      
      localStorage.setItem('aetheris_user', JSON.stringify(formattedUser));
      
      const updatedToken = localStorage.getItem('aetheris_token');
      setToken(updatedToken);
      setUser(formattedUser);
      
      router.push('/explore');
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      }, {
        onSuccess: (ctx) => {
          // Retrieve bearer token from response header set by bearer plugin
          const authToken = ctx.response.headers.get("set-auth-token");
          if (authToken) {
            localStorage.setItem('aetheris_token', authToken);
          }
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Registration failed');
      }

      if (!data?.user) {
        throw new Error('Signup returned empty user data.');
      }
      
      const userProfile = data.user;
      const formattedUser = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: (userProfile as any).role || 'user',
      };
      
      localStorage.setItem('aetheris_user', JSON.stringify(formattedUser));
      
      const updatedToken = localStorage.getItem('aetheris_token');
      setToken(updatedToken);
      setUser(formattedUser);
      
      router.push('/explore');
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const mockGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // Attempt login with pre-created demo user for visual simulation
      await login('kabya@aetheris.ai', 'password123');
    } catch (err: any) {
      // Fallback: If user doesn't exist yet, register and then login
      try {
        await register('Kabya Kishor Halder', 'kabya@aetheris.ai', 'password123');
      } catch (regErr: any) {
        throw new Error(regErr.message || 'Google sign-in simulation failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error('Better Auth signout failed:', err);
    }
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
