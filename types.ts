/**
 * Tipos centrais do PromptÁrio.
 * Toda estrutura de dados do app passa por aqui.
 */

export interface Prompt {
  id: string;
  titulo: string;
  categoria: string;
  ferramenta: string;
  descricao: string;
  prompt: string;
}

export type ThemeMode = 'dark' | 'light';

export type SortMode = 'padrao' | 'az' | 'recentes';

export interface Palette {
  bg: string;
  surface: string;
  surfaceHi: string;
  border: string;
  text: string;
  textDim: string;
  accent: string;
  accentDark: string;
  star: string;
  danger: string;
  backdrop: string;
}
