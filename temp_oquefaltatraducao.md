# Lista de Tarefas para Paridade Total de Tradução (EN/PT)

Este arquivo contém a lista de componentes do sistema que ainda precisam ser traduzidos para garantir a paridade total entre o inglês (EN) e o português (PT). Os componentes estão agrupados por áreas funcionais.

---

## ⏳ Componentes Restantes por Área

### 1. Alunos e Professores
- [x] `src/components/alunos/AlunosTable.tsx`
- [x] `src/components/professores/ProfessorForm.tsx`
- [x] `src/components/professores/ProfessoresTable.tsx`

### 2. Biblioteca de Materiais e Vídeos
- [ ] `src/components/biblioteca/YouTubePlayer.tsx`
- [ ] `src/components/biblioteca/MaterialUploadForm.tsx`
- [ ] `src/components/biblioteca/MaterialViewDialog.tsx`
- [ ] `src/components/biblioteca/MaterialCard.tsx`

### 3. Videoaulas e Lives
- [ ] `src/components/videoaulas/VideoaulasDialog.tsx`
- [ ] `src/components/videoaulas/NotasAula.tsx`
- [ ] `src/components/videoaulas/ProgressTracker.tsx`
- [ ] `src/components/videoaulas/QuizAula.tsx`
- [ ] `src/components/videoaulas/EstatisticasVideoaulas.tsx`
- [ ] `src/components/lives/ChatAoVivo.tsx`
- [ ] `src/components/lives/LiveCard.tsx`

### 4. Relatórios e Gráficos
- [ ] `src/components/relatorios/TabelaRelatorio.tsx`
- [ ] `src/components/relatorios/RelatorioFilters.tsx`
- [ ] `src/components/relatorios/RelatorioCard.tsx`
- [ ] `src/components/relatorios/GraficoDesempenho.tsx`

### 5. Financeiro, Notas e Frequência
- [ ] `src/components/financeiro/FinanceiroChart.tsx`
- [ ] `src/components/financeiro/FinanceiroStats.tsx`
- [ ] `src/components/frequencia/ListaPresencaForm.tsx`
- [ ] `src/components/notas/LancamentoNotasForm.tsx`
- [ ] `src/components/notas/BoletimCard.tsx`

### 6. Perfil e Configurações de Usuário
- [ ] `src/components/perfil/PerfilHeader.tsx`
- [ ] `src/components/perfil/AtividadesRecentes.tsx`

### 7. Exportação e Ferramentas do Sistema
- [ ] `src/components/export/ExportDialog.tsx`
- [ ] `src/components/export/ImportDialog.tsx`
- [ ] `src/components/export/BackupManager.tsx`
- [ ] `src/components/search/GlobalSearch.tsx`

### 8. Notificações
- [ ] `src/components/notifications/NotificationCenter.tsx`
- [ ] `src/components/notifications/NotificationPreferences.tsx`

### 9. Componentes Shared (Configurações, Filtros e Inputs)
- [ ] `src/components/shared/AparenciaSettings.tsx`
- [ ] `src/components/shared/SistemaSettings.tsx`
- [ ] `src/components/shared/PrivacidadeSettings.tsx`
- [ ] `src/components/shared/AuditLogViewer.tsx`
- [ ] `src/components/shared/DatePicker.tsx`
- [ ] `src/components/shared/TablePagination.tsx`
- [ ] `src/components/shared/LoadingButton.tsx`
- [ ] `src/components/shared/FormField.tsx`
- [ ] `src/components/shared/PhoneInput.tsx`
- [ ] `src/components/shared/SearchBar.tsx`
- [ ] `src/components/shared/CPFInput.tsx`
- [ ] `src/components/shared/ErrorDisplay.tsx`
- [ ] `src/components/shared/InputWithValidation.tsx`
- [ ] `src/components/shared/PageBreadcrumb.tsx`
- [ ] `src/components/shared/PasswordStrengthIndicator.tsx`
- [ ] `src/components/shared/PaginationControls.tsx`
- [ ] `src/components/shared/AdvancedFilterPanel.tsx`
- [ ] `src/components/shared/MultiSelect.tsx`
- [ ] `src/components/shared/CEPInput.tsx`

---

## 🔍 Como Executar a Tradução de Cada Componente
1. **Importar o hook**: `import { useTranslation } from 'react-i18next';`
2. **Instanciar o hook**: `const { t } = useTranslation();`
3. **Mapear as chaves**: Substituir textos em português pelas chaves correspondentes. A maioria das chaves já foi criada pelo agente anterior nos arquivos `src/i18n/locales/en/components-c1.json` a `components-c8.json` (e seus respectivos em `pt/`).
4. **Verificar Compilação e Testes**:
   * Rodar `npm run type-check` para garantir que não há erros de tipagem.
   * Rodar `npm run test` para certificar que os testes unitários continuam passando.
