// ============================================
// PROGRESSO VIDEOAULAS PAGE - Estatísticas detalhadas de videoaulas
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { useVideoaulas } from '../../contexts/VideoaulasContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { EstatisticasVideoaulas } from '../../components/videoaulas/EstatisticasVideoaulas';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { EmptyState } from '../../components/shared/EmptyState';
import { BarChart3 } from 'lucide-react';

export const ProgressoVideoaulasPage: React.FC = () => {
  const { user } = useAuth();
  const { disciplinas } = useMockData();
  const {
    topicos,
    videoaulas,
    progressos,
    getTopicosPorDisciplina,
    getVideoaulasPorTopico
  } = useVideoaulas();

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>('todas');

  if (!user) return null;

  // Filtrar por disciplina
  const topicosFiltrados = disciplinaSelecionada === 'todas'
    ? topicos
    : getTopicosPorDisciplina(disciplinaSelecionada);

  const videoaulasFiltradas = disciplinaSelecionada === 'todas'
    ? videoaulas
    : videoaulas.filter(v => v.disciplina_id === disciplinaSelecionada);

  const progressosFiltrados = disciplinaSelecionada === 'todas'
    ? progressos.filter(p => p.aluno_id === user.id)
    : progressos.filter(p => {
        const videoaula = videoaulas.find(v => v.id === p.videoaula_id);
        return p.aluno_id === user.id && videoaula?.disciplina_id === disciplinaSelecionada;
      });

  const disciplinaObj = disciplinaSelecionada !== 'todas'
    ? disciplinas.find(d => d.id === disciplinaSelecionada)
    : null;

  return (
    <div className="space-y-6 container mx-auto p-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Progresso de Videoaulas</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe seu desempenho e evolução nos estudos
        </p>
      </div>

      {/* Filtro de Disciplina */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Disciplina</CardTitle>
          <CardDescription>
            Visualize suas estatísticas gerais ou por disciplina específica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}>
            <SelectTrigger className="w-full md:w-96">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as Disciplinas</SelectItem>
              {disciplinas.map(d => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {videoaulasFiltradas.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Nenhuma videoaula disponível"
          description={
            disciplinaSelecionada === 'todas'
              ? "Não há videoaulas cadastradas no momento."
              : `Não há videoaulas para ${disciplinaObj?.nome}.`
          }
        />
      ) : (
        <EstatisticasVideoaulas
          topicos={topicosFiltrados}
          videoaulas={videoaulasFiltradas}
          progressos={progressosFiltrados}
          alunoId={user.id}
          getVideoaulasPorTopico={getVideoaulasPorTopico}
        />
      )}
    </div>
  );
};

export default ProgressoVideoaulasPage;
