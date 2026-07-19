"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Lock, LogIn, Sparkles, AlertCircle, Compass, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
      setIsSubmitting(false);
    }
  };

  // Demo account filler and submitter
  const handleDemoLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    // Fill credentials visually
    setEmail('kabya@aetheris.ai');
    setPassword('password123');
    
    try {
      await login('kabya@aetheris.ai', 'password123');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await googleLogin();
    } catch (err: any) {
      setError(err.message || 'Google Auth simulation failed');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-950/40 relative">
        <div className="absolute top-1/4 left-1/3 size-96 bg-indigo-500/10 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-1/4 right-1/3 size-96 bg-emerald-500/5 rounded-full blur-3xl z-0" />

        <div className="relative z-10 w-full max-w-md rounded-2xl glass-panel bg-slate-900/60 p-8 border border-slate-800/80">
          
          <div className="text-center mb-8">
            <span className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 mb-4 glow-indigo">
              <Sparkles className="size-6" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1.5">Sign in to deploy your agentic itineraries.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-950/40 border border-red-900/40 p-4 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="size-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm rounded-lg glass-input pl-10 bg-slate-950/60"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="size-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm rounded-lg glass-input pl-10 pr-10 bg-slate-950/60"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 transition glow-indigo text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="size-4" />
              <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Social Sign-in Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-3 text-slate-500 font-semibold tracking-wider">Quick Actions</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* One-Click Demo Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-900/50 hover:bg-emerald-900/40 text-emerald-200 py-3 text-xs font-bold transition disabled:opacity-50"
            >
              <Sparkles className="size-3.5" />
              <span>Demo Login</span>
            </button>

            {/* Social Google Login */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white py-3 text-xs font-bold transition disabled:opacity-50"
            >
              <svg className="size-3.5 fill-current text-indigo-400 shrink-0" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.705 0 3.255.61 4.475 1.616l2.39-2.39C17.29 1.557 14.89 1 12.24 1 6.72 1 2.24 5.48 2.24 11s4.48 10 10 10c5.76 0 10-4.04 10-10 0-.675-.08-1.32-.2-1.715h-9.8z" />
              </svg>
              <span>Google Sign-In</span>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
