import { useCallback, useEffect, useRef, useState } from 'react';
import { loadJSON, saveJSON, StorageKeys } from '../utils/storage';

/**
 * Hook genérico para listas de ids persistidas no aparelho.
 * Carrega uma vez na montagem, grava a cada mudança (fire-and-forget,
 * o wrapper de storage já engole erros).
 */
function usePersistedIds(key: string) {
  const [ids, setIds] = useState<string[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    let alive = true;
    loadJSON<string[]>(key, []).then((v) => {
      if (alive) {
        setIds(Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
        loaded.current = true;
      }
    });
    return () => {
      alive = false;
    };
  }, [key]);

  useEffect(() => {
    if (loaded.current) void saveJSON(key, ids);
  }, [key, ids]);

  return [ids, setIds] as const;
}

/** Favoritos: toggle simples, persistido. */
export function useFavorites() {
  const [favoritos, setFavoritos] = usePersistedIds(StorageKeys.favoritos);

  const toggleFavorito = useCallback(
    (id: string) => {
      setFavoritos((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
      );
    },
    [setFavoritos]
  );

  return { favoritos, toggleFavorito };
}

const MAX_RECENTES = 20;

/** Histórico de uso: registra o id quando o usuário copia um prompt. */
export function useRecents() {
  const [recentes, setRecentes] = usePersistedIds(StorageKeys.recentes);

  const registrarUso = useCallback(
    (id: string) => {
      setRecentes((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECENTES));
    },
    [setRecentes]
  );

  return { recentes, registrarUso };
}
