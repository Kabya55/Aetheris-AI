"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DestinationCard from '../../components/DestinationCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Compass } from 'lucide-react';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceMax, setPriceMax] = useState(3000);
  const [ratingMin, setRatingMin] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  // TanStack Query to fetch filtered/sorted/paginated trips
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trips', search, category, priceMax, ratingMin, sortBy, page],
    queryFn: async () => {
      const params: any = {
        page,
        limit: 8,
      };
      if (search) params.q = search;
      if (category) params.category = category;
      if (priceMax < 3000) params.priceMax = priceMax;
      if (ratingMin > 0) params.ratingMin = ratingMin;
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/trips', { params });
      return res.data;
    },
  });

  const categories = ['Adventure', 'Cultural', 'Relaxing', 'Nature', 'Luxury', 'Budget'];

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setPriceMax(3000);
    setRatingMin(0);
    setSortBy('');
    setPage(1);
  };

  const trips = data?.trips || [];
  const totalPages = data?.pages || 1;

  return (
    <>
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Explore Destinations</h1>
            <p className="text-xs text-slate-400 mt-1">Discover agent-curated travel experiences around the globe.</p>
          </div>
          
          {/* Main search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              placeholder="Search destination, title..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full text-xs rounded-lg glass-input pl-9 bg-slate-900/60"
            />
          </div>
        </div>

        {/* Filters and Card Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side Filter Panel */}
          <div className="lg:col-span-1 rounded-2xl glass-panel bg-slate-900/20 p-6 border border-slate-800/80 h-fit space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <SlidersHorizontal className="size-4 text-indigo-400" />
                <span>Filters</span>
              </span>
              <button 
                onClick={resetFilters} 
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(category === cat ? '' : cat);
                      setPage(1);
                    }}
                    className={`text-xs rounded-full px-3 py-1.5 border transition font-medium ${
                      category === cat
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-850 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span>Max Budget</span>
                <span className="text-emerald-400">${priceMax === 3000 ? 'Any' : priceMax}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={priceMax}
                onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }}
                className="w-full accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                <span>$100</span>
                <span>$3,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Minimum Rating</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 3, 4, 4.5, 4.8].map((rat) => (
                  <button
                    key={rat}
                    onClick={() => { setRatingMin(rat); setPage(1); }}
                    className={`text-xs rounded-lg py-2 border transition font-bold ${
                      ratingMin === rat
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-850 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {rat === 0 ? 'Any' : `${rat}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting options */}
            <div className="pt-4 border-t border-slate-850">
              <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <ArrowUpDown className="size-3.5 text-indigo-400" />
                <span>Sort Options</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full text-xs rounded-lg glass-input bg-slate-950/60 border-slate-800 text-white"
              >
                <option value="">Newest Added</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Listing Grid */}
          <div className="lg:col-span-3 space-y-8">
            {isLoading ? (
              <SkeletonLoader />
            ) : isError ? (
              <div className="rounded-2xl glass-panel p-12 text-center border-red-900/30">
                <X className="size-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Failed to load destinations</h3>
                <p className="text-xs text-slate-400 mb-6">There was an issue connecting to the Aetheris API endpoints.</p>
                <button onClick={() => refetch()} className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-bold transition">
                  Retry Loading
                </button>
              </div>
            ) : trips.length === 0 ? (
              <div className="rounded-2xl glass-panel p-16 text-center border-slate-850">
                <Compass className="size-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Destinations Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">We couldn't find any trips matching your current search parameters. Try expanding your filters.</p>
                <button onClick={resetFilters} className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-bold transition">
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <>
                {/* 4 Cards per row on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {trips.map((trip: any) => (
                    <DestinationCard key={trip._id} trip={trip} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-900 pt-6">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-800/80 bg-slate-950/20 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="size-4" />
                      <span>Previous</span>
                    </button>
                    <span className="text-xs text-slate-400 font-medium">
                      Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
                    </span>
                    <button
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-800/80 bg-slate-950/20 px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <span>Next</span>
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
