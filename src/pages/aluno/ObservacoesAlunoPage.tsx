// ============================================
// OBSERVAÇÕES ALUNO PAGE
// ============================================

import React, { useState, useMemo } from 'react';
import { FileText, BookOpen, Heart, Briefcase, Eye, MessageSquare } from 'lucide-react';
import { ObservacaoCard } from '../../components/observacoes/ObservacaoCard';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export const ObservacoesAlunoPage: React.FC = () => {
  const { user } = useAuth();
  const { observacoes, alunos, professores, disciplinas } = useMockData();

  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  // Filtrar observações do aluno (apenas visíveis)
  const minhasObservacoes = useMemo(() => {
    if (!user) return [];

    let result = observacoes.filter(
      obs => obs.aluno_id === user.id && obs.visivel_aluno
    );

    // Aplicar filtro de tipo
    if (tipoFiltro !== 'todos') {
      result = result.filter(obs => obs.tipo === tipoFiltro);
    }

    // Ordenar por data (mais recentes primeiro)
    return result.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [observacoes, user, tipoFiltro]);

  // Estatísticas
  const stats = useMemo(() => {
    const todasVisiveis = observacoes.filter(
      obs => obs.aluno_id === user?.id && obs.visivel_aluno
    );

    return {
      total: todasVisiveis.length,
      pedagogicas: todasVisiveis.filter(o => o.tipo === 'pedagogica').length,
      comportamentais: todasVisiveis.filter(o => o.tipo === 'comportamental').length,
      administrativas: todasVisiveis.filter(o => o.tipo === 'administrativa').length,
    };
  }, [observacoes, user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Minhas Observações</h1>
        <p className="text-gray-600 mt-1">
          Acompanhe as observações registradas pelos professores
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Eye className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Visíveis</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pedagógicas</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.pedagogicas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Comportamentais</p>
              <p className="text-2xl font-semibold text-green-600">{stats.comportamentais}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Administrativas</p>
              <p className="text-2xl font-semibold text-purple-600">{stats.administrativas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtro de Tipo */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por tipo:</label>
          <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="pedagogica">Pedagógica</SelectItem>
              <SelectItem value="comportamental">Comportamental</SelectItem>
              <SelectItem value="administrativa">Administrativa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-blue-900">
            <strong>Sobre as observações:</strong> Os professores registram observações 
            para acompanhar seu desenvolvimento acadêmico, comportamental e questões 
            administrativas. Algumas observações podem não estar visíveis por serem 
            de uso interno dos professores.
          </p>
        </div>
      </div>

      {/* Lista de Observações */}
      {minhasObservacoes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Nenhuma observação encontrada</h3>
          <p className="text-gray-600">
            {tipoFiltro !== 'todos'
              ? 'Não há observações deste tipo para você no momento.'
              : 'Você ainda não possui observações visíveis dos professores.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Contagem */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {minhasObservacoes.length} {minhasObservacoes.length === 1 ? 'observação encontrada' : 'observações encontradas'}
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4">
            {minhasObservacoes.map((observacao) => {
              const aluno = alunos.find(a => a.id === observacao.aluno_id);
              const professor = professores.find(p => p.id === observacao.professor_id);
              const disciplina = observacao.disciplina_id 
                ? disciplinas.find(d => d.id === observacao.disciplina_id)
                : undefined;

              return (
                <ObservacaoCard
                  key={observacao.id}
                  observacao={observacao}
                  aluno={aluno}
                  professor={professor}
                  disciplina={disciplina}
                  showActions={false}
                  showStudent={false}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservacoesAlunoPage;
