"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Sparkles, Compass, BadgeDollarSign, ClipboardList, 
  Map, Plane, RefreshCw, UploadCloud, FileSpreadsheet, 
  Download, FileCheck, CheckCircle2, ChevronRight, Loader2,
  Plus, X
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function AiHubPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated sessions
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'expenses' | 'voucher'>('itinerary');

  /* --- ITINERARY STATE --- */
  const [dest, setDest] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('Moderate');
  const [style, setStyle] = useState('Adventure');
  const [pace, setPace] = useState('Moderate');
  const [itineraryResult, setItineraryResult] = useState('');
  const [itineraryLoading, setItineraryLoading] = useState(false);

  /* --- EXPENSES STATE --- */
  const [expensesRaw, setExpensesRaw] = useState(`Item,Category,Cost
Hotel Room,Lodging,450.00
Local Subway Transit,Transit,35.00
Traditional Dinner,Food,65.00
Museum Entry Fees,Activities,45.00
Souvenir Gifts,Shopping,50.00
Airport Shuttle Taxi,Transit,40.00
Street Food Market,Food,20.00`);
  const [expenseAnalysis, setExpenseAnalysis] = useState<any>(null);
  const [expenseLoading, setExpenseLoading] = useState(false);

  /* --- VOUCHER STATE --- */
  const [voucherRaw, setVoucherRaw] = useState(`EMIRATES PASSENGER ITINERARY
BOOKING REFERENCE: DXB-20947A
PASSENGER: KABYA KISHOR HALDER
FLIGHT: EK-501
DEPARTURE: 2026-10-15 FROM DHAKA (DAC)
ARRIVAL: 2026-10-15 TO DUBAI (DXB)
CLASS: ECONOMY CLASS - SEATED
STATUS: CONFORMED / COMPLETED PAID`);
  const [voucherAnalysis, setVoucherAnalysis] = useState<any>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

  /* --- UNIFIED GEMINI SEARCH BAR STATE --- */
  const [promptInput, setPromptInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number } | null>(null);
  const [attachedFileContent, setAttachedFileContent] = useState('');

  /* --- HANDLERS --- */

  // 1. Generate Itinerary
  const handleGenerateItinerary = async () => {
    if (!dest) {
      alert("Please input a destination");
      return;
    }
    setItineraryLoading(true);
    setItineraryResult('');
    try {
      const res = await api.post('/ai/generate-itinerary', {
        destination: dest,
        duration: days,
        budget,
        style,
        pace,
      });
      setItineraryResult(res.data?.itinerary || 'No itinerary returned.');
    } catch (err) {
      console.error(err);
      alert("Failed to generate itinerary.");
    } finally {
      setItineraryLoading(false);
    }
  };

  // 2. Analyze Expenses
  const handleAnalyzeExpenses = async (customData?: string) => {
    const dataToAnalyze = customData || expensesRaw;
    if (!dataToAnalyze) {
      alert("Please paste your expense dataset first.");
      return;
    }
    setExpenseLoading(true);
    setExpenseAnalysis(null);
    try {
      const res = await api.post('/ai/analyze-expenses', { expensesData: dataToAnalyze });
      setExpenseAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Expense parsing failed. Fallback to mock generated data.");
    } finally {
      setExpenseLoading(false);
    }
  };

  // 3. Document parser
  const handleParseVoucher = async (customText?: string) => {
    const textToAnalyze = customText || voucherRaw;
    if (!textToAnalyze) {
      alert("Please paste your confirmation ticket text.");
      return;
    }
    setVoucherLoading(true);
    setVoucherAnalysis(null);
    try {
      const res = await api.post('/ai/parse-voucher', { voucherText: textToAnalyze });
      setVoucherAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Voucher parsing failed.");
    } finally {
      setVoucherLoading(false);
    }
  };

  // Handle file attachment for unified Gemini search bar
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setAttachedFile({ name: file.name, size: file.size });
      setAttachedFileContent(text);
      
      const lowerName = file.name.toLowerCase();
      const lowerText = text.toLowerCase();
      if (lowerName.endsWith('.csv') || lowerText.includes('item,category,cost')) {
        setPromptInput(`Analyze expenses from ${file.name}`);
      } else {
        setPromptInput(`Parse booking details from ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    setAttachedFileContent('');
  };

  const handleSendPrompt = async () => {
    if (!promptInput.trim() && !attachedFileContent) {
      alert("Please enter a message or attach a file first.");
      return;
    }

    const text = promptInput;
    const fileContent = attachedFileContent;
    const fileName = attachedFile?.name;

    // Detect type
    let detectedType: 'itinerary' | 'expenses' | 'voucher' = 'itinerary';
    const contentToAnalyze = fileContent || text;
    const lowerContent = contentToAnalyze.toLowerCase();

    if (fileName) {
      const lowerName = fileName.toLowerCase();
      if (lowerName.endsWith('.csv') || lowerName.includes('expense') || lowerContent.includes('item,category,cost')) {
        detectedType = 'expenses';
      } else {
        detectedType = 'voucher';
      }
    } else {
      // Heuristics based on text content
      const hasCsvHeaders = lowerContent.includes('item,category,cost') || lowerContent.includes('cost,category') || lowerContent.includes('price,category');
      const commasCount = (contentToAnalyze.match(/,/g) || []).length;
      const linesCount = (contentToAnalyze.match(/\n/g) || []).length;

      if (hasCsvHeaders || (commasCount > 4 && linesCount > 1)) {
        detectedType = 'expenses';
      } else if (
        lowerContent.includes('emirates') || 
        lowerContent.includes('booking reference') || 
        lowerContent.includes('passenger') || 
        lowerContent.includes('flight:') || 
        lowerContent.includes('departure') || 
        lowerContent.includes('arrival') || 
        lowerContent.includes('ticket') || 
        lowerContent.includes('hotel confirmation') ||
        lowerContent.includes('voucher') ||
        lowerContent.includes('boarding pass')
      ) {
        detectedType = 'voucher';
      } else {
        detectedType = 'itinerary';
      }
    }

    if (detectedType === 'expenses') {
      setActiveTab('expenses');
      setExpensesRaw(contentToAnalyze);
      await handleAnalyzeExpenses(contentToAnalyze);
    } else if (detectedType === 'voucher') {
      setActiveTab('voucher');
      setVoucherRaw(contentToAnalyze);
      await handleParseVoucher(contentToAnalyze);
    } else {
      setActiveTab('itinerary');
      // Extract itinerary details
      let extractedDest = '';
      const toMatch = text.match(/to\s+([A-Za-z\s,]+)/i);
      if (toMatch) {
        extractedDest = toMatch[1].trim().split(/[.?!,]/)[0].split(/\s+/).slice(0, 3).join(' ');
      } else {
        extractedDest = text.replace(/plan/i, '').replace(/itinerary/i, '').replace(/trip/i, '').trim();
      }

      if (!extractedDest) {
        extractedDest = dest || 'Rome, Italy';
      }
      setDest(extractedDest);

      let extractedDays = days;
      const daysMatch = text.match(/(\d+)\s*day/i);
      if (daysMatch) {
        const dNum = parseInt(daysMatch[1]);
        if ([1, 2, 3, 5, 7, 10].includes(dNum)) {
          extractedDays = dNum;
          setDays(dNum);
        }
      }

      let extractedBudget = budget;
      if (lowerContent.includes('budget')) {
        extractedBudget = 'Budget';
        setBudget('Budget');
      } else if (lowerContent.includes('luxury')) {
        extractedBudget = 'Luxury';
        setBudget('Luxury');
      } else if (lowerContent.includes('moderate')) {
        extractedBudget = 'Moderate';
        setBudget('Moderate');
      }

      setItineraryLoading(true);
      setItineraryResult('');
      try {
        const res = await api.post('/ai/generate-itinerary', {
          destination: extractedDest,
          duration: extractedDays,
          budget: extractedBudget,
          style,
          pace,
        });
        setItineraryResult(res.data?.itinerary || 'No itinerary returned.');
      } catch (err) {
        console.error(err);
        alert("Failed to generate itinerary.");
      } finally {
        setItineraryLoading(false);
      }
    }
  };

  const handleSelectPreset = (type: 'expenses' | 'voucher' | 'itinerary') => {
    if (type === 'expenses') {
      setPromptInput('Analyze my travel expenditures');
      setAttachedFile({ name: 'trip_expenses.csv', size: 184 });
      setAttachedFileContent(`Item,Category,Cost
Hotel Room,Lodging,450.00
Local Subway Transit,Transit,35.00
Traditional Dinner,Food,65.00
Museum Entry Fees,Activities,45.00
Souvenir Gifts,Shopping,50.00
Airport Shuttle Taxi,Transit,40.00
Street Food Market,Food,20.00`);
    } else if (type === 'voucher') {
      setPromptInput('Parse flight confirmation ticket details');
      setAttachedFile({ name: 'emirates_ticket.txt', size: 247 });
      setAttachedFileContent(`EMIRATES PASSENGER ITINERARY
BOOKING REFERENCE: DXB-20947A
PASSENGER: KABYA KISHOR HALDER
FLIGHT: EK-501
DEPARTURE: 2026-10-15 FROM DHAKA (DAC)
ARRIVAL: 2026-10-15 TO DUBAI (DXB)
CLASS: ECONOMY CLASS - SEATED
STATUS: CONFORMED / COMPLETED PAID`);
    } else {
      setPromptInput('Plan a 3-day budget trip to Rome, Italy');
      setAttachedFile(null);
      setAttachedFileContent('');
    }
  };

  // CSV file uploader simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'expenses' | 'voucher') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (type === 'expenses') {
        setExpensesRaw(text);
        alert("Expense CSV file successfully loaded! Click 'Analyze Expenses' to run AI analysis.");
      } else {
        setVoucherRaw(text);
        alert("Voucher text file successfully loaded! Click 'Analyze Voucher' to run AI analysis.");
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadReport = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        
        {/* Gemini-Style Welcome & Smart Input */}
        <div className="max-w-4xl mx-auto my-12 text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-wide text-white mb-8 flex items-center justify-center gap-2">
            <span>What's the vibe,</span>
            <span className="font-semibold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {user?.name?.split(' ')[0] || 'Kabya'}?
            </span>
          </h2>

          <div className="relative flex flex-col w-full rounded-[28px] border border-slate-800 bg-[#0f1115]/95 shadow-2xl p-2 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-950/50 max-w-2xl mx-auto">
            
            {/* File attachment preview */}
            {attachedFile && (
              <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-slate-800/40 mb-2">
                <div className="flex items-center gap-2 bg-indigo-950/55 border border-indigo-900/60 rounded-full px-3.5 py-1 text-xs text-indigo-300">
                  <FileSpreadsheet className="size-3.5 text-indigo-400 animate-pulse" />
                  <span className="font-medium truncate max-w-[180px]">{attachedFile.name}</span>
                  <span className="text-[10px] text-slate-500">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
                  <button 
                    type="button" 
                    onClick={handleRemoveAttachment} 
                    className="ml-1 text-slate-400 hover:text-red-400 transition font-bold"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pl-3 pr-1 py-1">
              {/* File Attachment Plus Button */}
              <label className="flex items-center justify-center size-10 rounded-full hover:bg-slate-900/80 cursor-pointer text-slate-400 hover:text-slate-200 transition shrink-0" title="Attach file (.csv or .txt)">
                <Plus className="size-6 text-slate-400 hover:text-slate-100" />
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileAttach}
                  className="hidden"
                />
              </label>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Ask Gemini"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none text-sm text-slate-200 placeholder-slate-500 px-2 py-2"
              />

              {/* Send Button */}
              <button
                onClick={handleSendPrompt}
                disabled={itineraryLoading || expenseLoading || voucherLoading}
                className="flex items-center justify-center size-10 rounded-full bg-indigo-650 hover:bg-indigo-600 text-white transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 animate-pulse"
              >
                {itineraryLoading || expenseLoading || voucherLoading ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <ChevronRight className="size-5" />
                )}
              </button>
            </div>
          </div>

          {/* Quick presets / action cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
            <button
              onClick={() => handleSelectPreset('expenses')}
              className="flex flex-col items-start text-left p-4.5 rounded-2xl border border-slate-900 bg-slate-950/20 hover:bg-slate-950/40 hover:border-slate-800 transition-all duration-300 cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <BadgeDollarSign className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Analyze Travel Expenses</h3>
              <p className="text-[10px] text-slate-400 leading-normal">Upload travel expense logs as CSV. Extracts budget stats & graphs.</p>
            </button>

            <button
              onClick={() => handleSelectPreset('voucher')}
              className="flex flex-col items-start text-left p-4.5 rounded-2xl border border-slate-900 bg-slate-950/20 hover:bg-slate-950/40 hover:border-slate-800 transition-all duration-300 cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-900/30 text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                <ClipboardList className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Parse Booking Voucher</h3>
              <p className="text-[10px] text-slate-400 leading-normal">Paste check-in or boarding ticket logs. Extracts itinerary & checklists.</p>
            </button>

            <button
              onClick={() => handleSelectPreset('itinerary')}
              className="flex flex-col items-start text-left p-4.5 rounded-2xl border border-slate-900 bg-slate-950/20 hover:bg-slate-950/40 hover:border-slate-800 transition-all duration-300 cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-900/30 text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                <Compass className="size-4" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">Build Custom Itinerary</h3>
              <p className="text-[10px] text-slate-400 leading-normal">Plan custom trip agendas. Try "Plan a 3-day budget trip to Rome".</p>
            </button>
          </div>
        </div>

        {/* Tab Switcher (Results category navigation) */}
        <div className="flex border-b border-slate-800/80 mb-8 gap-4 overflow-x-auto">
          {[
            { id: 'itinerary', label: 'AI Itinerary Planner', icon: Map },
            { id: 'expenses', label: 'AI Expense Analyzer', icon: BadgeDollarSign },
            { id: 'voucher', label: 'AI Voucher Parser', icon: ClipboardList }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition whitespace-nowrap px-1 cursor-pointer ${
                  active 
                    ? 'border-indigo-500 text-white' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ITINERARY PLANNER */}
        {activeTab === 'itinerary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Configurator */}
            <div className="lg:col-span-1 rounded-2xl glass-panel bg-slate-900/20 p-6 border border-slate-800/80 space-y-5 h-fit">
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Compass className="size-4.5 text-indigo-400" />
                <span>Itinerary Settings</span>
              </h2>

              <div className="space-y-4 border-t border-slate-950 pt-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rome, Italy"
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Duration (Days)</label>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                  >
                    {[1, 2, 3, 5, 7, 10].map((d) => (
                      <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Budget Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Budget', 'Moderate', 'Luxury'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`text-xs rounded-lg py-2 border transition font-medium cursor-pointer ${
                          budget === b
                            ? 'bg-indigo-650 border-indigo-500 text-white'
                            : 'border-slate-850 bg-slate-950/40 text-slate-350 hover:border-slate-750'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Travel Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                  >
                    <option value="Adventure">Adventure Trekking</option>
                    <option value="Cultural">Cultural Landmarks</option>
                    <option value="Relaxing">Relaxing Resorts & Spas</option>
                    <option value="Foodie">Culinary Food Safaris</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Travel Pace</label>
                  <select
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    className="w-full text-xs rounded-lg glass-input bg-slate-950/60"
                  >
                    <option value="Slow">Slow & Immersive</option>
                    <option value="Moderate">Moderate Exploration</option>
                    <option value="Fast">Fast-Paced Highlights</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateItinerary}
                disabled={itineraryLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 transition glow-indigo text-xs disabled:opacity-50 cursor-pointer"
              >
                {itineraryLoading ? <Loader2 className="animate-spin size-4" /> : <Plane className="size-4" />}
                <span>{itineraryLoading ? 'Generating Itinerary...' : 'Build Custom Itinerary'}</span>
              </button>
            </div>

            {/* Output Reader */}
            <div className="lg:col-span-2 rounded-2xl glass-panel bg-slate-900/10 border border-slate-800/80 p-6 flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
                <span className="font-bold text-white text-sm">Generated Itinerary Output</span>
                {itineraryResult && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateItinerary}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/20 px-3 py-1.5 text-xs text-slate-350 hover:text-white cursor-pointer"
                    >
                      <RefreshCw className="size-3.5" />
                      <span>Regenerate</span>
                    </button>
                    <button
                      onClick={() => handleDownloadReport(itineraryResult, `${dest.replace(/\s+/g, '_')}_itinerary.md`)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-650 hover:bg-indigo-600 px-3 py-1.5 text-xs text-white cursor-pointer"
                    >
                      <Download className="size-3.5" />
                      <span>Download MD</span>
                    </button>
                  </div>
                )}
              </div>

              {itineraryLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="animate-spin size-10 text-indigo-500" />
                  <p className="text-xs text-slate-400">Gemini models are composing your travel plan...</p>
                </div>
              ) : itineraryResult ? (
                <div className="flex-1 text-slate-300 text-xs md:text-sm leading-relaxed overflow-y-auto max-h-[600px] pr-2 whitespace-pre-wrap select-text">
                  {itineraryResult}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <Compass className="size-12 text-slate-700 mb-4 animate-pulse" />
                  <h3 className="text-sm font-bold text-white mb-1">No Itinerary Generated</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Plan your trip by typing in the search bar above, e.g. "Plan a 3-day budget trip to Rome".
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: EXPENSE ANALYZER */}
        {activeTab === 'expenses' && (
          <div className="max-w-5xl mx-auto rounded-2xl glass-panel bg-slate-900/10 border border-slate-800/80 p-6 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <span className="font-bold text-white text-sm">Budget Analysis Dashboard</span>
              {expenseAnalysis && (
                <button
                  onClick={() => handleDownloadReport(
                    `AETHERIS BUDGET ANALYSIS REPORT\n\nTotal Spent: $${expenseAnalysis.totalSpent}\n\nSummary:\n${expenseAnalysis.summary}\n\nRecommendations:\n${expenseAnalysis.recommendations.join('\n')}`,
                    `expense_report.txt`
                  )}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-650 hover:bg-indigo-600 px-3 py-1.5 text-xs text-white cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Download Report</span>
                </button>
              )}
            </div>

            {expenseLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="animate-spin size-10 text-indigo-500" />
                <p className="text-xs text-slate-400">Gemini models are compiling financial analytics...</p>
              </div>
            ) : expenseAnalysis ? (
              <div className="space-y-6">
                
                {/* Stats & Chart Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Left Column: Total & Category listings */}
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Expenditures</span>
                      <span className="text-3xl font-black text-white">${expenseAnalysis.totalSpent?.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Breakdown Matrix</h4>
                      {expenseAnalysis.categories?.map((cat: any) => (
                        <div key={cat.name} className="flex items-center justify-between text-xs py-1 border-b border-slate-900/60">
                          <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-slate-300 font-medium">{cat.name}</span>
                          </div>
                          <span className="font-bold text-white">${cat.value?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Recharts Pie chart */}
                  <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseAnalysis.categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={78}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {expenseAnalysis.categories.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', fontSize: '12px', color: 'white' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                </div>

                {/* Summary Narrative */}
                <div className="space-y-2 border-t border-slate-900 pt-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Executive Review</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{expenseAnalysis.summary}</p>
                </div>

                {/* Recommendations */}
                <div className="space-y-3 border-t border-slate-900 pt-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Optimization Action Items</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {expenseAnalysis.recommendations?.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 rounded-lg bg-indigo-950/10 border border-indigo-900/20 p-3 text-xs text-slate-300 leading-normal">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible raw data viewer */}
                <details className="mt-6 border-t border-slate-900 pt-4 group">
                  <summary className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold cursor-pointer hover:text-slate-300 select-none">
                    View/Edit Raw Expense Data
                  </summary>
                  <div className="mt-2 space-y-3">
                    <textarea
                      rows={5}
                      value={expensesRaw}
                      onChange={(e) => setExpensesRaw(e.target.value)}
                      className="w-full text-xs rounded-lg glass-input bg-slate-950/60 font-mono"
                    />
                    <button
                      onClick={() => handleAnalyzeExpenses()}
                      disabled={expenseLoading}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white cursor-pointer transition disabled:opacity-50"
                    >
                      {expenseLoading ? <Loader2 className="animate-spin size-3" /> : null}
                      <span>Update Analysis</span>
                    </button>
                  </div>
                </details>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <BadgeDollarSign className="size-12 text-slate-700 mb-4 animate-bounce" />
                <h3 className="text-sm font-bold text-white mb-1">No Budget Analyzed</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Attach an expense CSV or paste raw data in the search input at the top, then press Send to analyze expenditures.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VOUCHER PARSER */}
        {activeTab === 'voucher' && (
          <div className="max-w-5xl mx-auto rounded-2xl glass-panel bg-slate-900/10 border border-slate-800/80 p-6 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <span className="font-bold text-white text-sm">Extracted Booking Details</span>
            </div>

            {voucherLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="animate-spin size-10 text-indigo-500" />
                <p className="text-xs text-slate-400">Gemini models are analyzing booking metadata...</p>
              </div>
            ) : voucherAnalysis ? (
              <div className="space-y-6">
                
                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Booking Type</span>
                    <span className="text-sm font-bold text-indigo-400">{voucherAnalysis.bookingType || 'Unknown'}</span>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Confirmation Code</span>
                    <span className="text-sm font-bold text-white font-mono">{voucherAnalysis.confirmationCode || 'N/A'}</span>
                  </div>

                  <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Destination Location</span>
                    <span className="text-sm font-bold text-white truncate">{voucherAnalysis.location || 'N/A'}</span>
                  </div>
                </div>

                {/* Date range details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-900 pt-5">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Start / Arrival Date</span>
                    <span className="text-xs font-bold text-slate-350">{voucherAnalysis.startDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">End / Check-Out Date</span>
                    <span className="text-xs font-bold text-slate-350">{voucherAnalysis.endDate || 'N/A'}</span>
                  </div>
                </div>

                {/* Extended details fields */}
                {voucherAnalysis.keyDetails && (
                  <div className="space-y-2.5 border-t border-slate-900 pt-5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Extracted Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {voucherAnalysis.keyDetails.map((det: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs p-3 rounded-lg border border-slate-900 bg-slate-950/30">
                          <span className="text-slate-400 font-medium">{det.label}:</span>
                          <span className="text-white font-bold">{det.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pre-Travel Checklist */}
                {voucherAnalysis.preTravelChecklist && (
                  <div className="space-y-3 border-t border-slate-900 pt-5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Pre-Travel Checklist</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {voucherAnalysis.preTravelChecklist.map((task: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2.5 rounded-lg border border-slate-900 bg-slate-950/20 p-3 text-xs text-slate-300">
                          <ChevronRight className="size-4 text-indigo-400 shrink-0" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Collapsible raw data viewer */}
                <details className="mt-6 border-t border-slate-900 pt-4 group">
                  <summary className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold cursor-pointer hover:text-slate-300 select-none">
                    View/Edit Raw Voucher Text
                  </summary>
                  <div className="mt-2 space-y-3">
                    <textarea
                      rows={5}
                      value={voucherRaw}
                      onChange={(e) => setVoucherRaw(e.target.value)}
                      className="w-full text-xs rounded-lg glass-input bg-slate-950/60 font-mono"
                    />
                    <button
                      onClick={() => handleParseVoucher()}
                      disabled={voucherLoading}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white cursor-pointer transition disabled:opacity-50"
                    >
                      {voucherLoading ? <Loader2 className="animate-spin size-3" /> : null}
                      <span>Update Analysis</span>
                    </button>
                  </div>
                </details>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <ClipboardList className="size-12 text-slate-700 mb-4 animate-bounce" />
                <h3 className="text-sm font-bold text-white mb-1">No Booking Voucher Parsed</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Attach a reservation ticket file or paste raw confirmation log text in the search input at the top, then press Send to parse details.
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
