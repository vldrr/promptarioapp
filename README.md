# PromptÁrio App v1.1

Banco de prompts offline para Android (e web). Busca com debounce e sem sensibilidade a acentos, filtros por categoria e por múltiplas ferramentas, ordenação, favoritos, histórico de uso, tema claro/escuro, compartilhamento e cópia com um toque.

## Rodando em desenvolvimento

Pré-requisito: Node.js LTS.

```bash
npm install
npx expo start
```

- Pressione **w** → abre no navegador do PC (jeito mais rápido de visualizar)
- Ou escaneie o QR com o **Expo Go** no Android (use `npx expo start --tunnel` se a rede bloquear)

> Primeira vez com TypeScript: o Expo detecta o `tsconfig.json` e instala o que faltar automaticamente.

## Scripts

```bash
npm test            # testes unitários (lógica de filtro e validação)
npm run typecheck   # verificação de tipos TypeScript
npm run lint        # ESLint
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

Regras aplicadas automaticamente na inicialização (`src/utils/validation.ts`): entradas com campos faltando/vazios são ignoradas, ids duplicados são descartados (fica o primeiro), e caracteres de controle são removidos. Categorias e ferramentas novas viram filtros sozinhas.

## Gerar APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview   # .apk para instalar direto
eas build -p android --profile production  # .aab para a Play Store
```

## Estrutura

Veja `ARCHITECTURE.md` para o guia completo de arquitetura e `CHANGELOG.md` para o histórico de versões.
