"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { FolderHeart, Trash2, Eye, Compass, Plus, Loader2 } from 'lucide-react';

export default function ManageTripsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Query user-specific custom trips
  const { data: trips = [], isLoading: tripsLoading, refetch } = useQuery({
    queryKey: ['userTrips'],
    queryFn: async () => {
      const res = await api.get('/trips/user');
      return res.data;
    },
    enabled: !!user,
  });

  // Delete trip mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/trips/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTrips'] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      alert("Trip successfully deleted!");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to delete trip.");
    }
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
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

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 glow-indigo">
              <FolderHeart className="size-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-white">Manage Your Trips</h1>
              <p className="text-xs text-slate-400 mt-0.5">Check, edit, review, or delete custom travel destinations you added.</p>
            </div>
          </div>

          <Link
            href="/items/add"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 glow-indigo text-white font-bold py-2.5 px-4 text-xs transition"
          >
            <Plus className="size-4" />
            <span>Add New Trip</span>
          </Link>
        </div>

        {/* Trips List Container */}
        {tripsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin size-10 text-indigo-500" />
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl glass-panel p-16 text-center border-slate-850">
            <Compass className="size-12 text-slate-650 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Custom Destinations Uploaded</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              You haven't uploaded any custom trips yet. Create your first destination to start classification and analysis.
            </p>
            <Link
              href="/items/add"
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 text-xs transition"
            >
              <Plus className="size-4" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl glass-panel bg-slate-900/10 border border-slate-800/80 overflow-hidden">
            
            {/* Table layout on desktop, list on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-400 uppercase tracking-wider text-[10px] font-semibold bg-slate-950/40">
                    <th className="py-4.5 px-6">Destination Info</th>
                    <th className="py-4.5 px-6">Category</th>
                    <th className="py-4.5 px-6">Price</th>
                    <th className="py-4.5 px-6">Travel Dates</th>
                    <th className="py-4.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip: any) => (
                    <tr 
                      key={trip._id} 
                      className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors text-xs text-slate-300"
                    >
                      {/* Image + Title */}
                      <td className="py-4 px-6 flex items-center gap-4.5 min-w-[280px]">
                        <img 
                          src={trip.imageUrl} 
                          alt={trip.title} 
                          className="size-12 rounded-lg object-cover border border-slate-850" 
                        />
                        <div className="truncate max-w-[200px]">
                          <div className="font-bold text-white text-sm truncate">{trip.title}</div>
                          <div className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <span>{trip.location}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6">
                        <span className="inline-flex rounded-full bg-indigo-950/20 border border-indigo-900/40 px-2.5 py-1 text-[10px] font-semibold text-indigo-300">
                          {trip.category}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-6 font-bold text-white text-sm">
                        ${trip.price}
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-6">
                        {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center min-w-[150px]">
                        <div className="flex items-center justify-center gap-2">
                          
                          {/* View details button */}
                          <Link
                            href={`/trips/${trip._id}`}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-950/60 border border-indigo-900/50 hover:bg-indigo-900/40 text-indigo-300 transition"
                            title="View Public Details"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(trip._id, trip.title)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-red-950/60 border border-red-900/50 hover:bg-red-900/40 text-red-300 transition disabled:opacity-50"
                            title="Delete Trip Offer"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
