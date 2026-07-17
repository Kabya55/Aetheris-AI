"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Lock, UserPlus, Sparkles, AlertCircle, User, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all registration fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-xs text-slate-400 mt-1.5">Join Aetheris and optimize your global travels.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-950/40 border border-red-900/40 p-4 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex gap-3 items-center text-slate-500">
                  <User className="size-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm rounded-lg glass-input pl-10 bg-slate-950/60"
                  disabled={isSubmitting}
                />
              </div>
            </div>

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
                  placeholder="•••••••• (Min 6 chars)"
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="size-4" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-sm rounded-lg glass-input pl-10 pr-10 bg-slate-950/60"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 transition glow-indigo text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="size-4" />
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-indigo-400 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
