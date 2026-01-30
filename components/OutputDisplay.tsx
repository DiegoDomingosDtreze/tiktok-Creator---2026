import React, { useState, useEffect, useMemo } from 'react';
import { GeneratedResult, HistoryItem, StudioMode } from '../types';
import { Copy, Check, Share2, AlertCircle, Clock, RotateCcw, ArrowRight, FileText, MessageSquare, Hash, CheckCircle2, MousePointerClick } from 'lucide-react';
import { Button } from './Button';

interface OutputDisplayProps {
  result: GeneratedResult | null;
  isLoading: boolean;
  currentMode: StudioMode;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onTransferContext: (targetMode: StudioMode, context: string) => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
  result, 
  isLoading, 
  currentMode,
  history, 
  onSelectHistory,
  onTransferContext
}) => {
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHook, setSelectedHook] = useState<string | null>(null);

  // Reset selection when result changes
  useEffect(() => {
    setSelectedHook(null);
  }, [result]);

  const handleCopy = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRestore = (item: HistoryItem) => {
    onSelectHistory(item);
    setShowHistory(false);
  };

  // Helper to parse hooks into selectable items
  const parsedItems = useMemo(() => {
    if (currentMode !== 'hooks' || !result?.content) return [];
    
    // Split by numbered list pattern (e.g., "1.", "2.", "10.")
    // This regex looks for a digit followed by a dot at the start of a line or after a newline
    const regex = /(?:^|\n)(\d+[\.\)]\s+.*?)(?=(?:\n\d+[\.\)])|$)/gs;
    const matches = result.content.match(regex);
    
    return matches ? matches.map(m => m.trim()) : [];
  }, [result, currentMode]);

  // Helper to format date
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  // Workflow Actions
  const renderNextActions = () => {
    if (!result || result.status !== 'done' || showHistory) return null;

    const actions: { label: string; mode: StudioMode; icon: React.ReactNode }[] = [];

    // Define workflow logic based on current mode
    if (currentMode === 'hooks') {
      actions.push({ label: 'Criar Roteiro', mode: 'scripts', icon: <FileText className="w-4 h-4" /> });
      actions.push({ label: 'Criar Legendas', mode: 'captions', icon: <MessageSquare className="w-4 h-4" /> });
    } else if (currentMode === 'scripts') {
      actions.push({ label: 'Criar Legendas', mode: 'captions', icon: <MessageSquare className="w-4 h-4" /> });
      actions.push({ label: 'Gerar Hashtags', mode: 'hashtags', icon: <Hash className="w-4 h-4" /> });
    } else if (currentMode === 'planner') {
      actions.push({ label: 'Criar Roteiro de um tópico', mode: 'scripts', icon: <FileText className="w-4 h-4" /> });
    }

    if (actions.length === 0) return null;

    const handleActionClick = (targetMode: StudioMode) => {
      let contextToSend = result.content;
      
      // If we are in hooks mode and have a selection, send only that selection + context
      if (currentMode === 'hooks' && selectedHook) {
        contextToSend = `Baseado EXCLUSIVAMENTE neste Hook selecionado:\n"${selectedHook}"\n\n(Ignore os outros hooks gerados anteriormente).`;
      } else if (currentMode === 'hooks' && parsedItems.length > 0) {
        // If items were parsed but none selected, clarify we are sending all
        contextToSend = `Lista de Hooks gerada:\n${result.content}\n\nEscolha o melhor hook dessa lista e crie o conteúdo.`;
      }

      onTransferContext(targetMode, contextToSend);
    };

    return (
      <div className="mt-6 border-t border-slate-800 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" /> Próximos Passos
          </h4>
          {currentMode === 'hooks' && !selectedHook && parsedItems.length > 0 && (
            <span className="text-xs text-indigo-400 animate-pulse flex items-center gap-1">
              <MousePointerClick className="w-3 h-3" />
              Selecione um hook acima para focar
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.mode}
              variant="outline"
              size="sm"
              onClick={() => handleActionClick(action.mode)}
              leftIcon={action.icon}
              className={`text-xs border-slate-700 bg-slate-900/50 hover:bg-indigo-500/10 hover:border-indigo-500/50 hover:text-indigo-300 ${
                selectedHook && currentMode === 'hooks' ? 'ring-2 ring-indigo-500/30 bg-indigo-500/10 border-indigo-500/50' : ''
              }`}
            >
              {action.label} {selectedHook && currentMode === 'hooks' ? '(Selecionado)' : ''}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // Content Renderer (Handles both raw text and interactive list)
  const renderContent = () => {
    if (currentMode === 'hooks' && parsedItems.length > 0 && !showHistory) {
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 mb-2">Clique em um hook para selecioná-lo como base para o roteiro.</p>
          <div className="grid grid-cols-1 gap-3">
            {parsedItems.map((item, index) => {
              const isSelected = selectedHook === item;
              return (
                <div 
                  key={index}
                  onClick={() => setSelectedHook(isSelected ? null : item)}
                  className={`
                    p-4 rounded-lg border transition-all cursor-pointer relative group
                    ${isSelected 
                      ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800 hover:border-slate-600'
                    }
                  `}
                >
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{item}</div>
                  <div className={`absolute top-3 right-3 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                     {isSelected 
                       ? <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                       : <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                     }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="prose prose-invert prose-slate max-w-none">
        <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-sm md:text-base">
          {result?.content}
        </div>
      </div>
    );
  };

  // Loading State
  if (isLoading && (!result || result.status === 'generating')) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-indigo-400 font-medium">Criando conteúdo viral...</p>
      </div>
    );
  }

  // Header Component
  const Header = () => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <span className="w-2 h-6 rounded-full bg-indigo-500 block"></span>
        {showHistory ? 'Histórico' : (result?.title || 'Resultado')}
      </h2>
      <div className="flex gap-2">
        {history.length > 0 && (
          <Button
            variant={showHistory ? 'primary' : 'secondary'}
            size="sm"
            className="text-xs h-8 px-3"
            onClick={() => setShowHistory(!showHistory)}
            leftIcon={<Clock className="w-3 h-3" />}
          >
            {showHistory ? 'Voltar' : 'Histórico'}
          </Button>
        )}
        
        {!showHistory && result?.status === 'done' && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="text-xs h-8 px-3"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
        )}
      </div>
    </div>
  );

  // History View
  if (showHistory) {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleRestore(item)}
              className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-slate-200 text-sm line-clamp-1">
                    {item.data.topic}
                  </h4>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    {formatDate(item.timestamp)} • {item.data.tone}
                  </span>
                </div>
                <RotateCcw className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 font-mono bg-slate-950 p-2 rounded border border-slate-900">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (result?.status === 'error') {
     return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-red-400 space-y-4">
          <AlertCircle className="w-12 h-12" />
          <div className="text-center px-6">
            <h3 className="text-lg font-medium">Ops, algo deu errado.</h3>
            <p className="text-sm mt-2 text-slate-400">{result.content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty State (No Result)
  if (!result) {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center">
            <Share2 className="w-8 h-8 opacity-20" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-400">Pronto para criar?</h3>
            <p className="text-sm max-w-xs mx-auto mt-2">
              Preencha o formulário e use as abas para criar uma estratégia completa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Content Display
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-6 overflow-y-auto shadow-inner">
        {renderContent()}
      </div>
      {renderNextActions()}
    </div>
  );
};