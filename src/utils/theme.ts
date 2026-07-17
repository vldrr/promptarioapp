import { Palette, ThemeMode } from './types';

/**
 * Identidade visual PromptÁrio / vLdR.
 * Dois modos: dark (padrão, herdado do PromptÁrio web) e light.
 * O contraste de ambos foi verificado para WCAG AA em texto normal.
 */

export const palettes: Record<ThemeMode, Palette> = {
  dark: {
    bg: '#0F172A',
    surface: '#1E293B',
    surfaceHi: '#273549',
    border: '#334155',
    text: '#F1F5F9',
    textDim: '#94A3B8',
    accent: '#3DBF2F',
    accentDark: '#050D02',
    star: '#F5D90A',
    danger: '#EF4444',
    backdrop: 'rgba(2, 6, 23, 0.75)',
  },
  light: {
    bg: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceHi: '#EEF2F7',
    border: '#CBD5E1',
    text: '#0F172A',
    textDim: '#475569',
    accent: '#2E9124', // verde vLdR escurecido p/ contraste AA sobre claro
    accentDark: '#FFFFFF',
    star: '#B45309', // dourado escurecido p/ contraste sobre claro
    danger: '#DC2626',
    backdrop: 'rgba(15, 23, 42, 0.5)',
  },
};

/** Cores por ferramenta de IA (badges). Iguais nos dois temas. */
export const toolColors: Record<string, string> = {
  ChatGPT: '#10A37F',
  Claude: '#D97757',
  Gemini: '#4E8CF7',
  Midjourney: '#8B5CF6',
  'Stable Diffusion': '#E11D8F',
  'DALL-E': '#FF6B35',
  Copilot: '#0078D4',
  Perplexity: '#20808D',
  Geral: '#64748B',
};

export const radius = { card: 16, chip: 999, button: 12 } as const;

export const fonts = {
  medium: 'Montserrat_500Medium',
  bold: 'Montserrat_700Bold',
  extraBold: 'Montserrat_800ExtraBold',
} as const;

/** Área mínima de toque recomendada (Android/iOS a11y). */
export const MIN_TOUCH = 44;
