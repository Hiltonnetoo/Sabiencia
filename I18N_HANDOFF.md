# i18n EN/PT — Handoff (continuação)

Objetivo: **paridade total EN/PT**. Em EN → 100% inglês; em PT → 100% português. Interface **e** dados de exemplo. Nomes de pessoas permanecem iguais nos dois idiomas.

## Arquitetura (pronta — não mexer)
- `src/i18n/index.ts`: namespace único `translation`. Todos os JSON em `src/i18n/locales/en/*.json` e `pt/*.json` são auto-carregados e **deep-merged** no boot (via `import.meta.glob`).
- Helper `localizeData(key, fallback)` exportado de `src/i18n` para dados.
- Namespace `common.*` (status, ações, labels, mensagens, unidades, export) — **reusar**. Ver `src/i18n/locales/en/common.json`.
- Padrão: `import { useTranslation } from 'react-i18next'; const { t } = useTranslation();` → `t('namespace.chave')`. Plural com `count` + `_other`. Texto com tags: `<Trans>`.
- Referência: `src/pages/aluno/MinhasAulasPage.tsx`, `src/pages/aluno/FinanceiroAlunoPage.tsx`.

## ✅ CONCLUÍDO (tudo verde: `tsc` limpo, 478 testes passando)
- Fundação i18n + `common`.
- **TODAS as 48 páginas internas** (aluno, gestor, professor) — 100% com `t()`.
- 3 componentes shared: `DeleteConfirmDialog`, `EmptyState`, `UnsavedChangesDialog` (+ `components.json`).
- Camada de dados wired com fallback seguro para PT (`src/data/localizeMockData.ts` + contexts).

## ⏳ PENDENTE para "100% EN" real

### 1. Componentes reutilizáveis (~71) — ALTA prioridade
Renderizados dentro das páginas (cards, formulários, filtros, diálogos). Ainda têm PT hardcoded → aparecem em PT no modo EN. Usar namespace `components.<comp>.*` (arquivo `en/components.json` + `pt/components.json`, já existem). Listar com:
```
for f in $(find src/components -name "*.tsx" ! -name "*.test.tsx"); do grep -q "useTranslation\|i18nKey" "$f" || echo "$f"; done
```
Áreas: alunos/ (AlunoForm, AlunosTable, AlunosAdvancedFilters, AlunosPaginatedList), professores/ (ProfessorForm, ProfessoresTable), turmas/, cursos/, disciplinas/, biblioteca/ (MaterialFilters, MaterialUploadForm, MaterialViewDialog, YouTubePlayer), comunicados/ (ComunicadoCard, ComunicadoFilters, ComunicadoForm, ComunicadoViewDialog), financeiro/ (PagamentoCard, PagamentoFilters, PagamentoForm, FinanceiroChart), frequencia/, notas/ (BoletimCard, LancamentoNotasForm), observacoes/ (ObservacaoFilters, ObservacaoForm), perfil/ (PerfilForm, PasswordChangeForm, DadosAcademicosCard, AtividadesRecentes), relatorios/ (RelatorioFilters, RelatorioCard, GraficoDesempenho), videoaulas/ (VideoaulasDialog, QuizAula, NotasAula, ProgressTracker, EstatisticasVideoaulas), lives/ (ChatAoVivo), notifications/ (NotificationCenter, NotificationPreferences), export/ (ExportDialog, ImportDialog, BackupManager), search/ (GlobalSearch), shared/ (Inputs com máscara CPF/CEP/telefone, PrivacidadeSettings, SistemaSettings, PaginationControls, PasswordStrengthIndicator, AuditLogViewer, PageBreadcrumb, FormField, etc.), auth/LoginPage, landing/ (StudentDashboard, LessonDashboard, StudentPlatform).
- Deixe campos de DADOS de entidades como estão (titulo/nome/descricao vindos de objetos).
- Reusar `common.*` ao máximo.

### 2. Páginas demo (4) — sem chaves ainda
`demo/DemoAluno`, `demo/DemoGestor`, `demo/DemoProfessor`, `demo/ProfessorRegisterPage`. Criar `en/demo-pages.json` + `pt/demo-pages.json` (top-level `demoPages`). `ProfessorRegisterPage` tem formulário com validação.

### ✅ ATUALIZAÇÃO: `data.json` JÁ PREENCHIDO (EN/PT) — dados trocam de idioma. Os lotes de componentes (components-c1..c8.json) e demo-pages.json já existem com chaves, mas só PARTE dos componentes foi conectada (agentes pararam no limite, reset 5:30 Fortaleza). Rodar o passo 4 da Verificação para listar os .tsx que ainda faltam `useTranslation` (ignorar os sem texto visível: layouts, ProtectedRoute, ErrorBoundary, Loading*, ScreenReaderOnly, OptimizedImage, AppPreloader, etc.). Para cada um restante, conectar `t()` usando as chaves já criadas em components-c*.json (ou criar se faltar).

### 3. (Histórico) Dados de exemplo
`src/i18n/locales/en/data.json` e `pt/data.json` (top-level `data`) precisam ser **preenchidos**.
- Infra já wired com **fallback para PT** (hoje dados aparecem em PT nos dois idiomas, sem quebrar).
- Preencher `data.<entidade>.<id>.<campo>` (e `data.shared.<slug>`) com EN/PT — ler `src/data/localizeMockData.ts` para a estrutura exata. Traduzir: nomes de cursos/disciplinas/turmas/módulos, títulos/descrições de materiais, comunicados, observações, eventos, notificações, descrições de pagamentos. NÃO traduzir nomes de pessoas, e-mails, CPF, telefones, códigos.
- OBS: alguns dados estão inline em páginas (ex.: cupons e questionários mockados em `CuponsPage`/`QuestionariosPage`) — as descrições inline ficaram em PT (são dados); migrar se quiser parity total.

## Verificação final
1. `npx tsc --noEmit`
2. `npx vitest run --config src/vitest.config.ts`
3. JSON válido: `for f in src/i18n/locales/{en,pt}/*.json; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" || echo "INVÁLIDO: $f"; done`
4. Componentes restantes: `for f in $(find src/components -name "*.tsx" ! -name "*.test.tsx"); do grep -q "useTranslation\|i18nKey" "$f" || echo "$f"; done`
5. Preview: alternar EN/PT e confirmar 100% de cada idioma (incl. dados).
