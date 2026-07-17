"use client";

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('itinerary');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Message received! Our support agents will contact you at " + email + " within 24 hours.");
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="flex items-center gap-1 mx-auto w-fit rounded-full bg-indigo-950/60 border border-indigo-500/40 text-xs font-semibold tracking-wide text-indigo-300 py-1.5 px-4 mb-2">
            <Sparkles className="size-4" />
            <span>24/7 Global Travel Support</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">Get in Touch</h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Need assistance with booking codes, travel data, or customized itineraries? Send our team a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl glass-panel bg-slate-900/20 p-6 border border-slate-800/80 space-y-6">
              <h2 className="text-base font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-900">Office Channels</h2>
              
              <div className="space-y-4 text-xs md:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Office Headquarters</strong>
                    <span className="text-slate-400">12 AI Boulevard, Silicon Hub, CA</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Phone Hotline</strong>
                    <span className="text-slate-400">+1 (555) 234-9874</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Email Inbox</strong>
                    <span className="text-slate-400">support@aetheris.ai</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1">
                <HelpCircle className="size-4 text-indigo-400" />
                <span>Immediate Assistance</span>
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed text-slate-400">
                Logged-in members can access the streaming AI Conversational Assistant at any time for navigation support and instant checklist compilations.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 rounded-2xl glass-panel bg-slate-900/10 border border-slate-800/80 p-6 md:p-8">
            <h2 className="text-lg font-bold text-white pb-4 border-b border-slate-900 mb-6">Send Support Ticket</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Inquiry Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs rounded-lg glass-input bg-slate-950/60 font-medium"
                  disabled={isSubmitting}
                >
                  <option value="itinerary">AI Itinerary Generation Issues</option>
                  <option value="expenses">Expense Parser & Analytics</option>
                  <option value="account">User Account & Authorization</option>
                  <option value="business">Partnerships & Travel Listings</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Detailed Message *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Outline the details of your inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 transition glow-indigo text-xs disabled:opacity-50"
              >
                {isSubmitting ? <span className="animate-spin rounded-full size-4 border-t-2 border-white" /> : <Send className="size-4" />}
                <span>{isSubmitting ? 'Sending Ticket...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}
