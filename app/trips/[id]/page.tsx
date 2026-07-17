"use client";

import React, { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import DestinationCard from '../../../components/DestinationCard';
import { Star, MapPin, Calendar, Users2, ShieldAlert, Sparkles, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [reviews, setReviews] = useState<Review[]>([
    { name: "Tanvir Rahman", rating: 5, comment: "One of the best trips I've ever taken. The scheduling was perfect and the views were breathtaking.", date: "2026-06-12" },
    { name: "Israt Jahan", rating: 4, comment: "Really nice adventure. Local dining suggestions were spot-on. Definitely recommend.", date: "2026-06-08" }
  ]);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  // Fetch trip details and recommendation listings
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tripDetails', id],
    queryFn: async () => {
      const res = await api.get(`/trips/${id}`);
      return res.data;
    },
  });

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) {
      alert("Please fill in name and review message");
      return;
    }
    const newRev: Review = {
      name: revName,
      rating: revRating,
      comment: revComment,
      date: new Date().toISOString().split('T')[0]!,
    };
    setReviews([newRev, ...reviews]);
    setRevName('');
    setRevComment('');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-650" />
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !data?.trip) {
    return (
      <>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <ShieldAlert className="size-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Trip Not Found</h2>
          <p className="text-xs text-slate-400 max-w-sm mb-6">The requested travel itinerary either does not exist or has been removed.</p>
          <Link href="/explore" className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-bold transition">
            Back to Explore
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const { trip, relatedTrips = [] } = data;

  const dateRange = () => {
    const s = new Date(trip.startDate);
    const e = new Date(trip.endDate);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return {
      days: diffDays,
      start: s.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      end: e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  };

  const schedule = dateRange();

  // Supplementary mock carousel images based on destination
  const gallery = [
    trip.imageUrl,
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <>
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-350 transition">Home</Link>
          <ChevronRight className="size-3 shrink-0" />
          <Link href="/explore" className="hover:text-slate-350 transition">Explore</Link>
          <ChevronRight className="size-3 shrink-0" />
          <span className="text-slate-300 truncate">{trip.title}</span>
        </div>

        {/* Top Grid: Images and Key Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Images Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-96 w-full rounded-2xl overflow-hidden border border-slate-900 shadow-2xl">
              <img src={trip.imageUrl} alt={trip.title} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 rounded-full bg-slate-950/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-indigo-400 border border-slate-800">
                {trip.category}
              </div>
            </div>
            
            {/* Grid of secondary photos */}
            <div className="grid grid-cols-3 gap-4">
              {gallery.map((img, idx) => (
                <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-slate-900 hover:border-slate-700 transition">
                  <img src={img} alt="Trip detail" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Key Specifications & Action Box */}
          <div className="lg:col-span-1 rounded-2xl glass-panel bg-slate-900/20 p-6 border border-slate-800/80 h-fit space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white leading-tight">{trip.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-white">{trip.rating?.toFixed(1) || '4.5'}</span>
                <span className="text-xs text-slate-500">({reviews.length} Traveler Reviews)</span>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="space-y-4 border-t border-b border-slate-850 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/40">
                  <MapPin className="size-4 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Location</span>
                  <span className="text-sm font-bold text-slate-200">{trip.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/40">
                  <Calendar className="size-4 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Duration</span>
                  <span className="text-sm font-bold text-slate-200">{schedule.days} Days ({schedule.start} - {schedule.end})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/40">
                  <Users2 className="size-4 shrink-0" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Group Size</span>
                  <span className="text-sm font-bold text-slate-200">Max 12 People (Cozy Style)</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Cost</span>
                <span className="text-3xl font-black text-white flex items-center gap-0.5">
                  <span className="text-lg text-emerald-400 font-bold">$</span>
                  <span>{trip.price}</span>
                </span>
              </div>

              <Link
                href="/ai-hub"
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 glow-indigo text-white font-bold px-5 py-3.5 transition text-sm group"
              >
                <Sparkles className="size-4" />
                <span>Auto-Plan AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          
          {/* Left Columns: Overview, Packing list and Reviews */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Description / Overview Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white border-b border-slate-850 pb-2">Trip Overview</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{trip.description}</p>
            </div>

            {/* Key Tags Section */}
            {trip.tags && trip.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Classified Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {trip.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="text-xs rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-indigo-300 py-1.5 px-3"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews / Ratings Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white border-b border-slate-850 pb-2">Traveler Reviews</h2>
              
              {/* Form to submit review */}
              <form onSubmit={handleAddReview} className="rounded-xl glass-panel bg-slate-900/20 p-5 border-slate-800 space-y-4">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Leave a Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Stars Rating</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Great)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Terrible)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Review Comment</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share details of your experience..."
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 text-xs transition"
                >
                  <Send className="size-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>

              {/* Feed of Reviews */}
              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{rev.name}</span>
                      <span className="text-slate-500">{rev.date}</span>
                    </div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Right Column: AI Plan Guarantee / Safety */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-5 space-y-4">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/40">
                <CheckCircle2 className="size-5" />
              </span>
              <h3 className="text-sm font-bold text-white">Safe Travel Guarantee</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All trips on Aetheris are parsed by security scanners. We monitor local travel alerts and safety metrics automatically.
              </p>
            </div>

            <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-5 space-y-4">
              <span className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-900/40">
                <Sparkles className="size-5" />
              </span>
              <h3 className="text-sm font-bold text-white">AI Recommendation Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Our recommendation engine uses contextual categories and location tokens to suggest the best alternatives.
              </p>
            </div>
          </div>

        </div>

        {/* SECTION: Related / Recommendations */}
        {relatedTrips && relatedTrips.length > 0 && (
          <div className="border-t border-slate-900 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Related Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedTrips.map((rel: any) => (
                <DestinationCard key={rel._id} trip={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
