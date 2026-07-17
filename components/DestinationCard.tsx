"use client";

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Calendar, ArrowRight, DollarSign } from 'lucide-react';

interface TripProps {
  trip: {
    _id: string;
    title: string;
    shortDescription: string;
    imageUrl: string;
    price: number;
    location: string;
    rating: number;
    category: string;
    startDate: string | Date;
    endDate: string | Date;
    tags?: string[];
  };
}

export default function DestinationCard({ trip }: TripProps) {
  const formattedDate = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="group flex flex-col h-full rounded-2xl glass-panel bg-slate-900/40 overflow-hidden hover:border-indigo-500/40 hover:shadow-indigo-950/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 border border-slate-800/80">
      
      {/* Image Gallery Header */}
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <img
          src={trip.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={trip.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Category Label Overlay */}
        <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-400 border border-slate-800">
          {trip.category}
        </div>

        {/* Rating Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-yellow-400 border border-slate-800">
          <Star className="size-3.5 fill-yellow-400" />
          <span>{trip.rating?.toFixed(1) || '4.5'}</span>
        </div>
      </div>

      {/* Details Body */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-2">
          {trip.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
          {trip.shortDescription}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 border-t border-slate-800/60 pt-4 mt-auto">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 truncate max-w-[60%]">
              <MapPin className="size-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{trip.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-emerald-400 shrink-0" />
              <span>{formattedDate(trip.startDate)}</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/30">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Starting From</span>
              <span className="text-xl font-black text-white flex items-center gap-0.5">
                <DollarSign className="size-4 text-emerald-400 -mr-0.5" />
                <span>{trip.price}</span>
              </span>
            </div>

            <Link
              href={`/trips/${trip._id}`}
              className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3.5 py-2.5 transition glow-indigo group-hover:scale-105"
            >
              <span>View Details</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
