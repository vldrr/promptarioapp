import { Prompt, SortMode } from '../types';

/**
 * Filtro e ordenação em função pura — sem estado, sem React.
 * Extraído do componente para permitir testes unitários diretos
 * e memoização limpa via useMemo no chamador.
 */

export interface FilterOptions {
  query: string;
  categoria: string; // 'Todos' = sem filtro
  ferramentas: string[]; // vazio = sem filtro (multi-seleção)
  soFavoritos: boolean;
  favoritos: string[];
  sort: SortMode;
  recentes: string[]; // ids, mais recente primeiro (usado por sort='recentes')
}

/** Remove acentos para busca tolerante ("edicao" encontra "Edição"). */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function filterPrompts(prompts: Prompt[], o: FilterOptions): Prompt[] {
  const q = normalize(o.query.trim());
  const favSet = new Set(o.favoritos);
  const toolSet = new Set(o.ferramentas);

  let result = prompts.filter((p) => {
    if (o.categoria !== 'Todos' && p.categoria !== o.categoria) return false;
    if (toolSet.size > 0 && !toolSet.has(p.ferramenta)) return false;
    if (o.soFavoritos && !favSet.has(p.id)) return false;
    if (!q) return true;
    return (
      normalize(p.titulo).includes(q) ||
      normalize(p.descricao).includes(q) ||
      normalize(p.categoria).includes(q) ||
      normalize(p.ferramenta).includes(q)
    );
  });

  if (o.sort === 'az') {
    result = [...result].sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
  } else if (o.sort === 'recentes') {
    const rank = new Map(o.recentes.map((id, i) => [id, i]));
    result = [...result].sort(
      (a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity)
    );
  }
  return result;
}
