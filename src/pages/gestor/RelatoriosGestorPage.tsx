// ============================================
// RELATÓRIOS GESTOR PAGE
// ============================================

import React, { useState, useMemo } from 'react';
import { FileText, Download, TrendingUp, Users, DollarSign, BookOpen, BarChart3, PieChart, Calendar, Award } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RelatorioFilters } from '../../components/relatorios/RelatorioFilters';
import { RelatorioCard } from '../../components/relatorios/RelatorioCard';
import { GraficoDesempenho } from '../../components/relatorios/GraficoDesempenho';
import { TabelaRelatorio } from '../../components/relatorios/TabelaRelatorio';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import type { RelatorioFiltros } from '../../schemas/relatorioSchemas';
import { calcularMediaNotas, calcularPercentualFrequencia } from '../../utils/calculations';

export const RelatoriosGestorPage: React.FC = () => {
  const {
    alunos,
    professores,
    cursos,
    turmas,
    disciplinas,
    matriculas,
    notas,
    frequencias,
    pagamentos,
    observacoes,
  } = useMockData();

  const [filters, setFilters] = useState<Partial<RelatorioFiltros>>({
    periodo: 'semestral',
  });

  const [activeTab, setActiveTab] = useState('geral');

  // ============================================
  // DADOS GERAIS
  // ============================================
  
  const dadosGerais = useMemo(() => {
    const totalAlunos = alunos.filter(a => a.ativo).length;
    const totalProfessores = professores.filter(p => p.ativo).length;
    const totalTurmas = turmas.filter(t => t.ativo).length;
    
    // Receita total e recebida
    const receitaTotal = pagamentos.reduce((sum, p) => sum + p.valor, 0);
    const receitaRecebida = pagamentos
      .filter(p => p.status === 'pago')
      .reduce((sum, p) => sum + p.valor, 0);
    
    // Taxa de inadimplência
    const taxaInadimplencia = receitaTotal > 0
      ? ((receitaTotal - receitaRecebida) / receitaTotal) * 100
      : 0;

    // Média geral de notas
    const todasNotas = notas.flatMap(n => 
      [n.av1, n.av2, n.av3]
        .filter(v => v !== null && v !== undefined && !isNaN(v as number)) as number[]
    );
    let mediaGeral = 0;
    if (todasNotas.length > 0) {
      const soma = todasNotas.reduce((sum, n) => sum + n, 0);
      mediaGeral = soma / todasNotas.length;
    }
    mediaGeral = isNaN(mediaGeral) || !isFinite(mediaGeral) ? 0 : mediaGeral;

    // Frequência média
    const todasFrequencias = frequencias
      .map(f => calcularPercentualFrequencia(f.presencas, f.total_aulas))
      .filter(f => !isNaN(f) && isFinite(f));
    
    let frequenciaMedia = 0;
    if (todasFrequencias.length > 0) {
      const soma = todasFrequencias.reduce((sum, f) => sum + f, 0);
      frequenciaMedia = soma / todasFrequencias.length;
    }
    frequenciaMedia = isNaN(frequenciaMedia) || !isFinite(frequenciaMedia) ? 0 : frequenciaMedia;

    return {
      totalAlunos,
      totalProfessores,
      totalTurmas,
      receitaTotal,
      receitaRecebida,
      taxaInadimplencia,
      mediaGeral,
      frequenciaMedia,
    };
  }, [alunos, professores, turmas, pagamentos, notas, frequencias]);

  // ============================================
  // GRÁFICOS
  // ============================================

  const dadosDesempenhoPorTurma = useMemo(() => {
    return turmas.map(turma => {
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
    }).filter(item => item.media >= 0); // Apenas turmas com média válida
  }, [turmas, matriculas, notas]);

  const dadosReceitaPorCurso = useMemo(() => {
    return cursos.map(curso => {
      const turmasDoCurso = turmas.filter(t => t.curso_id === curso.id);
      const turmasIds = turmasDoCurso.map(t => t.id);
      
      const alunosDoCurso = matriculas
        .filter(m => turmasIds.includes(m.turma_id))
        .map(m => m.aluno_id);

      const receitaCurso = pagamentos
        .filter(p => alunosDoCurso.includes(p.aluno_id) && p.status === 'pago')
        .reduce((sum, p) => {
          const valor = p.valor || 0;
          return sum + (isNaN(valor) ? 0 : valor);
        }, 0);

      return {
        name: curso.nome,
        value: isNaN(receitaCurso) || !isFinite(receitaCurso) ? 0 : Number(receitaCurso.toFixed(2)),
      };
    }).filter(item => item.value >= 0); // Apenas cursos com receita válida
  }, [cursos, turmas, matriculas, pagamentos]);

  const dadosFrequenciaMensal = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    return meses.map((mes, index) => {
      const frequenciasMes = frequencias.filter(f => {
        const dataAula = new Date(f.data_aula);
        return dataAula.getMonth() === index;
      });

      const totalAulas = frequenciasMes.reduce((sum, f) => {
        const aulas = f.total_aulas || 0;
        return sum + (isNaN(aulas) ? 0 : aulas);
      }, 0);
      
      const totalPresencas = frequenciasMes.reduce((sum, f) => {
        const presencas = f.presencas || 0;
        return sum + (isNaN(presencas) ? 0 : presencas);
      }, 0);
      
      let percentual = 0;
      if (totalAulas > 0) {
        percentual = (totalPresencas / totalAulas) * 100;
      }

      return {
        name: mes,
        value: isNaN(percentual) || !isFinite(percentual) ? 0 : Number(percentual.toFixed(1)),
      };
    });
  }, [frequencias]);

  // ============================================
  // TABELAS
  // ============================================

  const dadosTabelaAlunos = useMemo(() => {
    return alunos.slice(0, 10).map(aluno => {
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

      return {
        nome: aluno.nome_completo,
        turma: turma?.nome || '-',
        media: media.toFixed(2),
        frequencia: frequenciaMedia.toFixed(1),
        status: aluno.ativo ? 'Ativo' : 'Inativo',
      };
    });
  }, [alunos, notas, frequencias, matriculas, turmas]);

  const dadosTabelaProfessores = useMemo(() => {
    return professores.map(professor => {
      const turmasProfessor = turmas.filter(t => 
        t.professor_responsavel_id === professor.id
      ).length;

      const observacoesProfessor = observacoes.filter(
        o => o.professor_id === professor.id
      ).length;

      return {
        nome: professor.nome_completo,
        email: professor.email,
        turmas: turmasProfessor,
        observacoes: observacoesProfessor,
        status: professor.ativo ? 'Ativo' : 'Inativo',
      };
    });
  }, [professores, turmas, observacoes]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleExportarRelatorio = () => {
    toast.success('Relatório exportado com sucesso! (Simulado)');
  };

  const handleGerarRelatorio = () => {
    toast.success('Relatório gerado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios e Análises</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe métricas e indicadores do desempenho institucional
          </p>
        </div>
        <Button onClick={handleExportarRelatorio}>
          <Download className="w-4 h-4 mr-2" />
          Exportar Todos
        </Button>
      </div>

      {/* Filtros */}
      <RelatorioFilters
        filters={filters}
        onFiltersChange={setFilters}
        cursos={cursos}
        turmas={turmas}
        disciplinas={disciplinas}
        alunos={alunos}
        professores={professores}
      />

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Alunos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dadosGerais.totalAlunos}
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
              <p className="text-sm text-gray-600">Média Geral</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dadosGerais.mediaGeral.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Frequência Média</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dadosGerais.frequenciaMedia.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                R$ {(dadosGerais.receitaTotal / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Relatórios */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="academico">Acadêmico</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="frequencia">Frequência</TabsTrigger>
        </TabsList>

        {/* TAB: GERAL */}
        <TabsContent value="geral" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraficoDesempenho
              tipo="bar"
              dados={dadosDesempenhoPorTurma}
              titulo="Desempenho por Turma"
              dataKey="media"
              xAxisKey="name"
            />
            <GraficoDesempenho
              tipo="pie"
              dados={dadosReceitaPorCurso}
              titulo="Receita por Curso"
              dataKey="value"
              xAxisKey="name"
            />
          </div>

          <TabelaRelatorio
            titulo="Top 10 Alunos"
            colunas={[
              { key: 'nome', label: 'Nome' },
              { key: 'turma', label: 'Turma' },
              { key: 'media', label: 'Média', tipo: 'number' },
              { key: 'frequencia', label: 'Frequência', tipo: 'percentage' },
              { 
                key: 'status', 
                label: 'Status',
                tipo: 'badge',
                badge: {
                  variants: {
                    'Ativo': 'default',
                    'Inativo': 'secondary',
                  }
                }
              },
            ]}
            dados={dadosTabelaAlunos}
          />
        </TabsContent>

        {/* TAB: ACADÊMICO */}
        <TabsContent value="academico" className="space-y-6">
          <GraficoDesempenho
            tipo="bar"
            dados={dadosDesempenhoPorTurma}
            titulo="Média de Notas por Turma"
            dataKey="media"
            xAxisKey="name"
          />

          <TabelaRelatorio
            titulo="Professores e Atividades"
            colunas={[
              { key: 'nome', label: 'Professor' },
              { key: 'email', label: 'E-mail' },
              { key: 'turmas', label: 'Turmas', tipo: 'number' },
              { key: 'observacoes', label: 'Observações', tipo: 'number' },
              { 
                key: 'status', 
                label: 'Status',
                tipo: 'badge',
                badge: {
                  variants: {
                    'Ativo': 'default',
                    'Inativo': 'secondary',
                  }
                }
              },
            ]}
            dados={dadosTabelaProfessores}
          />
        </TabsContent>

        {/* TAB: FINANCEIRO */}
        <TabsContent value="financeiro" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Receita Total</p>
              <p className="text-3xl font-semibold text-gray-900 mb-1">
                R$ {dadosGerais.receitaTotal.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Receita Recebida</p>
              <p className="text-3xl font-semibold text-green-600 mb-1">
                R$ {dadosGerais.receitaRecebida.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Taxa de Inadimplência</p>
              <p className="text-3xl font-semibold text-red-600 mb-1">
                {dadosGerais.taxaInadimplencia.toFixed(1)}%
              </p>
            </div>
          </div>

          <GraficoDesempenho
            tipo="pie"
            dados={dadosReceitaPorCurso}
            titulo="Distribuição de Receita por Curso"
            dataKey="value"
            xAxisKey="name"
          />
        </TabsContent>

        {/* TAB: FREQUÊNCIA */}
        <TabsContent value="frequencia" className="space-y-6">
          <GraficoDesempenho
            tipo="line"
            dados={dadosFrequenciaMensal}
            titulo="Frequência Média Mensal (%)"
            dataKey="value"
            xAxisKey="name"
          />

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Resumo de Frequência</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Frequência Média Geral</span>
                <span className="text-gray-900">{dadosGerais.frequenciaMedia.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total de Registros</span>
                <span className="text-gray-900">{frequencias.length}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosGestorPage;