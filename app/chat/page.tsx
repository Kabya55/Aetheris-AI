"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { MessageSquareCode, Send, Sparkles, User, Loader2, ArrowRight, CornerDownRight } from 'lucide-react';

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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append user message immediately
    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setNavAlert(null);

    try {
      const res = await api.post('/ai/chat', {
        message: textToSend,
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
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }} 
          className="flex gap-3 shrink-0"
        >
          <input
            type="text"
            disabled={isTyping}
            placeholder="Type a message to your AI travel assistant..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-xs rounded-xl glass-input bg-slate-900/40 border-slate-850 px-4 py-3.5 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-500 glow-indigo text-white px-5 py-3.5 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="size-4" />
          </button>
        </form>

      </div>

      <Footer />
    </>
  );
}
