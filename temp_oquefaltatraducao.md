# Lista de Tarefas para Paridade Total de Tradução (EN/PT)

Este arquivo contém a lista de componentes do sistema que ainda precisam ser traduzidos para garantir a paridade total entre o inglês (EN) e o português (PT). Os componentes estão agrupados por áreas funcionais.

---

## ⏳ Componentes Restantes por Área

### 1. Alunos e Professores ✅
- [x] `src/components/alunos/AlunosTable.tsx`
- [x] `src/components/professores/ProfessorForm.tsx`
- [x] `src/components/professores/ProfessoresTable.tsx`

### 2. Biblioteca de Materiais e Vídeos ✅
- [x] `src/components/biblioteca/YouTubePlayer.tsx`
- [x] `src/components/biblioteca/MaterialUploadForm.tsx`
- [x] `src/components/biblioteca/MaterialViewDialog.tsx`
- [x] `src/components/biblioteca/MaterialCard.tsx`

### 3. Videoaulas e Lives ✅
- [x] `src/components/videoaulas/VideoaulasDialog.tsx`
- [x] `src/components/videoaulas/NotasAula.tsx`
- [x] `src/components/videoaulas/ProgressTracker.tsx`
- [x] `src/components/videoaulas/QuizAula.tsx`
- [x] `src/components/videoaulas/EstatisticasVideoaulas.tsx`
- [x] `src/components/lives/ChatAoVivo.tsx`
- [x] `src/components/lives/LiveCard.tsx`

### 4. Relatórios e Gráficos ✅
- [x] `src/components/relatorios/TabelaRelatorio.tsx`
- [x] `src/components/relatorios/RelatorioFilters.tsx`
- [x] `src/components/relatorios/RelatorioCard.tsx`
- [x] `src/components/relatorios/GraficoDesempenho.tsx`

### 5. Financeiro, Notas e Frequência ✅
- [x] `src/components/financeiro/FinanceiroChart.tsx`
- [x] `src/components/financeiro/FinanceiroStats.tsx`
- [x] `src/components/frequencia/ListaPresencaForm.tsx`
- [x] `src/components/notas/LancamentoNotasForm.tsx`
- [x] `src/components/notas/BoletimCard.tsx`

### 6. Perfil e Configurações de Usuário ✅
- [x] `src/components/perfil/PerfilHeader.tsx`
- [x] `src/components/perfil/AtividadesRecentes.tsx`

### 7. Exportação e Ferramentas do Sistema ✅
- [x] `src/components/export/ExportDialog.tsx`
- [x] `src/components/export/ImportDialog.tsx`
- [x] `src/components/export/BackupManager.tsx`
- [x] `src/components/search/GlobalSearch.tsx`

### 8. Notificações ✅
- [x] `src/components/notifications/NotificationCenter.tsx`
- [x] `src/components/notifications/NotificationPreferences.tsx`

### 9. Componentes Shared (Configurações, Filtros e Inputs) ✅
- [x] `src/components/shared/AparenciaSettings.tsx`
- [x] `src/components/shared/SistemaSettings.tsx`
- [x] `src/components/shared/PrivacidadeSettings.tsx`
- [x] `src/components/shared/AuditLogViewer.tsx`
- [x] `src/components/shared/DatePicker.tsx`
- [x] `src/components/shared/TablePagination.tsx`
- [x] `src/components/shared/LoadingButton.tsx`
- [x] `src/components/shared/FormField.tsx`
- [x] `src/components/shared/PhoneInput.tsx`
- [x] `src/components/shared/SearchBar.tsx`
- [x] `src/components/shared/CPFInput.tsx`
- [x] `src/components/shared/ErrorDisplay.tsx`
- [x] `src/components/shared/InputWithValidation.tsx`
- [x] `src/components/shared/PageBreadcrumb.tsx`
- [x] `src/components/shared/PasswordStrengthIndicator.tsx`
- [x] `src/components/shared/PaginationControls.tsx`
- [x] `src/components/shared/AdvancedFilterPanel.tsx`
- [x] `src/components/shared/MultiSelect.tsx`
- [x] `src/components/shared/CEPInput.tsx`

---

## 🔍 Como Executar a Tradução de Cada Componente
1. **Importar o hook**: `import { useTranslation } from 'react-i18next';`
2. **Instanciar o hook**: `const { t } = useTranslation();`
3. **Mapear as chaves**: Substituir textos em português pelas chaves correspondentes. A maioria das chaves já foi criada pelo agente anterior nos arquivos `src/i18n/locales/en/components-c1.json` a `components-c8.json` (e seus respectivos em `pt/`).
4. **Verificar Compilação e Testes**:
   * Rodar `npm run type-check` para garantir que não há erros de tipagem.
   * Rodar `npm run test` para certificar que os testes unitários continuam passando.
