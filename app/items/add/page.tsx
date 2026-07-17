"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { PlusCircle, Sparkles, MapPin, Tag, ArrowRight, Calendar, DollarSign, Loader2 } from 'lucide-react';

export default function AddTripPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Adventure');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // AI Tagging States
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [isTagging, setIsTagging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerAutoTag = async () => {
    if (!title || !description) {
      alert("Please fill in Title and Full Description to trigger AI auto-tagging.");
      return;
    }
    setIsTagging(true);
    try {
      const res = await api.post('/ai/auto-tag', { title, description });
      if (res.data?.tags) {
        setAiTags(res.data.tags);
      }
    } catch (err) {
      console.error("Auto tag failed, using local fallback tags", err);
      // Fallback local tags
      setAiTags(['Adventure', 'Trending', 'Nature']);
    } finally {
      setIsTagging(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !description || !location || !price || !startDate || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        shortDescription,
        description,
        location,
        category,
        price: Number(price),
        startDate,
        endDate,
        imageUrl: imageUrl || undefined,
        tags: aiTags,
      };
      await api.post('/trips', payload);
      alert("Successfully created trip!");
      router.push('/items/manage');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create trip.");
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin size-8 text-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 glow-indigo">
            <PlusCircle className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-white">Add Custom Destination</h1>
            <p className="text-xs text-slate-400 mt-0.5">Upload a new trip offering. AI models will tag labels automatically.</p>
          </div>
        </div>

        <div className="rounded-2xl glass-panel bg-slate-900/40 border border-slate-800/80 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Trip Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mount Everest Base Camp Trek"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                >
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Relaxing">Relaxing</option>
                  <option value="Nature">Nature</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>
            </div>

            {/* Location & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-355 uppercase tracking-wider mb-2">Location *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <MapPin className="size-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solukhumbu, Nepal"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input pl-9 bg-slate-950/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Price ($) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <DollarSign className="size-4" />
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 1400"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input pl-9 bg-slate-950/60"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Start Date *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Calendar className="size-4" />
                  </span>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input pl-9 bg-slate-950/60 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">End Date *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Calendar className="size-4" />
                  </span>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input pl-9 bg-slate-950/60 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Image URL (Optional)</label>
              <input
                type="url"
                placeholder="e.g. https://images.unsplash.com/... (Leaves default if empty)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
              />
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Short Description (Cards view) *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Embark on a challenging trek to the foot of Mount Everest."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 uppercase tracking-wider mb-2">Full Description (Detail view) *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Outline the detailed itinerary, accommodations, inclusions, and difficulty metrics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                />
              </div>
            </div>

            {/* AI Auto-Tagging Actions */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Sparkles className="size-4 text-indigo-400" />
                  <span>AI Agent Auto-Classification</span>
                </span>
                <button
                  type="button"
                  onClick={triggerAutoTag}
                  disabled={isTagging}
                  className="rounded-lg bg-indigo-950/60 border border-indigo-900/50 hover:bg-indigo-900/40 text-indigo-300 px-3.5 py-2 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isTagging ? <Loader2 className="animate-spin size-3.5" /> : null}
                  <span>{isTagging ? 'Predicting...' : 'Predict Tags'}</span>
                </button>
              </div>

              {aiTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                  {aiTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] rounded-full bg-indigo-950/20 border border-indigo-900/40 text-indigo-300 py-1.5 px-3 font-semibold"
                    >
                      <Tag className="size-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 italic">No AI tags generated yet. Click Predict Tags after writing titles.</p>
              )}
            </div>

            {/* Submit Control */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 transition glow-indigo text-sm disabled:opacity-50"
            >
              <PlusCircle className="size-4" />
              <span>{isSubmitting ? 'Uploading Destination...' : 'Add Destination'}</span>
            </button>

          </form>
        </div>

      </div>

      <Footer />
    </>
  );
}
