import React from 'react';
import { StudioMode } from '../types';
import { Anchor, FileText, MessageSquare, Hash, Calendar } from 'lucide-react';

interface TabsProps {
  currentMode: StudioMode;
  onModeChange: (mode: StudioMode) => void;
}

const TABS: { id: StudioMode; label: string; icon: React.ReactNode }[] = [
  { id: 'hooks', label: 'Hooks', icon: <Anchor className="w-4 h-4" /> },
  { id: 'scripts', label: 'Roteiros', icon: <FileText className="w-4 h-4" /> },
  { id: 'captions', label: 'Legendas', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'hashtags', label: 'Hashtags', icon: <Hash className="w-4 h-4" /> },
  { id: 'planner', label: 'Planner', icon: <Calendar className="w-4 h-4" /> },
];

export const Tabs: React.FC<TabsProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 md:pb-0">
      {TABS.map((tab) => {
        const isActive = currentMode === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onModeChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
              ${isActive 
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};