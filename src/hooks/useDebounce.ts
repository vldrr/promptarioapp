import { useEffect, useState } from 'react';

/**
 * Debounce de valor: a busca só filtra 250ms após a última tecla,
 * evitando refiltrar+re-renderizar a lista a cada caractere digitado.
 */
export function useDebounce<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
