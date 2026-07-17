import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';

import rawData from './src/data/prompts.json';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Chip, EmptyState, Header } from './src/components/Common';
import { SearchBar } from './src/components/SearchBar';
import { PromptCard } from './src/components/PromptCard';
import { PromptModal } from './src/components/PromptModal';
import { useDebounce } from './src/hooks/useDebounce';
import { useFavorites, useRecents } from './src/hooks/usePersisted';
import { validatePrompts } from './src/utils/validation';
import { filterPrompts } from './src/utils/filterPrompts';
import { fonts } from './src/theme';
import { Prompt, SortMode } from './src/types';

/**
 * PromptÁrio — banco de prompts offline.
 * App.tsx é apenas composição + orquestração de estado; toda lógica vive
 * em hooks (src/hooks) e funções puras (src/utils), e toda UI em
 * componentes memoizados (src/components).
 */

// Validado uma única vez no carregamento do módulo (dados estáticos).
const PROMPTS: Prompt[] = validatePrompts(rawData);

const SORT_LABELS: Record<string, SortMode> = {
  Padrão: 'padrao',
  'A-Z': 'az',
  'Mais usados': 'recentes',
};

function Main() {
  const { colors, mode } = useTheme();
  const { favoritos, toggleFavorito } = useFavorites();
  const { recentes, registrarUso } = useRecents();

  const [busca, setBusca] = useState('');
  const buscaDebounced = useDebounce(busca, 250);
  const [categoria, setCategoria] = useState('Todos');
  const [ferramentas, setFerramentas] = useState<string[]>([]);
  const [soFavoritos, setSoFavoritos] = useState(false);
  const [sort, setSort] = useState<SortMode>('padrao');
  const [selecionado, setSelecionado] = useState<Prompt | null>(null);

  // Derivados dos dados — calculados uma vez (dados estáticos).
  const categorias = useMemo(
    () => ['Todos', ...new Set(PROMPTS.map((p) => p.categoria))],
    []
  );
  const todasFerramentas = useMemo(
    () => [...new Set(PROMPTS.map((p) => p.ferramenta))],
    []
  );

  // Filtro memoizado: só recalcula quando um input do filtro muda,
  // e a busca entra debounced (250ms após a última tecla).
  const filtrados = useMemo(
    () =>
      filterPrompts(PROMPTS, {
        query: buscaDebounced,
        categoria,
        ferramentas,
        soFavoritos,
        favoritos,
        sort,
        recentes,
      }),
    [buscaDebounced, categoria, ferramentas, soFavoritos, favoritos, sort, recentes]
  );

  // Callbacks estáveis: referência constante entre renders, permitindo
  // que o React.memo dos cards funcione de verdade.
  const abrirPrompt = useCallback((item: Prompt) => setSelecionado(item), []);
  const fecharPrompt = useCallback(() => setSelecionado(null), []);
  const toggleFerramenta = useCallback((f: string) => {
    setFerramentas((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }, []);
  const escolherSort = useCallback((label: string) => {
    setSort(SORT_LABELS[label] ?? 'padrao');
  }, []);
  const toggleSoFavoritos = useCallback(() => setSoFavoritos((v) => !v), []);

  const renderItem = useCallback(
    ({ item }: { item: Prompt }) => (
      <PromptCard
        item={item}
        favorito={favoritos.includes(item.id)}
        onPress={abrirPrompt}
        onToggleFav={toggleFavorito}
      />
    ),
    [favoritos, abrirPrompt, toggleFavorito]
  );

  const keyExtractor = useCallback((item: Prompt) => item.id, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Header />
      <SearchBar
        value={busca}
        onChange={setBusca}
        soFavoritos={soFavoritos}
        onToggleFavoritos={toggleSoFavoritos}
      />

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {categorias.map((c) => (
          <Chip key={c} label={c} active={categoria === c} onPress={setCategoria} />
        ))}
      </ScrollView>

      {/* Ferramentas (multi-seleção) + ordenação */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {todasFerramentas.map((f) => (
          <Chip
            key={f}
            label={f}
            active={ferramentas.includes(f)}
            onPress={toggleFerramenta}
          />
        ))}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        {Object.entries(SORT_LABELS).map(([label, value]) => (
          <Chip key={label} label={label} active={sort === value} onPress={escolherSort} />
        ))}
      </ScrollView>

      {/* Contador de resultados — feedback + região viva p/ leitores de tela */}
      <Text
        style={[styles.count, { color: colors.textDim }]}
        accessibilityLiveRegion="polite"
      >
        {filtrados.length} {filtrados.length === 1 ? 'prompt' : 'prompts'}
      </Text>

      <FlatList
        data={filtrados}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState />}
        // Tuning de virtualização p/ listas de cards de altura variável:
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
      />

      <PromptModal prompt={selecionado} onClose={fecharPrompt} onCopied={registrarUso} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  // Splash simples enquanto as fontes carregam (evita flash de fonte errada).
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#0F172A' }} />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 56 },
  // flexGrow: 0 + altura fixa: sem isso, o react-native-web colapsa o
  // ScrollView horizontal para altura 0 e as fileiras se sobrepõem.
  chipsScroll: { flexGrow: 0, height: 48 },
  chips: { paddingHorizontal: 20, gap: 8, paddingBottom: 10, alignItems: 'center' },
  divider: { width: 1, height: 20, marginHorizontal: 4 },
  count: {
    fontFamily: fonts.medium,
    fontSize: 11,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 12 },
});
