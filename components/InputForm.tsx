import React from 'react';
import { GenerateContentData, StudioMode, TONES } from '../types';
import { Button } from './Button';
import { Wand2, RefreshCw, Trash2 } from 'lucide-react';

interface InputFormProps {
  mode: StudioMode;
  isLoading: boolean;
  data: GenerateContentData;
  onChange: (data: GenerateContentData) => void;
  onGenerate: () => void;
  onAlternative: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ 
  mode, 
  isLoading, 
  data, 
  onChange, 
  onGenerate, 
  onAlternative 
}) => {
  
  const handleChange = (field: keyof GenerateContentData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleClearContext = () => {
    handleChange('additionalInfo', '');
  };

  const getModeDescription = () => {
    switch(mode) {
      case 'hooks': return 'Gere ganchos que prendam a atenção nos primeiros segundos.';
      case 'scripts': return 'Crie um roteiro passo-a-passo para seu vídeo.';
      case 'captions': return 'Legendas engajadoras otimizadas para SEO.';
      case 'hashtags': return 'Encontre as tags perfeitas para viralizar.';
      case 'planner': return 'Organize sua semana de conteúdo.';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Configuração</h2>
        <p className="text-sm text-slate-400">{getModeDescription()}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="flex-1 space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Tema ou Nicho
          </label>
          <input
            type="text"
            required
            value={data.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            placeholder="Ex: Dicas de Viagem, Marketing Digital..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Público Alvo
          </label>
          <input
            type="text"
            required
            value={data.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
            placeholder="Ex: Jovens universitários, Donos de pets..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Tom de Voz
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TONES.slice(0, 6).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => handleChange('tone', t)}
                className={`text-sm py-2 px-3 rounded-md border transition-all ${
                  data.tone === t
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Informações / Contexto
            </label>
            {data.additionalInfo && (
               <button 
                 type="button" 
                 onClick={handleClearContext}
                 className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
               >
                 <Trash2 className="w-3 h-3" /> Limpar
               </button>
            )}
          </div>
          <textarea
            value={data.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            placeholder="Algum detalhe específico? Se você veio de outra aba, o contexto aparecerá aqui."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-h-[120px] resize-none text-sm leading-relaxed"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="flex-1"
            leftIcon={<Wand2 className="w-4 h-4" />}
          >
            Gerar {mode === 'scripts' ? 'Roteiro' : mode === 'hooks' ? 'Hooks' : 'Conteúdo'}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onAlternative}
            disabled={isLoading || !data.topic}
            title="Gerar Variação"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </form>
    </div>
  );
};