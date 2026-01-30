import { GoogleGenAI } from "@google/genai";
import { GenerateContentData, StudioMode } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (mode: StudioMode): string => {
  const baseInstruction = "Você é um especialista em marketing viral para TikTok com anos de experiência em crescimento orgânico.";
  
  switch (mode) {
    case 'hooks':
      return `${baseInstruction} Seu objetivo é criar 'hooks' (ganchos) visuais e verbais irresistíveis que parem o scroll nos primeiros 3 segundos.`;
    case 'scripts':
      return `${baseInstruction} Seu objetivo é escrever roteiros completos, engajadores e com alta retenção, incluindo indicações visuais e de áudio.`;
    case 'captions':
      return `${baseInstruction} Seu objetivo é escrever legendas otimizadas para SEO (TikTok Search) que incentivem comentários e compartilhamentos.`;
    case 'hashtags':
      return `${baseInstruction} Seu objetivo é pesquisar e sugerir as melhores hashtags misturando nichadas, médias e amplas para maximizar o alcance.`;
    case 'planner':
      return `${baseInstruction} Seu objetivo é criar um plano de conteúdo semanal estratégico e coeso.`;
    default:
      return baseInstruction;
  }
};

const buildPrompt = (mode: StudioMode, data: GenerateContentData): string => {
  const { topic, audience, tone, additionalInfo } = data;
  const info = additionalInfo ? `Informações extras: ${additionalInfo}` : '';

  switch (mode) {
    case 'hooks':
      return `Gere 10 ganchos virais (hooks) para um vídeo sobre "${topic}".
      Público-alvo: ${audience}
      Tom de voz: ${tone}
      ${info}
      
      IMPORTANTE: Formate a saída como uma lista numerada simples (1., 2., 3...).
      Para cada gancho, inclua uma breve explicação da psicologia por trás.`;
      
    case 'scripts':
      return `Escreva um roteiro completo de TikTok (30 a 60 segundos) sobre "${topic}".
      Público-alvo: ${audience}
      Tom de voz: ${tone}
      ${info}
      
      Estrutura do roteiro:
      1. Gancho Visual/Verbal (0-3s)
      2. Desenvolvimento/Retenção (3-45s)
      3. Call to Action (CTA) forte (45-60s)
      
      Inclua sugestões de cenas, textos na tela e sugestão de áudio/música.`;

    case 'captions':
      return `Crie 3 opções de legendas para um vídeo sobre "${topic}".
      Público-alvo: ${audience}
      Tom de voz: ${tone}
      ${info}
      
      As legendas devem incluir:
      1. Uma primeira linha que desperte curiosidade (expandindo o gancho do vídeo).
      2. Palavras-chave de SEO integradas naturalmente no texto.
      3. Uma pergunta para gerar comentários.`;

    case 'hashtags':
      return `Gere uma lista estratégica de 30 hashtags para um vídeo sobre "${topic}".
      Público-alvo: ${audience}
      ${info}
      
      Divida as hashtags em 3 grupos:
      1. Hashtags de Nicho (Específicas)
      2. Hashtags de Comunidade (Interesses relacionados)
      3. Hashtags Virais/Amplas (Grande volume)
      
      Não use hashtags banidas ou genéricas demais que não tragam público qualificado.`;

    case 'planner':
      return `Crie um planejamento de conteúdo de 7 dias (1 vídeo por dia) para um perfil sobre "${topic}".
      Público-alvo: ${audience}
      Estratégia/Tom: ${tone}
      ${info}
      
      Para cada dia, forneça:
      - Título do Vídeo
      - Formato (Ex: Vlog, Tutorial, Skit, POV, Lista)
      - Breve resumo do conceito
      - Objetivo (Venda, Crescimento, Engajamento)`;
      
    default:
      return `Gere conteúdo sobre ${topic}.`;
  }
};

export const generateTikTokContent = async (mode: StudioMode, data: GenerateContentData): Promise<string> => {
  try {
    const prompt = buildPrompt(mode, data);
    const systemInstruction = getSystemInstruction(mode);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8, // Slightly creative for content creation
      }
    });

    return response.text || "Não foi possível gerar o conteúdo. Tente novamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};