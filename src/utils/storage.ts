import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Camada segura sobre o AsyncStorage.
 * Regras:
 *  - Nunca lança: qualquer falha (JSON corrompido, storage cheio) retorna fallback.
 *  - Todas as chaves do app usam o prefixo "@promptario:" para evitar colisões.
 *  - Nada sensível é armazenado aqui (apenas ids de favoritos/recentes e tema),
 *    portanto não há necessidade de criptografia — se dados sensíveis forem
 *    adicionados no futuro, migre para expo-secure-store.
 */

const PREFIX = '@promptario:';

export const StorageKeys = {
  favoritos: `${PREFIX}favoritos`,
  recentes: `${PREFIX}recentes`,
  tema: `${PREFIX}tema`,
} as const;

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    if (__DEV__) console.warn(`[storage] falha ao ler ${key}:`, err);
    return fallback;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    if (__DEV__) console.warn(`[storage] falha ao gravar ${key}:`, err);
  }
}
