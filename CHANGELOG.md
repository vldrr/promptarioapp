# Changelog

## [1.2.0] — 2026-07-17

### Correções críticas
- **Estrutura de diretórios corrigida**: todos os arquivos foram reorganizados para `src/` que os imports esperavam. O projeto estava com os arquivos na raiz mas os imports apontavam para `./src/`, causando falha de build imediata.
- **Imports corrigidos em todos os módulos**: 28 imports atualizados para os caminhos corretos.
- **Bug de validação corrigido**: `validatePrompts` lançava `TypeError` ao receber `null` na lista — adicionada guarda `item === null || typeof item !== 'object'`.
- **Tipos Jest instalados**: `@types/jest` adicionado para eliminar erros de TypeScript nos testes.
- **ESLint corrigido**: `eslint-config-prettier` instalado.

### Melhorias de UX
- **SafeAreaView** no App.tsx para evitar sobreposição com barra de status em dispositivos com notch.
- **Feedback de press** melhorado nos chips, botões e cards com `opacity` e `scale` sutis.
- **Toque no backdrop** do modal agora fecha o modal.
- **EmptyState** com ícone de lupa para melhor comunicação visual.
- **Sombras nos cards** com `elevation: 2` para Android.
- **Teclado** fecha ao arrastar a lista (`keyboardDismissMode="on-drag"`).

### Assets e configuração
- **Ícone do app** gerado com identidade visual PromptÁrio.
- **Ícone adaptativo** e **splash screen** gerados.
- **app.json** atualizado com assets, permissões Android e versionCode 3.
- **eas.json** atualizado para build e submit na Play Store.
- **`.gitignore`** criado com exclusões adequadas para Expo.
- **Cores de ferramentas** expandidas: DALL-E, Copilot e Perplexity.

---

## [1.1.0] — Refatoração completa

### Performance
- `React.memo` em todos os componentes de lista, com comparador customizado no `PromptCard` (favoritar 1 card não re-renderiza os demais)
- `useCallback`/`useMemo` em todos os handlers e derivações
- Debounce de 250ms na busca (`useDebounce`)
- FlatList com tuning de virtualização (`initialNumToRender`, `windowSize`, `removeClippedSubviews`)
- Filtro/ordenação extraídos para função pura memoizada
- Validação do JSON executada uma única vez no load do módulo

### UX
- Tema claro/escuro com detecção do sistema + preferência persistida
- Animação de entrada nos cards e pulso no botão Copiar (native driver)
- Botão de limpar busca; contador de resultados
- Estado de erro no botão Copiar (falha de clipboard não quebra o app)
- Compartilhamento de prompts via Share API nativa

### Funcionalidades
- Ordenação: Padrão, A-Z (pt-BR), Mais usados
- Filtro multi-seleção por ferramenta, combinável com categoria/busca/favoritos
- Histórico dos 20 prompts copiados mais recentemente (alimenta "Mais usados")
- Busca insensível a acentos ("edicao" encontra "Edição")

### Segurança e robustez
- Validação e sanitização completa do `prompts.json` (campos faltando, ids duplicados, caracteres de controle)
- Wrapper de AsyncStorage que nunca lança exceção
- ErrorBoundary global com tela de recuperação e ponto único para plugar Sentry

### Manutenibilidade
- Migração completa para TypeScript strict
- Refatoração em componentes, hooks e utils (App.tsx caiu de ~300 para ~180 linhas de pura composição)
- Testes unitários da lógica de validação e filtro
- ESLint + Prettier configurados
- CI no GitHub Actions (typecheck + testes)
- Documentação: README, ARCHITECTURE.md, JSDoc nos módulos

### Fora do escopo (decisão deliberada — ver ARCHITECTURE.md)
- FlashList, Redux, Sentry, backend: violariam as restrições de projeto leve/offline

---

# Migração da v1.0 para v1.1

1. Faça backup do seu `src/data/prompts.json` atual (se você adicionou prompts próprios)
2. Apague a pasta antiga `promptario-app` (ou renomeie para `promptario-app-v1`)
3. Extraia o novo projeto e restaure seu `prompts.json` em `src/data/`
4. No terminal:
   ```bash
   cd promptario-app
   npm install
   npx expo start
   ```
5. Favoritos salvos no aparelho são preservados automaticamente (mesmas chaves de storage)

Nada muda no formato do `prompts.json` — seus prompts existentes funcionam sem alteração.
