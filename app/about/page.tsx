"use client";

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Compass, Sparkles, Shield, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">

        {/* Title Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="flex items-center gap-1 mx-auto w-fit rounded-full bg-indigo-950/60 border border-indigo-500/40 text-xs font-semibold tracking-wide text-indigo-300 py-1.5 px-4 mb-2 animate-pulse">
            <Sparkles className="size-4" />
            <span>Redefining Global Travel Planning</span>
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">About Aetheris AI</h1>
          <p className="text-sm md:text-base text-slate-450 leading-relaxed text-slate-400">
            We merge robust full-stack engineering with advanced Large Language Model reasoning agent systems, building a seamless booking parser, budget tracker, and conversational experience.
          </p>
        </div>

        {/* Banner graphic */}
        <div className="relative h-72 rounded-2xl overflow-hidden border border-slate-900 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
            alt="AI technology travel banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-4">
            <Compass className="size-8 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Autonomous Agents</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our travel planner maps out day-by-day activities, meal options, packing lists, and local transportation guidelines dynamically.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-4">
            <Cpu className="size-8 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Gemini Foundation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Harnessing Google Gemini generative AI models to complete budget calculations, categorize trips, and parse complex ticket confirmation formats.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 space-y-4">
            <Shield className="size-8 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Resiliency First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered with connection auto-fallbacks. The application operates instantly with in-memory stores and mock services during API outages.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="border-t border-slate-900 pt-12 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Meet Our Architects</h2>
            <p className="text-xs text-slate-450 mt-1.5 text-slate-400">The engineers behind Aetheris AI Travel Systems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Kabya Kishor Halder", role: "Lead Systems Engineer", desc: "Specializes in secure API design, database schemas, and AI agent prompt templates.", img: "K" },
              { name: "Kabita Rani Halder", role: "AI Assistant Architect", desc: "Designed the self-healing fallbacks, conversational assistants, and Recharts analytics dashboards.", img: "A" }
            ].map((member, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-900 bg-slate-900/20 flex gap-4.5 items-center">
                <div className="size-12 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 flex items-center justify-center font-bold text-lg glow-indigo shrink-0">
                  {member.img}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{member.name}</h4>
                  <span className="text-[10px] text-indigo-400 font-semibold block uppercase tracking-wider">{member.role}</span>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
