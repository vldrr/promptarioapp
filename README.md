# PromptÁrio App v1.2

Banco de prompts offline para Android (e web). Busca com debounce e sem sensibilidade a acentos, filtros por categoria e por múltiplas ferramentas, ordenação, favoritos, histórico de uso, tema claro/escuro, compartilhamento e cópia com um toque.

## Rodando em desenvolvimento

Pré-requisito: Node.js LTS.

```bash
npm install
npx expo start
```

- Pressione **a** → abre no emulador Android
- Pressione **w** → abre no navegador do PC (jeito mais rápido de visualizar)
- Ou escaneie o QR com o **Expo Go** no Android (use `npx expo start --tunnel` se a rede bloquear)

> Primeira vez com TypeScript: o Expo detecta o `tsconfig.json` e instala o que faltar automaticamente.

## Scripts

```bash
npm test            # testes unitários (lógica de filtro e validação)
npm run typecheck   # verificação de tipos TypeScript
npm run lint        # ESLint
```

## Estrutura

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
│   ├── storage.ts           AsyncStorage que nunca lança exceção
│   ├── theme.ts             Paletas dark/light + tokens
│   └── types.ts             Tipos centrais
├── src/components/          UI memoizada
│   ├── Common.tsx           Header, Chip, ToolBadge, EmptyState
│   ├── SearchBar.tsx
│   ├── PromptCard.tsx       React.memo com comparador custom
│   ├── PromptModal.tsx      Copiar (animado) + Compartilhar
│   └── ErrorBoundary.tsx    Tela de recuperação de erro
├── src/__tests__/           Testes unitários
│   └── logic.test.ts
└── src/data/prompts.json    Banco de dados local (80 prompts)
```

## Adicionando prompts

Edite `src/data/prompts.json`:

```json
{
  "id": "mkt-003",
  "titulo": "Nome do prompt",
  "categoria": "Marketing",
  "ferramenta": "ChatGPT",
  "descricao": "O que o prompt faz.",
  "prompt": "Texto que será copiado."
}
```

**Ferramentas suportadas** (com badge colorida): `ChatGPT`, `Claude`, `Gemini`, `Midjourney`, `Stable Diffusion`, `DALL-E`, `Copilot`, `Perplexity`. Qualquer outra ferramenta recebe a badge cinza `Geral`.

Regras aplicadas automaticamente na inicialização (`src/utils/validation.ts`): entradas com campos faltando/vazios são ignoradas, ids duplicados são descartados (fica o primeiro), e caracteres de controle são removidos. Categorias e ferramentas novas viram filtros sozinhas.

## Gerar APK / AAB para Play Store

### Pré-requisitos

```bash
npm install -g eas-cli
eas login
```

### Build de teste (APK)

```bash
eas build -p android --profile preview
```

### Build de produção (AAB para Play Store)

```bash
eas build -p android --profile production
```

> O perfil `production` usa `autoIncrement: true`, então o `versionCode` é incrementado automaticamente a cada build.

### Assets necessários para a Play Store

| Asset | Tamanho | Localização |
|-------|---------|-------------|
| Ícone do app | 512×512 px | `assets/icon.png` ✅ |
| Ícone adaptativo | 1024×1024 px | `assets/adaptive-icon.png` ✅ |
| Splash screen | 1284×2778 px | `assets/splash.png` ✅ |
| Feature graphic | 1024×500 px | Fazer upload direto no Play Console |
| Screenshots | Mín. 2, máx. 8 | Fazer upload direto no Play Console |

### Publicar na Play Store

1. Acesse o [Google Play Console](https://play.google.com/console)
2. Crie um novo app com o pacote `com.vldr.promptario`
3. Faça upload do `.aab` gerado
4. Preencha a ficha do app (descrição, screenshots, política de privacidade)
5. Submeta para revisão

## Veja também

- `ARCHITECTURE.md` — guia completo de arquitetura e decisões técnicas
- `CHANGELOG.md` — histórico de versões
