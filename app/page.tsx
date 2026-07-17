"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Compass, Map, BadgeDollarSign, ClipboardList, 
  HelpCircle, ChevronDown, CheckCircle2, Award, Users2, PlaneTakeoff, 
  Globe2, ArrowRight, Quote, CalendarDays, BookOpen, Clock 
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background slides for Hero Carousel
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
      tagline: "Explore Smarter, Plan Instantly",
      title: "Agentic AI Tailored Journeys"
    },
    {
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
      tagline: "Wander More, Stress Less",
      title: "Discover Exquisite Destinations"
    },
    {
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
      tagline: "Your Budget, Automated",
      title: "Intelligent Expense Analysis"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  // Static items for Featured Destination cards (4 cards)
  const featuredDestinations = [
    {
      id: "mock-trip-1",
      title: "Wonders of Paris & Louvre Tour",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80",
      price: 1200,
      rating: 4.8,
      location: "Paris, France",
      tag: "Cultural"
    },
    {
      id: "mock-trip-2",
      title: "Bali Tropical Spa Retreat",
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
      price: 600,
      rating: 4.7,
      location: "Ubud, Indonesia",
      tag: "Relaxing"
    },
    {
      id: "mock-trip-3",
      title: "Swiss Alps Extreme Ski Summit",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      price: 1800,
      rating: 4.9,
      location: "Zermatt, Switzerland",
      tag: "Adventure"
    },
    {
      id: "mock-trip-4",
      title: "Serengeti Wild Safari Expedition",
      imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80",
      price: 1500,
      rating: 4.9,
      location: "Serengeti, Kenya",
      tag: "Nature"
    }
  ];

  const features = [
    {
      icon: Map,
      title: "AI Itinerary Creator",
      desc: "Input your style and duration; our agent outlines complete morning, afternoon, and night plans."
    },
    {
      icon: BadgeDollarSign,
      title: "AI Budget Analyzer",
      desc: "Upload CSV/JSON expense reports; receive category graphs and smart optimization recommendations."
    },
    {
      icon: ClipboardList,
      title: "Voucher Parser",
      desc: "Scan confirmation receipts or copy text to extract confirmation codes and checklists instantly."
    },
    {
      icon: Sparkles,
      title: "Auto Tagging Classifier",
      desc: "AI automatically applies custom descriptive tags like 'Solo-Friendly' and 'Eco-Tour' to your custom uploads."
    }
  ];

  const faqs = [
    {
      q: "How does the AI Itinerary Generator operate?",
      a: "Our agent connects with the Gemini API to analyze parameters such as travel pace, style, and duration. It creates structured itineraries featuring localized dining tips, estimated expenses, and packing guides."
    },
    {
      q: "Can I try the app without configuring real API keys?",
      a: "Absolutely! The system is engineered to self-heal. If MongoDB or Gemini keys are missing, the backend triggers in-memory local data stores and high-fidelity mock generators so all CRUD features and AI labs function instantly."
    },
    {
      q: "How do I upload custom travel expense sheets?",
      a: "Visit the AI Hub and navigate to the Expense Analyzer tab. You can copy-paste raw comma-separated lists or JSON structures and click 'Analyze Budget' to render Recharts diagrams."
    },
    {
      q: "Is there a demonstration login available?",
      a: "Yes! On the Login page, you will find a 'One-Click Demo Login' button that automatically fills the email/password credentials and logs you in instantly."
    }
  ];

  const blogs = [
    {
      title: "How Agentic AI is Revolutionizing Modern Budget Travel",
      excerpt: "Uncover how travelers utilize conversational agents to slash booking costs, track flights, and bypass premium booking markups.",
      date: "Jul 15, 2026",
      readTime: "5 min read",
      author: "Sofia Alen",
      tag: "Tech Travel"
    },
    {
      title: "Top 5 Secluded Destinations in Bali You Won't Find on Socials",
      excerpt: "Step away from crowded beaches. Explore hidden eco-lodges, waterfalls, and pristine shrines in Northern Ubud.",
      date: "Jul 10, 2026",
      readTime: "7 min read",
      author: "Marcus Ray",
      tag: "Adventure"
    },
    {
      title: "The Ultimate Pre-Travel Checklist: Don't Leave Without Doing This",
      excerpt: "From credit holds to universal adapters, review the absolute checklist before boarding international flights.",
      date: "Jun 28, 2026",
      readTime: "4 min read",
      author: "David Vance",
      tag: "Guides"
    }
  ];

  return (
    <>
      <Navbar />

      {/* SECTION 1: HERO SECTION (Frosted Glass Overlay + Carousel) */}
      <section className="relative h-[65vh] w-full overflow-hidden flex items-center justify-center">
        {/* Slide backgrounds */}
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-40' : 'opacity-0'
            }`}
          >
            <img src={slide.image} alt="Background" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/60" />
          </div>
        ))}

        <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
          <span className="flex items-center gap-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-xs font-semibold tracking-wide text-indigo-300 py-1.5 px-4 mb-4 animate-bounce">
            <Sparkles className="size-4" />
            <span>{slides[currentSlide]?.tagline}</span>
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            {slides[currentSlide]?.title}
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
            Unleash Aetheris agent workflows. Generate custom day-by-day itineraries, analyze expenses with visual chart rendering, and organize confirmations in a unified portal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={user ? "/ai-hub" : "/login"}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 transition glow-indigo transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              <span>Launch AI Hub</span>
              <PlaneTakeoff className="size-4 md:size-5" />
            </Link>
            <Link
              href="/explore"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-850 px-6 py-3.5 transition transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              <span>Explore Trips</span>
              <Compass className="size-4 md:size-5" />
            </Link>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 flex gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-600'
              }`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: POPULAR DESTINATIONS GRID */}
      <section className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Featured Global Destinies
            </h2>
            <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto">
              Sleek, handpicked locations ready for instant exploration. Click to review detailed maps, pricing, and related recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <div 
                key={dest.id} 
                className="group flex flex-col h-[380px] rounded-2xl border border-slate-900 bg-slate-900/20 overflow-hidden hover:border-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1.5"
              >
                <div className="relative h-44 w-full overflow-hidden shrink-0">
                  <img src={dest.imageUrl} alt={dest.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-slate-800">
                    {dest.tag}
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-yellow-400 border border-slate-800">
                    ★ {dest.rating}
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">{dest.title}</h3>
                  <p className="text-xs text-slate-400 flex-1">{dest.location}</p>
                  <div className="border-t border-slate-800/60 pt-3 mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Price</span>
                      <span className="text-base font-black text-emerald-400">${dest.price}</span>
                    </div>
                    <Link href={`/trips/${dest.id}`} className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-2 transition glow-indigo">
                      <span>View Details</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE PLATFORM AI CAPABILITIES */}
      <section className="bg-slate-900/30 border-y border-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Core Agent Capabilities
            </h2>
            <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
              Our agent workflows execute complex tasks, bypassing static chat widgets. Check our travel intelligence utilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-4 hover:border-indigo-500/20 transition-all duration-300">
                  <span className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 glow-indigo">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">How It Works</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
              Deploy your agentic travel planner in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-slate-900 -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Authenticate & Configure", desc: "Access the system instantly using one-click demo login or Google credentials." },
              { step: "02", title: "Generate or Add Plans", desc: "Build tailored itineraries using Gemini templates or upload custom locations." },
              { step: "03", title: "Analyze & Chat", desc: "Audit flight details, parse expense spreadsheets, and coordinate with Aetheris chat." }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl border border-slate-900 bg-slate-950/80">
                <span className="text-4xl font-black text-indigo-500 mb-3">{item.step}</span>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: PLATFORM STATS */}
      <section className="bg-slate-900/20 py-12 border-y border-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Globe2, value: "148+", label: "Countries Supported" },
            { icon: Sparkles, value: "14,284", label: "AI Itineraries Created" },
            { icon: Users2, value: "99.4%", label: "User Satisfaction" },
            { icon: Award, value: "$2.1M+", label: "Travel Expenses Analyzed" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-900 bg-slate-950/20">
                <Icon className="size-6 text-indigo-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">What Travelers Say</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-sm mx-auto">
              Real testimonials from travelers who upgraded their workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "John Doe", role: "Backpacker", text: "The Expense Analyzer saved me from overspending on restaurants in Tokyo. The generated charts are extremely helpful!" },
              { name: "Sarah Ahmed", role: "Adventure Guide", text: "Generating custom ski logs for the Swiss Alps took 10 seconds. The Day-by-Day itinerary planner is absolutely premium." },
              { name: "David Vance", role: "Business Executive", text: "Scanning boarding passes and hotel confirmations using the Voucher Parser extracted my codes without fail. Highly recommended." }
            ].map((user, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 flex flex-col justify-between">
                <Quote className="size-8 text-indigo-500/20 mb-4" />
                <p className="text-xs text-slate-300 italic mb-6">"{user.text}"</p>
                <div className="border-t border-slate-900 pt-4 flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white uppercase">{user.name[0]}</div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{user.name}</h4>
                    <span className="text-[10px] text-indigo-400">{user.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: TRAVEL GUIDE BLOG PREVIEW */}
      <section className="bg-slate-900/20 py-16 px-4 border-y border-slate-900 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Travel Strategy Insights</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
              Insights on integrating AI agents to streamline booking pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog, idx) => (
              <div key={idx} className="group flex flex-col rounded-2xl border border-slate-900 bg-slate-950/60 overflow-hidden hover:border-indigo-500/25 transition-all">
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-indigo-400 font-semibold uppercase">
                    <span>{blog.tag}</span>
                    <span className="size-1 rounded-full bg-slate-800" />
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">{blog.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                </div>
                <div className="border-t border-slate-900 p-4 mt-auto flex items-center justify-between text-[11px] text-slate-500">
                  <span>By {blog.author}</span>
                  <span className="flex items-center gap-1 text-slate-400 font-bold group-hover:text-indigo-400">
                    Read Article <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: INTERACTIVE FAQ ACCORDION */}
      <section className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="mt-3 text-sm text-slate-400">
              Clear answers to common questions about Aetheris.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const active = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-slate-900 bg-slate-900/10 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-white font-bold hover:bg-slate-900/20 transition-colors text-sm md:text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-4 text-indigo-400 transition-transform duration-200 ${active ? 'rotate-180' : ''}`} />
                  </button>
                  {active && (
                    <div className="border-t border-slate-900 p-5 bg-slate-950/40 text-xs md:text-sm text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
