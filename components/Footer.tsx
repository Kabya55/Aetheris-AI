"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Sparkles, MessageCircleCode } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing! Our AI newsletter agents will be in touch shortly.');
  };

  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="flex items-center justify-center rounded-lg bg-indigo-600 p-1.5 text-white glow-indigo">
                <Sparkles className="size-4" />
              </span>
              <span>Aetheris AI</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering global travelers with next-generation autonomous AI travel planning, intelligent budgets, and automated voucher analytics.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-400 transition">
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-400 transition">
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-400 transition">
                <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-400 transition">
                <MessageCircleCode className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Discover</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-sm text-slate-400 hover:text-white transition">Explore Trips</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition">About Our AI</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition">Get Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-indigo-400 shrink-0" />
                <span>12 AI Boulevard, Silicon Hub, CA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-indigo-400 shrink-0" />
                <span>+1 (555) 234-9874</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-indigo-400 shrink-0" />
                <a href="mailto:support@aetheris.ai" className="hover:text-white transition">support@aetheris.ai</a>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase mb-4">Stay Inspired</h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get weekly AI-optimized itineraries, safety alerts, and budget travel advice directly.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email"
                className="w-full text-xs rounded-lg glass-input bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 py-2.5 px-3"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 transition glow-indigo flex items-center justify-center"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-900/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Aetheris AI Technologies, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <Link href="/about" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-400">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
