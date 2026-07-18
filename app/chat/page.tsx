"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  MessageSquareCode, Send, Sparkles, User, Loader2, 
  ArrowRight, CornerDownRight, Plus, X, BadgeDollarSign, 
  ClipboardList, Compass, FileSpreadsheet 
} from 'lucide-react';

interface ChatMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string | Date;
}

export default function ChatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Guard redirects unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I am Aetheris AI, your agentic travel companion. I can plan day-by-day itineraries, analyze expenses, categorize custom trips, or navigate you around Aetheris. Try asking me: 'Take me to Explore' or 'Help me add a new trip'."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [navAlert, setNavAlert] = useState<string | null>(null);

  // Unified Gemini chat states
  const [showMenu, setShowMenu] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number } | null>(null);
  const [attachedFileContent, setAttachedFileContent] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Suggested follow-up prompts (clicking submits them)
  const suggestedPrompts = [
    { text: "Show me popular destinations", prompt: "Navigate me to the Explore page to find trips." },
    { text: "Help me create a trip", prompt: "Help me add a new custom trip." },
    { text: "Plan a Paris itinerary", prompt: "Navigate me to the AI Hub to plan a trip." },
    { text: "Analyze travel budget", prompt: "How do I upload custom expense spreadsheets to analyze?" }
  ];

  // Fetch chat history from database on mount if user is logged in
  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const res = await api.get('/ai/chat/history/default-chat');
          if (res.data && res.data.length > 0) {
            setMessages(res.data.map((c: any) => ({
              role: c.role,
              content: c.content,
              createdAt: c.createdAt,
            })));
          }
        } catch (err) {
          console.error("Failed to load chat history:", err);
        }
      };
      fetchHistory();
    }
  }, [user]);

  // Scroll chat window to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // File handlers for Chat
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setAttachedFile({ name: file.name, size: file.size });
      setAttachedFileContent(text);
      
      const lowerName = file.name.toLowerCase();
      if (lowerName.endsWith('.csv')) {
        setInputText(`Analyze these travel expenses in detail`);
      } else {
        setInputText(`Analyze this booking voucher and list check-in dates and details`);
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    setAttachedFileContent('');
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() && !attachedFileContent) return;

    // Build message content with file attachment info if present
    let messageContent = textToSend;
    let visualUserMsg = textToSend;

    if (attachedFile && attachedFileContent) {
      const fileHeader = `[File Uploaded: ${attachedFile.name}]\n`;
      messageContent = `${fileHeader}\n${attachedFileContent}\n\n${textToSend}`;
      visualUserMsg = `📎 Attached: ${attachedFile.name}\n\n${textToSend}`;
    }

    // Append user message immediately
    const userMsg: ChatMessage = { role: 'user', content: visualUserMsg };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setNavAlert(null);
    handleRemoveAttachment(); // Reset attachment state immediately

    try {
      const res = await api.post('/ai/chat', {
        message: messageContent,
        conversationId: 'default-chat'
      });

      const replyText = res.data?.text || "I'm having trouble connecting to the network right now.";
      const targetNav = res.data?.navigation;

      // Append assistant reply
      const assistantMsg: ChatMessage = { role: 'assistant', content: replyText };
      setMessages(prev => [...prev, assistantMsg]);

      // If navigation code is returned, execute client-side routing
      if (targetNav) {
        setNavAlert(`Agent suggested routing: Redirecting to "${targetNav}" in 2 seconds...`);
        setTimeout(() => {
          router.push(targetNav);
        }, 2200);
      }

    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = { role: 'assistant', content: "An error occurred while compiling Gemini agent workflows." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
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

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-140px)]">
        
        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-indigo-400 glow-indigo">
              <MessageSquareCode className="size-5" />
            </span>
            <div>
              <h1 className="text-lg font-black text-white">Aetheris Conversational Buddy</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Agent online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Alert Banner */}
        {navAlert && (
          <div className="mb-4 rounded-lg bg-indigo-950/50 border border-indigo-905/60 px-4 py-3 text-xs text-indigo-300 font-bold flex items-center gap-2 shrink-0 animate-pulse">
            <Loader2 className="animate-spin size-4 shrink-0 text-indigo-400" />
            <span>{navAlert}</span>
          </div>
        )}

        {/* Chat Messages Feed Area */}
        <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4 min-h-0 select-text">
          
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div className={`size-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-bold ${
                  isUser 
                    ? 'bg-slate-900 border-slate-800 text-indigo-400' 
                    : 'bg-indigo-950/40 border-indigo-900/40 text-indigo-300'
                }`}>
                  {isUser ? <User className="size-4" /> : <Sparkles className="size-4" />}
                </div>

                {/* Bubble Block */}
                <div className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed border ${
                  isUser 
                    ? 'bg-indigo-650 border-indigo-500 text-white rounded-tr-none' 
                    : 'bg-slate-900/40 border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="size-8 rounded-full shrink-0 flex items-center justify-center bg-indigo-950/40 border border-indigo-900/40 text-indigo-300">
                <Sparkles className="size-4" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-900/40 border border-slate-800 text-slate-200 rounded-tl-none flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-slate-500 dot-blink" />
                <span className="size-1.5 rounded-full bg-slate-500 dot-blink" />
                <span className="size-1.5 rounded-full bg-slate-500 dot-blink" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Block */}
        <div className="shrink-0 mb-4">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">Suggested Action items</span>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                disabled={isTyping}
                className="flex items-center gap-1 text-[11px] rounded-lg border border-slate-900 hover:border-slate-800 bg-slate-900/10 hover:bg-slate-900/30 text-slate-400 hover:text-slate-200 px-3 py-2 transition font-medium text-left"
              >
                <CornerDownRight className="size-3 text-indigo-400 shrink-0" />
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Input Area */}
        <div className="relative shrink-0">
          
          {/* Floating Dropdown Actions Menu */}
          {showMenu && (
            <div className="absolute bottom-16 left-2 z-50 w-72 rounded-2xl glass-panel bg-slate-950 border border-slate-800 shadow-2xl p-2.5 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pb-1.5 border-b border-slate-900">
                Gemini Document & Chat Actions
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = '.csv';
                    fileInputRef.current.click();
                  }
                }}
                className="w-full text-left text-xs font-semibold rounded-lg px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900/60 flex items-center gap-2 transition cursor-pointer"
              >
                <span className="p-1 rounded bg-emerald-950/40 text-emerald-400">
                  <BadgeDollarSign className="size-3.5" />
                </span>
                <span>Analyze Travel Expenses (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = '.txt';
                    fileInputRef.current.click();
                  }
                }}
                className="w-full text-left text-xs font-semibold rounded-lg px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900/60 flex items-center gap-2 transition cursor-pointer"
              >
                <span className="p-1 rounded bg-purple-950/40 text-purple-400">
                  <ClipboardList className="size-3.5" />
                </span>
                <span>Parse Booking Voucher (TXT)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  setInputText("Plan a 3-day budget trip to Paris, France");
                }}
                className="w-full text-left text-xs font-semibold rounded-lg px-2.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900/60 flex items-center gap-2 transition cursor-pointer"
              >
                <span className="p-1 rounded bg-sky-950/40 text-sky-400">
                  <Compass className="size-3.5" />
                </span>
                <span>Plan Custom Itinerary</span>
              </button>
            </div>
          )}

          {/* Main Search/Prompt Container */}
          <div className="relative flex flex-col w-full rounded-[24px] border border-slate-800 bg-[#0f1115]/95 shadow-2xl p-1.5 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-950/50 animate-fade-in">
            
            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileAttach}
              className="hidden"
            />

            {/* File attachment preview inside the input bar */}
            {attachedFile && (
              <div className="flex flex-wrap gap-2 px-3 py-1.5 border-b border-slate-800/40 mb-1.5 animate-fade-in">
                <div className="flex items-center gap-2 bg-indigo-950/55 border border-indigo-900/60 rounded-full px-3 py-0.5 text-xs text-indigo-300">
                  <FileSpreadsheet className="size-3.5 text-indigo-400 animate-pulse" />
                  <span className="font-medium truncate max-w-[180px]">{attachedFile.name}</span>
                  <span className="text-[10px] text-slate-500">({(attachedFile.size / 1024).toFixed(1)} KB)</span>
                  <button 
                    type="button" 
                    onClick={handleRemoveAttachment} 
                    className="ml-1 text-slate-400 hover:text-red-400 transition font-bold cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            )}

            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} 
              className="flex items-center gap-2 pl-2 pr-1"
            >
              {/* Plus button */}
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className={`flex items-center justify-center size-9 rounded-full transition shrink-0 cursor-pointer ${
                  showMenu ? 'bg-indigo-950/60 text-indigo-400' : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200'
                }`}
                title="Google Gemini Actions & File Upload"
              >
                <Plus className="size-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                disabled={isTyping}
                placeholder="Ask Gemini - type a message or upload files..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none text-xs text-slate-200 placeholder-slate-500 py-2.5 px-1"
              />

              {/* Submit button */}
              <button
                type="submit"
                disabled={isTyping || (!inputText.trim() && !attachedFileContent)}
                className="flex items-center justify-center size-9 rounded-full bg-indigo-650 hover:bg-indigo-600 text-white transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
              >
                {isTyping ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <Send className="size-3.5" />
                )}
              </button>
            </form>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}
