"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Compass, PlusCircle, FolderHeart, LayoutDashboard, MessageSquareCode, LogOut, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Logged-out Links (Min 3 required)
  const publicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  // Logged-in Links (Min 5 required)
  const privateLinks = [
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Add Trip', href: '/items/add', icon: PlusCircle },
    { label: 'Manage Trips', href: '/items/manage', icon: FolderHeart },
    { label: 'AI Hub', href: '/ai-hub', icon: LayoutDashboard },
    { label: 'AI Chat', href: '/chat', icon: MessageSquareCode },
  ];

  const linksToRender = user ? privateLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white transition hover:opacity-90">
              <span className="flex items-center justify-center rounded-lg bg-indigo-600 p-1.5 text-white glow-indigo">
                <Sparkles className="size-5" />
              </span>
              <span>Aetheris <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">AI</span></span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {user && (
                <Link
                  href="/"
                  className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${
                    isActive('/') ? 'text-indigo-400 bg-indigo-950/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Home
                </Link>
              )}
              {linksToRender.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition ${
                      isActive(link.href)
                        ? 'text-indigo-400 bg-indigo-950/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {Icon && <Icon className="size-4" />}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Auth Buttons (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-1.5 border border-slate-800 text-sm">
                  <User className="size-4 text-emerald-400" />
                  <span className="font-medium text-slate-200">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-lg bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 px-3.5 py-2 text-sm font-medium text-red-200 transition"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 glow-indigo px-4.5 py-2 text-sm font-medium text-white transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-900 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-900 bg-slate-950/95 px-2 pt-2 pb-4 space-y-1">
          {user && (
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-base font-medium transition ${
                isActive('/') ? 'text-indigo-400 bg-indigo-950/40' : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Home
            </Link>
          )}
          {linksToRender.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block rounded-md px-3 py-2.5 text-base font-medium transition ${
                isActive(link.href)
                  ? 'text-indigo-400 bg-indigo-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-900 pt-4 mt-4 px-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-slate-300 text-sm py-1">
                  <User className="size-4 text-emerald-400" />
                  <span>Logged in as: <strong className="text-white">{user.name}</strong></span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 py-2.5 text-base font-medium text-red-200 transition"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg border border-slate-800 py-2.5 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-base font-medium text-white transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
