import React from 'react';
import { Clapperboard, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex-none flex items-center justify-between px-6 py-4 bg-slate-950/50 border-b border-slate-800 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
          <Clapperboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TikTok Creator Studio
          </h1>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Powered by Gemini 3</p>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm">
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI Assistant Active</span>
      </div>
    </header>
  );
};