export type StudioMode = 'hooks' | 'scripts' | 'captions' | 'hashtags' | 'planner';

export interface GenerateContentData {
  topic: string;
  audience: string;
  tone: string;
  additionalInfo?: string;
}

export interface GeneratedResult {
  content: string;
  status: 'idle' | 'generating' | 'done' | 'error';
  title: string;
}

export interface HistoryItem {
  id: string;
  mode: StudioMode;
  content: string;
  title: string;
  timestamp: number;
  data: GenerateContentData;
}

export const TONES = [
  'Divertido',
  'Educacional',
  'Inspirador',
  'Polêmico',
  'Casual',
  'Profissional',
  'Sarcástico',
  'Urgente'
];