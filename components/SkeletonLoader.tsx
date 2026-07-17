"use client";

import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div 
          key={idx} 
          className="flex flex-col h-[400px] w-full rounded-2xl border border-slate-800 bg-slate-900/20 overflow-hidden animate-pulse"
        >
          {/* Pulsing Image area */}
          <div className="h-48 w-full bg-slate-800/80" />
          
          {/* Pulsing Text area */}
          <div className="flex flex-col flex-1 p-5 space-y-4">
            <div className="h-6 w-3/4 rounded bg-slate-800" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-800" />
            </div>
            
            {/* Meta details */}
            <div className="border-t border-slate-800/60 pt-4 mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-1/3 rounded bg-slate-800" />
                <div className="h-3 w-1/4 rounded bg-slate-800" />
              </div>
              
              {/* Button & Price */}
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1.5">
                  <div className="h-2 w-10 rounded bg-slate-800" />
                  <div className="h-5 w-16 rounded bg-slate-800" />
                </div>
                <div className="h-9 w-24 rounded-lg bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
