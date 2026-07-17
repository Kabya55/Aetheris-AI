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
  Download, FileCheck, CheckCircle2, ChevronRight, Loader2 
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
PASSENGER: KABYA RAHMAN
FLIGHT: EK-501
DEPARTURE: 2026-10-15 FROM DHAKA (DAC)
ARRIVAL: 2026-10-15 TO DUBAI (DXB)
CLASS: ECONOMY CLASS - SEATED
STATUS: CONFORMED / COMPLETED PAID`);
  const [voucherAnalysis, setVoucherAnalysis] = useState<any>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);

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
  const handleAnalyzeExpenses = async () => {
    if (!expensesRaw) {
      alert("Please paste your expense dataset first.");
      return;
    }
    setExpenseLoading(true);
    setExpenseAnalysis(null);
    try {
      const res = await api.post('/ai/analyze-expenses', { expensesData: expensesRaw });
      setExpenseAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Expense parsing failed. Fallback to mock generated data.");
    } finally {
      setExpenseLoading(false);
    }
  };

  // 3. Document parser
  const handleParseVoucher = async () => {
    if (!voucherRaw) {
      alert("Please paste your confirmation ticket text.");
      return;
    }
    setVoucherLoading(true);
    setVoucherAnalysis(null);
    try {
      const res = await api.post('/ai/parse-voucher', { voucherText: voucherRaw });
      setVoucherAnalysis(res.data);
    } catch (err) {
      console.error(err);
      alert("Voucher parsing failed.");
    } finally {
      setVoucherLoading(false);
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
        
        {/* Header Block */}
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 glow-indigo">
            <Sparkles className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-white">Aetheris AI Hub</h1>
            <p className="text-xs text-slate-400 mt-0.5">Explore our professional suites of agentic AI travel utilities.</p>
          </div>
        </div>

        {/* Tab Switcher */}
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
                className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition whitespace-nowrap px-1 ${
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
                        className={`text-xs rounded-lg py-2 border transition font-medium ${
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 transition glow-indigo text-xs disabled:opacity-50"
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
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/20 px-3 py-1.5 text-xs text-slate-350 hover:text-white"
                    >
                      <RefreshCw className="size-3.5" />
                      <span>Regenerate</span>
                    </button>
                    <button
                      onClick={() => handleDownloadReport(itineraryResult, `${dest.replace(/\s+/g, '_')}_itinerary.md`)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-650 hover:bg-indigo-600 px-3 py-1.5 text-xs text-white"
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
                  <Compass className="size-12 text-slate-700 mb-4" />
                  <h3 className="text-sm font-bold text-white mb-1">No Itinerary Generated</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Set your destination and parameters on the left tab, then click Build to execute Gemini workflows.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: EXPENSE ANALYZER */}
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CSV loader & input */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Manual input */}
              <div className="rounded-2xl glass-panel bg-slate-900/20 p-6 border border-slate-800/80 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  <BadgeDollarSign className="size-4.5 text-indigo-400" />
                  <span>Expense Dataset</span>
                </h2>

                <div className="border-t border-slate-950 pt-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Upload CSV / TXT</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 cursor-pointer text-slate-400 hover:text-slate-200 transition">
                      <UploadCloud className="size-6 mb-2 text-indigo-400" />
                      <span className="text-[10px] font-semibold">Click to select CSV</span>
                      <input
                        type="file"
                        accept=".csv,.txt"
                        onChange={(e) => handleFileUpload(e, 'expenses')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Raw Expense Data</label>
                    <textarea
                      rows={8}
                      placeholder="Paste CSV format: Item,Category,Cost"
                      value={expensesRaw}
                      onChange={(e) => setExpensesRaw(e.target.value)}
                      className="w-full text-xs rounded-lg glass-input bg-slate-950/60 font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeExpenses}
                  disabled={expenseLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 transition glow-indigo text-xs disabled:opacity-50"
                >
                  {expenseLoading ? <Loader2 className="animate-spin size-4" /> : <FileSpreadsheet className="size-4" />}
                  <span>{expenseLoading ? 'Analyzing...' : 'Analyze Expenses'}</span>
                </button>
              </div>

            </div>

            {/* Analysis Dashboard */}
            <div className="lg:col-span-2 rounded-2xl glass-panel bg-slate-900/10 border border-slate-800/80 p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <span className="font-bold text-white text-sm">Budget Analysis Dashboard</span>
                {expenseAnalysis && (
                  <button
                    onClick={() => handleDownloadReport(
                      `AETHERIS BUDGET ANALYSIS REPORT\n\nTotal Spent: $${expenseAnalysis.totalSpent}\n\nSummary:\n${expenseAnalysis.summary}\n\nRecommendations:\n${expenseAnalysis.recommendations.join('\n')}`,
                      `expense_report.txt`
                    )}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-650 hover:bg-indigo-600 px-3 py-1.5 text-xs text-white"
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
                <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                  
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
                            innerRadius={50}
                            outerRadius={75}
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
                    <p className="text-xs text-slate-400 leading-relaxed leading-relaxed">{expenseAnalysis.summary}</p>
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

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <BadgeDollarSign className="size-12 text-slate-700 mb-4" />
                  <h3 className="text-sm font-bold text-white mb-1">No Budget Analyzed</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Upload or paste an expense sheet on the left, then click Analyze to render dashboard data graphs.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: VOUCHER PARSER */}
        {activeTab === 'voucher' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Ticket Column */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="rounded-2xl glass-panel bg-slate-900/20 p-6 border border-slate-800/80 space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  <ClipboardList className="size-4.5 text-indigo-400" />
                  <span>Voucher Document</span>
                </h2>

                <div className="border-t border-slate-950 pt-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Upload Ticket Text File</label>
                    <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 cursor-pointer text-slate-400 hover:text-slate-200 transition">
                      <UploadCloud className="size-6 mb-2 text-indigo-400" />
                      <span className="text-[10px] font-semibold">Click to upload TXT</span>
                      <input
                        type="file"
                        accept=".txt"
                        onChange={(e) => handleFileUpload(e, 'voucher')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Copy-Paste Voucher Raw Text</label>
                    <textarea
                      rows={8}
                      placeholder="Paste boarding ticket details, invoice vouchers, or booking receipt logs..."
                      value={voucherRaw}
                      onChange={(e) => setVoucherRaw(e.target.value)}
                      className="w-full text-xs rounded-lg glass-input bg-slate-950/60 font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleParseVoucher}
                  disabled={voucherLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 transition glow-indigo text-xs disabled:opacity-50"
                >
                  {voucherLoading ? <Loader2 className="animate-spin size-4" /> : <FileCheck className="size-4" />}
                  <span>{voucherLoading ? 'Parsing...' : 'Analyze Voucher'}</span>
                </button>
              </div>

            </div>

            {/* Structured Parsing Dashboard */}
            <div className="lg:col-span-2 rounded-2xl glass-panel bg-slate-900/10 border border-slate-800/80 p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <span className="font-bold text-white text-sm">Extracted Booking Details</span>
              </div>

              {voucherLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="animate-spin size-10 text-indigo-500" />
                  <p className="text-xs text-slate-400">Gemini models are analyzing booking metadata...</p>
                </div>
              ) : voucherAnalysis ? (
                <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                  
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

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <ClipboardList className="size-12 text-slate-700 mb-4" />
                  <h3 className="text-sm font-bold text-white mb-1">No Booking Voucher Parsed</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    Paste check-in vouchers, airline passes, or hotel receipts on the left, then click Parse to extract metadata.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      <Footer />
    </>
  );
}
