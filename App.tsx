import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { GenerateContentData, GeneratedResult, StudioMode, HistoryItem, TONES } from './types';
import { generateTikTokContent } from './services/geminiService';
import { getHistory, saveHistoryItem } from './services/historyService';

export default function App() {
  const [mode, setMode] = useState<StudioMode>('hooks');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // State lifted from InputForm to persist across tabs
  const [inputData, setInputData] = useState<GenerateContentData>({
    topic: '',
    audience: '',
    tone: TONES[0],
    additionalInfo: ''
  });

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Filter history for current mode
  const currentHistory = useMemo(() => {
    return history.filter(item => item.mode === mode);
  }, [history, mode]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    const title = getTitleForMode(mode);

    // Keep old content while loading new one if it exists, or reset
    if (!result) {
       setResult({ content: '', status: 'generating', title: 'Gerando...' });
    }
    
    try {
      const response = await generateTikTokContent(mode, inputData);
      
      const newResult: GeneratedResult = {
        content: response,
        status: 'done',
        title: title
      };
      
      setResult(newResult);

      // Save to history
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        mode,
        content: response,
        title,
        timestamp: Date.now(),
        data: { ...inputData } // Snapshot of data at time of generation
      };
      
      const updatedHistory = saveHistoryItem(historyItem);
      setHistory(updatedHistory);

    } catch (error) {
      console.error(error);
      setResult({
        content: "Ocorreu um erro ao gerar o conteúdo. Por favor, verifique sua API Key e tente novamente.",
        status: 'error',
        title: 'Erro'
      });
    } finally {
      setIsLoading(false);
    }
  }, [mode, inputData, result]);

  const handleAlternative = useCallback(async () => {
    await handleGenerate();
  }, [handleGenerate]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setResult({
      content: item.content,
      status: 'done',
      title: item.title
    });
    // Optional: Load history data back into inputs?
    // setInputData(item.data); 
  }, []);

  const handleTransferContext = useCallback((targetMode: StudioMode, context: string) => {
    setMode(targetMode);
    
    // Append the context to additionalInfo
    const prevModeTitle = getTitleForMode(mode);
    const newContext = `\n\n--- CONTEXTO (${prevModeTitle}) ---\n${context}`;
    
    setInputData(prev => ({
      ...prev,
      additionalInfo: (prev.additionalInfo || '') + newContext
    }));

    // Reset result so the user sees they need to generate again
    setResult(null);
  }, [mode]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans">
      <Header />
      
      <div className="flex-none px-4 pt-2 pb-0 bg-slate-900 border-b border-slate-800 z-0">
         <Tabs currentMode={mode} onModeChange={(newMode) => {
           setMode(newMode);
           // We don't reset result immediately here to allow users to reference previous tab content if they switch back quickly
           // But traditionally in this UI, switching tabs usually implies a new context. 
           // Let's reset result to keep it clean, as inputs persist now.
           setResult(null); 
         }} />
      </div>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane - Inputs */}
        <section className="flex-1 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950 p-4 md:p-6 lg:p-8 min-w-[320px] max-w-full md:max-w-[400px] lg:max-w-[450px]">
          <InputForm 
            mode={mode} 
            isLoading={isLoading} 
            data={inputData}
            onChange={setInputData}
            onGenerate={handleGenerate}
            onAlternative={handleAlternative}
          />
        </section>

        {/* Right Pane - Output */}
        <section className="flex-1 overflow-y-auto bg-slate-900/50 p-4 md:p-6 lg:p-8 relative">
          <OutputDisplay 
            result={result} 
            isLoading={isLoading}
            history={currentHistory}
            currentMode={mode}
            onSelectHistory={handleSelectHistory}
            onTransferContext={handleTransferContext}
          />
        </section>
      </main>
    </div>
  );
}

function getTitleForMode(mode: StudioMode): string {
  switch(mode) {
    case 'hooks': return 'Ideias de Ganchos';
    case 'scripts': return 'Roteiro Completo';
    case 'captions': return 'Legendas & SEO';
    case 'hashtags': return 'Sugestões de Hashtags';
    case 'planner': return 'Planejamento Semanal';
    default: return 'Resultado';
  }
}