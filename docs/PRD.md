# PRD — Sistema da Sabiencia

## 1. Visão Geral
- Objetivo: Plataforma EAD completa para gestão acadêmica da Sabiencia, cobrindo gestão de alunos, professores, turmas, conteúdos, avaliações, frequência, comunicados e finanças, com acesso diferenciado por perfil (gestor, professor, aluno).
- Público-alvo:
  - Gestor: administração institucional, visão gerencial, relatórios e finanças.
  - Professor: gestão pedagógica de turmas, materiais, notas e frequência.
  - Aluno: acesso a conteúdos, atividades, comunicados e acompanhamento acadêmico.
- Plataforma: Web SPA em React + Vite, backend de dados no Supabase (Auth, Postgres, Storage), com fallback local para modo demonstração.

## 2. Objetivos do Produto
- Centralizar operações acadêmicas em um único sistema.
- Reduzir atritos no acesso a aulas e materiais, priorizando UX simples e responsiva.
- Padronizar fluxo de autenticação e autorização por papéis com segurança e rastreabilidade.
- Suportar operação com e sem internet do backend (modo demo) para testes e demonstrações.

## 3. Escopo
- Incluso:
  - Autenticação por e‑mail e CPF, com sessões persistentes e expiração.
  - Dashboards por papel: gestor, professor e aluno.
  - Gestão de turmas, disciplinas, materiais didáticos e atividades.
  - Lançamento de notas, controle de frequência, comunicados e notificações.
  - Busca global com filtros.
  - Relatórios operacionais (acadêmico e financeiro).
- Fora do escopo inicial:
  - Métodos de pagamento e emissão de boletos/recibos.
  - Aulas ao vivo com streaming próprio (pode usar integração externa).
  - App mobile nativo.

## 4. Perfis e Permissões
- Papéis: `gestor`, `professor`, `aluno`.
- Regras de acesso:
  - Gestor: acesso a todos os módulos, inclusive relatórios e finanças.
  - Professor: acesso às turmas atribuídas, materiais, notas e frequência.
  - Aluno: acesso aos materiais, atividades, notas, frequência e comunicados de suas turmas.
- Redirecionamento padrão (RBAC):
  - Gestor → `/gestor/dashboard`
  - Professor → `/professor/dashboard`
  - Aluno → `/aluno/dashboard`

## 5. Narrativas de Usuário
- Como aluno, quero fazer login com CPF ou e‑mail para acessar minhas aulas e atividades, recebendo feedback claro quando as credenciais estiverem incorretas.
- Como professor, quero cadastrar e organizar materiais por disciplina e turma, registrar frequência e lançar notas com facilidade.
- Como gestor, quero uma visão consolidada do desempenho acadêmico e dos indicadores operacionais para tomada de decisão.

## 6. Requisitos Funcionais
- Autenticação e Sessão
  - RF‑A1: Permitir login por e‑mail e por CPF, validando senha.
  - RF‑A2: Persistir sessão por 8 horas, com auto‑logout ao expirar e atualização de token.
  - RF‑A3: Fallback de login em modo demonstração quando o Supabase estiver indisponível.
- Navegação e RBAC
  - RF‑N1: Proteger rotas por papel de usuário.
  - RF‑N2: Redirecionar automaticamente após login para o dashboard do papel.
- Gestão Acadêmica
  - RF‑G1: CRUD de cursos, turmas, disciplinas.
  - RF‑G2: Upload e gestão de materiais didáticos (PDF, vídeo, links).
  - RF‑G3: Registro de frequência por aula e turma.
  - RF‑G4: Lançamento e visualização de notas por disciplina.
  - RF‑G5: Publicação de comunicados segmentados (todos, por turma, por perfil).
- Busca e Relatórios
  - RF‑B1: Busca global por alunos, professores, turmas, disciplinas, materiais, comunicados e pagamentos.
  - RF‑R1: Relatórios de frequência, notas e atividades recentes.

## 7. Requisitos Não Funcionais
- RNF‑S1: Segurança de sessão com assinatura de integridade e expiração.
- RNF‑P1: Desempenho estável com carregamento assíncrono de dados (queries paginadas).
- RNF‑U1: UI responsiva (desktop e mobile), acessível e consistente.
- RNF‑L1: Observabilidade mínima via logs controlados em ambiente de desenvolvimento.

## 8. Modelo de Dados (alto nível)
- Entidades principais:
  - Usuário (aluno/professor/gestor): `id`, `cpf`, `email`, `nome_completo`, `role`, `telefone`, `foto_url`, `ativo`, `created_at`.
  - Curso: `id`, `nome`, `descricao`, `carga_horaria`, `duracao_meses`, `ativo`, `created_at`.
  - Disciplina: `id`, `curso_id`, `nome`, `descricao`, `carga_horaria`, `ordem`, `ementa`, `created_at`.
  - Turma: `id`, `curso_id`, `nome`, `data_inicio`, `data_fim`, `periodo`, `ativa`, `created_at`.
  - Matricula: `id`, `aluno_id`, `turma_id`, `status`, `data_matricula`, `created_at`.
  - Material Didático: `id`, `disciplina_id`, `titulo`, `descricao`, `tipo`, `url`, `tags`, `created_at`.
  - Frequência: `id`, `turma_id`, `aluno_id`, `aula_id`, `status`, `data`.
  - Nota: `id`, `aluno_id`, `disciplina_id`, `valor`, `avaliacao_id`.
  - Comunicado: `id`, `titulo`, `conteudo`, `prioridade`, `escopo`, `created_at`.

## 9. Integrações
- Supabase
  - Auth: `signInWithPassword`, `signOut`, `onAuthStateChange`.
  - PostgREST: consultas às tabelas `usuarios`, `alunos`, `professores`, `gestores`, `turmas`, `disciplinas`, etc.
  - Storage: upload de materiais (futuro).
- Variáveis de ambiente:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Fallback Demo:
  - Autorização local baseada em lista de usuários de demonstração para testes sem backend.

## 10. Fluxos Principais
- Login
  - Passos: identificar se entrada é e‑mail ou CPF → no caso de CPF, buscar e‑mail correspondente → autenticar pelo Supabase → carregar perfil do usuário → salvar sessão com expiração e assinatura.
  - Fallback: caso a consulta ou autenticação falhe, validar pelas credenciais de demonstração e criar sessão local.
- Logout
  - Passos: `signOut` no Supabase → limpar estado local e storage.
- Navegação Protegida
  - Verificar papel atual → checar permissão da rota → redirecionar ou negar acesso.

## 11. Casos de Borda
- CPF formatado vs. salvo apenas dígitos → sanitizar antes de consultar.
- Supabase indisponível → habilitar login demo sem interromper fluxo.
- Sessão adulterada no storage → invalidar pelo mecanismo de assinatura e forçar novo login.

## 12. Métricas e Telemetria
- Taxa de sucesso de login por perfil.
- Acesso a módulos por papel.
- Engajamento com materiais e atividades.

## 13. Segurança e Conformidade
- Sanitização de entradas, sem logar dados sensíveis.
- Assinatura de sessão no cliente e expiração forçada.
- Políticas RLS no Supabase para leituras e atualizações de perfil.
- Não expor chaves secretas no cliente; usar somente chave `anon` pública.

## 14. Roadmap e Marcos
- M1: Login RBAC com fallback demo e dashboards básicos.
- M2: Materiais didáticos, frequência e notas.
- M3: Comunicados, notificações e busca global.
- M4: Relatórios, exportações e integrações de storage.

## 15. Riscos
- Dependência de conectividade com Supabase para produção.
- Manutenção da consistência entre perfil e permissões.
- Crescimento do volume de dados impactando desempenho em listas.

## 16. Questões em Aberto
- Políticas detalhadas de RLS por tabela (CRUD granular por papel).
- Estratégia de armazenamento de vídeos (link externo vs. storage próprio).
- Padrões de auditoria e trilha de ações por papel.

## 17. Critérios de Aceite
- Usuário de demonstração consegue login por CPF e por e‑mail, acessando o dashboard correto.
- Rotas protegidas negam acesso a perfis não autorizados.
- Sessão expira e força logout após o período definido.
- Material, frequência e notas operam com fluxo mínimo funcional por turma.

---

### Apêndice — Referências do Código
- Autenticação e sessão: `src/src/contexts/AuthContext.tsx:215–336`
- RBAC e rotas protegidas: `src/src/components/auth/ProtectedRoute.tsx:1–67`
- Papéis e tipos principais: `src/src/types/index.ts:1–131`
- Cliente Supabase: `src/lib/supabase.ts:1–39`
- Busca global: `src/src/utils/searchService.ts:1–66`
