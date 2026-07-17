# Guia de Arquitetura — PromptÁrio v1.1

## Princípio

Separação em três camadas, cada uma testável e substituível de forma independente. O `App.tsx` só compõe e orquestra estado; ele não contém lógica de negócio nem estilos de card.

```
App.tsx                      Composição + orquestração de estado
├── src/context/             Estado global (tema) via Context API
│   └── ThemeContext.tsx
├── src/hooks/               Lógica com estado reutilizável
│   ├── useDebounce.ts       Busca só filtra 250ms após a última tecla
│   └── usePersisted.ts      useFavorites + useRecents (AsyncStorage)
├── src/utils/               Funções puras (sem React) — 100% testáveis
│   ├── filterPrompts.ts     Filtro + ordenação + busca sem acentos
│   ├── validation.ts        Sanitização do prompts.json
│   └── storage.ts           AsyncStorage que nunca lança exceção
├── src/components/          UI memoizada
│   ├── Common.tsx           Header, Chip, ToolBadge, EmptyState
│   ├── SearchBar.tsx
│   ├── PromptCard.tsx       React.memo com comparador custom
│   ├── PromptModal.tsx      Copiar (animado) + Compartilhar
│   └── ErrorBoundary.tsx    Tela de recuperação de erro
├── src/theme.ts             Paletas dark/light + tokens
├── src/types.ts             Tipos centrais
└── src/data/prompts.json    Banco de dados local (80 prompts)
```

## Decisões e trade-offs

**FlatList em vez de FlashList.** FlashList exige dependência nativa extra; com ~80 itens e cards memoizados, o FlatList com tuning (`initialNumToRender=8`, `windowSize=7`, `removeClippedSubviews`) tem desempenho indistinguível. Se o banco passar de ~500 prompts, migrar para FlashList vale a pena — a interface `renderItem`/`keyExtractor` já está pronta para a troca.

**Context API em vez de Redux.** Só o tema é estado verdadeiramente global. Favoritos e recentes vivem em hooks no `Main` e descem por props para componentes memoizados — adicionar Redux aqui seria complexidade sem retorno.

**Sem backend.** Requisito offline-first. O caminho de evolução está isolado: para sincronizar no futuro, basta substituir a fonte em `App.tsx` (hoje `validatePrompts(rawData)`) por um hook `usePrompts()` que busca de API com fallback ao JSON local — nenhum outro arquivo muda.

**Sem criptografia no storage.** Só armazenamos ids de favoritos/recentes e a preferência de tema — nada sensível. Se algum dia houver dados de usuário, migrar `storage.ts` para `expo-secure-store` (a interface `loadJSON`/`saveJSON` permanece igual).

## Fluxo de performance da lista

1. Tecla digitada → `busca` atualiza → apenas o `SearchBar` re-renderiza (input fluido).
2. 250ms depois → `useDebounce` propaga → `useMemo` refiltra via função pura.
3. `renderItem` estável (useCallback) + `PromptCard` memoizado → só cards que **mudaram** re-renderizam. Favoritar 1 card não toca nos outros.
4. Animações (entrada do card, pulso do botão copiar) usam `useNativeDriver: true` — rodam na thread de UI, imunes a trabalho no JS.

## Acessibilidade

- Todos os controles têm `accessibilityRole`, `accessibilityLabel` e, quando aplicável, `accessibilityState` (chips selecionados, favoritos).
- Área mínima de toque de 44pt (`MIN_TOUCH`) em todos os botões.
- Feedbacks dinâmicos ("Copiado!", contador de resultados) usam `accessibilityLiveRegion` para leitores de tela.
- Paleta light tem accent/star escurecidos para manter contraste AA sobre fundo claro.

## Testes

`src/__tests__/logic.test.ts` cobre a lógica pura: validação (campos faltando, duplicatas, estruturas inválidas) e filtro (busca sem acentos, multi-ferramentas, favoritos, ordenações). A UI foi deixada fora dos testes deliberadamente: a lógica extraída é onde bugs de comportamento nasceriam; testes de renderização exigiriam mais dependências por pouco valor neste tamanho de app.
