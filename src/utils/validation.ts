import { Prompt } from './types';

/**
 * Validação e sanitização do banco de prompts.
 * O prompts.json é editado manualmente, então o app precisa sobreviver a:
 * campos faltando, tipos errados, ids duplicados e strings vazias.
 * Entradas inválidas são descartadas silenciosamente (com aviso em dev)
 * em vez de derrubar o app inteiro.
 */

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

function sanitize(s: string): string {
  // Remove caracteres de controle que quebrariam a renderização/cópia,
  // preservando quebras de linha legítimas do prompt.
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
}

export function validatePrompts(raw: unknown): Prompt[] {
  const list = (raw as { prompts?: unknown[] })?.prompts;
  if (!Array.isArray(list)) return [];

  const seen = new Set<string>();
  const valid: Prompt[] = [];

  for (const item of list) {
    if (item === null || typeof item !== 'object') continue;
    const p = item as Partial<Prompt>;
    const ok =
      isNonEmptyString(p.id) &&
      isNonEmptyString(p.titulo) &&
      isNonEmptyString(p.categoria) &&
      isNonEmptyString(p.ferramenta) &&
      isNonEmptyString(p.descricao) &&
      isNonEmptyString(p.prompt);

    if (!ok) {
      if (__DEV__) console.warn('[prompts] entrada inválida ignorada:', p?.id ?? p);
      continue;
    }
    if (seen.has(p.id!)) {
      if (__DEV__) console.warn('[prompts] id duplicado ignorado:', p.id);
      continue;
    }
    seen.add(p.id!);
    valid.push({
      id: p.id!,
      titulo: sanitize(p.titulo!),
      categoria: sanitize(p.categoria!),
      ferramenta: sanitize(p.ferramenta!),
      descricao: sanitize(p.descricao!),
      prompt: sanitize(p.prompt!),
    });
  }
  return valid;
}
