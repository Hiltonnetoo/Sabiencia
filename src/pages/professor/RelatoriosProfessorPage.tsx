// ============================================
// RELATÓRIOS PROFESSOR PAGE
// ============================================

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, TrendingUp, Users, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { RelatorioFilters } from '../../components/relatorios/RelatorioFilters';
import { GraficoDesempenho } from '../../components/relatorios/GraficoDesempenho';
import { TabelaRelatorio } from '../../components/relatorios/TabelaRelatorio';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { RelatorioFiltros } from '../../schemas/relatorioSchemas';
import { calcularMediaNotas, calcularPercentualFrequencia } from '../../utils/calculations';

export const RelatoriosProfessorPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    alunos,
    turmas,
    disciplinas,
    matriculas,
    notas,
    frequencias,
    observacoes,
    professorTurmaDisciplina,
  } = useMockData();

  const [filters, setFilters] = useState<Partial<RelatorioFiltros>>({
    periodo: 'semestral',
  });

  const [activeTab, setActiveTab] = useState('minhas-turmas');

  // ============================================
  // DADOS DO PROFESSOR
  // ============================================

  // Turmas do professor
  const minhasTurmas = useMemo(() => {
    if (!user) return [];
    
    const turmasIds = professorTurmaDisciplina
      .filter(ptd => ptd.professor_id === user.id)
      .map(ptd => ptd.turma_id);
    
    return turmas.filter(t => turmasIds.includes(t.id));
  }, [user, turmas, professorTurmaDisciplina]);

  // Disciplinas do professor
  const minhasDisciplinas = useMemo(() => {
    if (!user) return [];
    
    const disciplinasIds = professorTurmaDisciplina
      .filter(ptd => ptd.professor_id === user.id)
      .map(ptd => ptd.disciplina_id);
    
    return disciplinas.filter(d => disciplinasIds.includes(d.id));
  }, [user, disciplinas, professorTurmaDisciplina]);

  // Alunos das turmas do professor
  const meusAlunos = useMemo(() => {
    const turmasIds = minhasTurmas.map(t => t.id);
    const alunosIds = matriculas
      .filter(m => turmasIds.includes(m.turma_id) && m.status === 'ativo')
      .map(m => m.aluno_id);
    
    return alunos.filter(a => alunosIds.includes(a.id));
  }, [minhasTurmas, matriculas, alunos]);

  // ============================================
  // MÉTRICAS GERAIS
  // ============================================

  const metricas = useMemo(() => {
    const totalAlunos = meusAlunos.length;
    const totalTurmas = minhasTurmas.length;
    const totalDisciplinas = minhasDisciplinas.length;

    // Média geral dos alunos
    const alunosIds = meusAlunos.map(a => a.id);
    const notasAlunos = notas.filter(n => alunosIds.includes(n.aluno_id));
    
    let mediaGeral = 0;
    if (notasAlunos.length > 0) {
      const soma = notasAlunos.reduce((sum, n) => {
        const media = calcularMediaNotas(n.av1, n.av2, n.av3);
        return sum + (isNaN(media) ? 0 : media);
      }, 0);
      mediaGeral = soma / notasAlunos.length;
    }
    mediaGeral = isNaN(mediaGeral) || !isFinite(mediaGeral) ? 0 : mediaGeral;

    // Frequência média
    const frequenciasAlunos = frequencias.filter(f => alunosIds.includes(f.aluno_id));
    let frequenciaMedia = 0;
    if (frequenciasAlunos.length > 0) {
      const soma = frequenciasAlunos.reduce((sum, f) => {
        const freq = calcularPercentualFrequencia(f.presencas, f.total_aulas);
        return sum + (isNaN(freq) ? 0 : freq);
      }, 0);
      frequenciaMedia = soma / frequenciasAlunos.length;
    }
    frequenciaMedia = isNaN(frequenciaMedia) || !isFinite(frequenciaMedia) ? 0 : frequenciaMedia;

    // Total de observações
    const totalObservacoes = observacoes.filter(o => 
      o.professor_id === user?.id
    ).length;

    return {
      totalAlunos,
      totalTurmas,
      totalDisciplinas,
      mediaGeral,
      frequenciaMedia,
      totalObservacoes,
    };
  }, [meusAlunos, minhasTurmas, minhasDisciplinas, notas, frequencias, observacoes, user]);

  // ============================================
  // GRÁFICOS
  // ============================================

  const dadosDesempenhoPorTurma = useMemo(() => {
    return minhasTurmas.map(turma => {
      const alunosDaTurma = matriculas
        .filter(m => m.turma_id === turma.id && m.status === 'ativo')
        .map(m => m.aluno_id);

      const notasDaTurma = notas.filter(n => alunosDaTurma.includes(n.aluno_id));
      
      let mediaTurma = 0;
      if (notasDaTurma.length > 0) {
        const soma = notasDaTurma.reduce((sum, n) => {
          const media = calcularMediaNotas(n.av1, n.av2, n.av3);
          return sum + (isNaN(media) ? 0 : media);
        }, 0);
        mediaTurma = soma / notasDaTurma.length;
      }

      return {
        name: turma.nome,
        media: isNaN(mediaTurma) || !isFinite(mediaTurma) ? 0 : Number(mediaTurma.toFixed(2)),
      };
    }).filter(item => item.media >= 0);
  }, [minhasTurmas, matriculas, notas]);

  const dadosDesempenhoPorDisciplina = useMemo(() => {
    return minhasDisciplinas.map(disciplina => {
      const notasDisciplina = notas.filter(n => n.disciplina_id === disciplina.id);
      
      let mediaDisciplina = 0;
      if (notasDisciplina.length > 0) {
        const soma = notasDisciplina.reduce((sum, n) => {
          const media = calcularMediaNotas(n.av1, n.av2, n.av3);
          return sum + (isNaN(media) ? 0 : media);
        }, 0);
        mediaDisciplina = soma / notasDisciplina.length;
      }

      return {
        name: disciplina.nome,
        media: isNaN(mediaDisciplina) || !isFinite(mediaDisciplina) ? 0 : Number(mediaDisciplina.toFixed(2)),
      };
    }).filter(item => item.media >= 0);
  }, [minhasDisciplinas, notas]);

  const dadosFrequenciaPorTurma = useMemo(() => {
    return minhasTurmas.map(turma => {
      const alunosDaTurma = matriculas
        .filter(m => m.turma_id === turma.id && m.status === 'ativo')
        .map(m => m.aluno_id);

      const frequenciasDaTurma = frequencias.filter(f => 
        alunosDaTurma.includes(f.aluno_id)
      );
      
      let frequenciaMedia = 0;
      if (frequenciasDaTurma.length > 0) {
        const soma = frequenciasDaTurma.reduce((sum, f) => {
          const freq = calcularPercentualFrequencia(f.presencas, f.total_aulas);
          return sum + (isNaN(freq) ? 0 : freq);
        }, 0);
        frequenciaMedia = soma / frequenciasDaTurma.length;
      }

      return {
        name: turma.nome,
        value: isNaN(frequenciaMedia) || !isFinite(frequenciaMedia) ? 0 : Number(frequenciaMedia.toFixed(1)),
      };
    }).filter(item => item.value >= 0);
  }, [minhasTurmas, matriculas, frequencias]);

  // ============================================
  // TABELAS
  // ============================================

  const dadosTabelaAlunos = useMemo(() => {
    return meusAlunos.map(aluno => {
      const notasAluno = notas.filter(n => n.aluno_id === aluno.id);
      let media = 0;
      if (notasAluno.length > 0) {
        const soma = notasAluno.reduce((sum, n) => {
          const m = calcularMediaNotas(n.av1, n.av2, n.av3);
          return sum + (isNaN(m) ? 0 : m);
        }, 0);
        media = soma / notasAluno.length;
      }
      media = isNaN(media) || !isFinite(media) ? 0 : media;

      const frequenciasAluno = frequencias.filter(f => f.aluno_id === aluno.id);
      let frequenciaMedia = 0;
      if (frequenciasAluno.length > 0) {
        const soma = frequenciasAluno.reduce((sum, f) => {
          const freq = calcularPercentualFrequencia(f.presencas, f.total_aulas);
          return sum + (isNaN(freq) ? 0 : freq);
        }, 0);
        frequenciaMedia = soma / frequenciasAluno.length;
      }
      frequenciaMedia = isNaN(frequenciaMedia) || !isFinite(frequenciaMedia) ? 0 : frequenciaMedia;

      const matricula = matriculas.find(m => m.aluno_id === aluno.id);
      const turma = matricula ? turmas.find(t => t.id === matricula.turma_id) : undefined;

      const observacoesAluno = observacoes.filter(o => 
        o.aluno_id === aluno.id && o.professor_id === user?.id
      ).length;

      return {
        nome: aluno.nome_completo,
        turma: turma?.nome || '-',
        media: media.toFixed(2),
        frequencia: frequenciaMedia.toFixed(1),
        observacoes: observacoesAluno,
      };
    });
  }, [meusAlunos, notas, frequencias, matriculas, turmas, observacoes, user]);

  const dadosTabelaDisciplinas = useMemo(() => {
    return minhasDisciplinas.map(disciplina => {
      const notasDisciplina = notas.filter(n => n.disciplina_id === disciplina.id);
      
      let media = 0;
      if (notasDisciplina.length > 0) {
        const soma = notasDisciplina.reduce((sum, n) => {
          const m = calcularMediaNotas(n.av1, n.av2, n.av3);
          return sum + (isNaN(m) ? 0 : m);
        }, 0);
        media = soma / notasDisciplina.length;
      }
      media = isNaN(media) || !isFinite(media) ? 0 : media;

      const aprovados = notasDisciplina.filter(n => {
        const mediaAluno = calcularMediaNotas(n.av1, n.av2, n.av3);
        return !isNaN(mediaAluno) && isFinite(mediaAluno) && mediaAluno >= 7;
      }).length;

      const totalAlunos = notasDisciplina.length;
      let taxaAprovacao = 0;
      if (totalAlunos > 0) {
        taxaAprovacao = (aprovados / totalAlunos) * 100;
      }
      taxaAprovacao = isNaN(taxaAprovacao) || !isFinite(taxaAprovacao) ? 0 : taxaAprovacao;

      return {
        disciplina: disciplina.nome,
        alunos: totalAlunos,
        media: media.toFixed(2),
        aprovados,
        taxaAprovacao: taxaAprovacao.toFixed(1),
      };
    });
  }, [minhasDisciplinas, notas]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleExportarRelatorio = () => {
    toast.success(t('professor.relatorios.exportToast'));
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('professor.relatorios.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('professor.relatorios.subtitle')}
          </p>
        </div>
        <Button onClick={handleExportarRelatorio}>
          <Download className="w-4 h-4 mr-2" />
          {t('common.actions.export')}
        </Button>
      </div>

      {/* Filtros */}
      <RelatorioFilters
        filters={filters}
        onFiltersChange={setFilters}
        turmas={minhasTurmas}
        disciplinas={minhasDisciplinas}
        alunos={meusAlunos}
        showTipoFilter={false}
        showCursoFilter={false}
        showProfessorFilter={false}
      />

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('professor.relatorios.metrics.myStudents')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metricas.totalAlunos}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('professor.relatorios.metrics.overallAverage')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metricas.mediaGeral.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('professor.relatorios.metrics.averageAttendance')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metricas.frequenciaMedia.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('professor.relatorios.metrics.observations')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metricas.totalObservacoes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="minhas-turmas">{t('professor.relatorios.tabs.myClasses')}</TabsTrigger>
          <TabsTrigger value="disciplinas">{t('professor.relatorios.tabs.subjects')}</TabsTrigger>
          <TabsTrigger value="alunos">{t('professor.relatorios.tabs.students')}</TabsTrigger>
          <TabsTrigger value="frequencia">{t('professor.relatorios.tabs.attendance')}</TabsTrigger>
        </TabsList>

        {/* TAB: MINHAS TURMAS */}
        <TabsContent value="minhas-turmas" className="space-y-6">
          <GraficoDesempenho
            tipo="bar"
            dados={dadosDesempenhoPorTurma}
            titulo={t('professor.relatorios.charts.averageGradeByClass')}
            dataKey="media"
            xAxisKey="name"
          />

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">{t('professor.relatorios.classesSummaryTitle')}</h3>
            <div className="space-y-3">
              {minhasTurmas.map(turma => {
                const alunosDaTurma = matriculas.filter(m => 
                  m.turma_id === turma.id && m.status === 'ativo'
                ).length;

                return (
                  <div key={turma.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">{turma.nome}</p>
                      <p className="text-sm text-gray-600">
                        {t('professor.relatorios.studentsCount', { count: alunosDaTurma })} • {turma.turno}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      {t('common.actions.viewDetails')}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* TAB: DISCIPLINAS */}
        <TabsContent value="disciplinas" className="space-y-6">
          <GraficoDesempenho
            tipo="bar"
            dados={dadosDesempenhoPorDisciplina}
            titulo={t('professor.relatorios.charts.averageBySubject')}
            dataKey="media"
            xAxisKey="name"
          />

          <TabelaRelatorio
            titulo={t('professor.relatorios.subjectsTable.title')}
            colunas={[
              { key: 'disciplina', label: t('professor.relatorios.subjectsTable.subject') },
              { key: 'alunos', label: t('professor.relatorios.subjectsTable.students'), tipo: 'number' },
              { key: 'media', label: t('professor.relatorios.subjectsTable.average'), tipo: 'number' },
              { key: 'aprovados', label: t('professor.relatorios.subjectsTable.approved'), tipo: 'number' },
              { key: 'taxaAprovacao', label: t('professor.relatorios.subjectsTable.approvalRate'), tipo: 'percentage' },
            ]}
            dados={dadosTabelaDisciplinas}
          />
        </TabsContent>

        {/* TAB: ALUNOS */}
        <TabsContent value="alunos" className="space-y-6">
          <TabelaRelatorio
            titulo={t('professor.relatorios.studentsTable.title')}
            colunas={[
              { key: 'nome', label: t('professor.relatorios.studentsTable.name') },
              { key: 'turma', label: t('professor.relatorios.studentsTable.class') },
              { key: 'media', label: t('professor.relatorios.studentsTable.average'), tipo: 'number' },
              { key: 'frequencia', label: t('professor.relatorios.studentsTable.attendance'), tipo: 'percentage' },
              { key: 'observacoes', label: t('professor.relatorios.studentsTable.observations'), tipo: 'number' },
            ]}
            dados={dadosTabelaAlunos}
          />
        </TabsContent>

        {/* TAB: FREQUÊNCIA */}
        <TabsContent value="frequencia" className="space-y-6">
          <GraficoDesempenho
            tipo="bar"
            dados={dadosFrequenciaPorTurma}
            titulo={t('professor.relatorios.charts.averageAttendanceByClass')}
            dataKey="value"
            xAxisKey="name"
          />

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">{t('professor.relatorios.attendanceSummaryTitle')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{t('professor.relatorios.overallAverageAttendance')}</span>
                <span className="text-gray-900">{metricas.frequenciaMedia.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosProfessorPage;
