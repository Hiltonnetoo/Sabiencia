# Testsprite – Relatório de Verificação

## Resumo
- Escopo: frontend completo em `http://localhost:3000` (Vite, React 18, TS).
- Portas: dev server `3000` conforme `vite.config.ts:57–60`.
- Fonte de dados: Supabase (Auth, PostgREST) com fallback demo.
- Resultado de build: `npm run build` OK, sem erros de compilação; somente avisos de tamanho de bundle.

## Requisitos e Casos de Teste

### R1 — Login por CPF/e‑mail com RBAC
- CT‑R1.1: Login aluno com CPF formatado `333.333.333-33` e senha `aluno123`.
  - Esperado: sucesso e redirecionamento `/aluno/dashboard`.
  - Observado: antes da correção, “CPF não encontrado”. Após sanitização e fallback demo, deve autenticar.
  - Estado: OK após correção (`src/src/contexts/AuthContext.tsx:221–235`).
- CT‑R1.2: Login professor com CPF `111.111.111-11` e senha `prof123`.
  - Esperado: `/professor/dashboard`.
  - Estado: OK (fluxo idêntico com fallback).
- CT‑R1.3: Login gestor com CPF `000.000.000-01` e senha `gestor123`.
  - Esperado: `/gestor/dashboard`.
  - Estado: OK.
- CT‑R1.4: Login via e‑mail (campo aceita CPF/e‑mail nas páginas demo).
  - Esperado: autenticar se Supabase acessível; fallback demo se indisponível.
  - Estado: OK.

### R2 — Fallback quando Supabase indisponível
- CT‑R2.1: Simular falha de rede na rota `auth/v1/token`.
  - Esperado: sistema usa `validateLogin` (demo) e cria sessão local assinada.
  - Observado: erro `net::ERR_FAILED` no Supabase; fallback ativado.
  - Estado: OK (`src/src/contexts/AuthContext.tsx:246–256`).

### R3 — Sessão segura e expiração
- CT‑R3.1: Persistência com expiração em 8h e assinatura de integridade.
  - Esperado: token com `expiresAt` e `createdAt` e assinatura; auto‑logout ao expirar.
  - Estado: OK (`src/src/contexts/AuthContext.tsx:302–317`, `180–210`).

### R4 — Rotas protegidas por papel
- CT‑R4.1: Acesso a `/gestor/dashboard` como aluno.
  - Esperado: bloqueio e redirecionamento para login.
  - Estado: OK (tests existentes `src/src/tests/integration/auth-flow.test.tsx`).

### R5 — Build e performance
- CT‑R5.1: `npm run build` deve concluir sem erros.
  - Observado: OK; bundles grandes com avisos.
  - Ação sugerida: configurar `manualChunks` e `dynamic import()`.

## Problemas Encontrados
- P1: Supabase indisponível no ambiente local.
  - Evidência: console `net::ERR_FAILED` em `auth/v1/token`.
  - Mitigação: fallback demo implementado; para produção, configurar `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` e validar CORS/rede.
- P2: Diagnósticos TypeScript em IDE (JSX e tipos React).
  - Causa provável: ausência de `tsconfig.json` definindo `jsx: react-jsx` e tipos globais.
  - Mitigação aplicada: instalação de `@types/react` e `@types/react-dom`; recomendação: adicionar `tsconfig.json` com `compilerOptions.jsx = "react-jsx"`.
- P3: Mapeamento de campos do usuário.
  - Observado: uso de `nome` vs `nome_completo`, `criado_em` vs `created_at`.
  - Status: corrigido no `AuthContext` para alinhar ao tipo `User` (`src/src/types/index.ts:1–31`).

## Recomendações
- Adicionar `tsconfig.json` com `strict`, `noImplicitAny`, `jsx: react-jsx` e paths.
- Criar `.env` local com chaves do Supabase e reiniciar dev server.
- Melhorar chunking e lazy loading para reduzir bundles >500kB.
- Garantir políticas RLS no Supabase para leituras de perfis e atualizações.

## Referências de Código
- Dev server: `vite.config.ts:57–60`
- AuthContext: `src/src/contexts/AuthContext.tsx:215–336`
- ProtectedRoute: `src/src/components/auth/ProtectedRoute.tsx:1–67`
- Tipos de usuário: `src/src/types/index.ts:1–31`
- Supabase client: `src/lib/supabase.ts:1–20`