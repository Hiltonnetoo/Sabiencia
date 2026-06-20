// ============================================
// DADOS ACADÊMICOS CARD - Informações acadêmicas do aluno
// ============================================

import { useTranslation } from 'react-i18next';
import { GraduationCap, Calendar, BookOpen, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Aluno, Matricula, Turma, Curso } from '../../types';

interface DadosAcademicosCardProps {
  aluno: Aluno;
  matricula?: Matricula;
  turma?: Turma;
  curso?: Curso;
}

export function DadosAcademicosCard({ aluno, matricula, turma, curso }: DadosAcademicosCardProps) {
  const { t } = useTranslation();
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ativo: 'bg-green-100 text-green-800',
      trancado: 'bg-gray-100 text-gray-800',
      concluido: 'bg-blue-100 text-blue-800',
      evadido: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ativo: t('components.dadosAcademicos.statusActive'),
      trancado: t('components.dadosAcademicos.statusLocked'),
      concluido: t('components.dadosAcademicos.statusCompleted'),
      evadido: t('components.dadosAcademicos.statusDroppedOut'),
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <GraduationCap className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl text-gray-900">{t('components.dadosAcademicos.title')}</h2>
          <p className="text-sm text-gray-600">{t('components.dadosAcademicos.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Matrícula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-600">{t('components.dadosAcademicos.enrollment')}</p>
            </div>
            <p className="text-gray-900">{aluno.matricula}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-600">{t('components.dadosAcademicos.enrollmentDate')}</p>
            </div>
            <p className="text-gray-900">
              {matricula?.data_matricula
                ? new Date(matricula.data_matricula).toLocaleDateString('pt-BR')
                : '-'}
            </p>
          </div>
        </div>

        {/* Curso e Turma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-600">{t('components.dadosAcademicos.course')}</p>
            </div>
            <p className="text-gray-900">{curso?.nome || '-'}</p>
            {curso?.carga_horaria && (
              <p className="text-sm text-gray-600 mt-1">
                {t('components.dadosAcademicos.courseLoad', { hours: curso.carga_horaria })}
              </p>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-600" />
              <p className="text-sm text-gray-600">{t('components.dadosAcademicos.class')}</p>
            </div>
            <p className="text-gray-900">{turma?.nome || '-'}</p>
            {turma?.turno && (
              <p className="text-sm text-gray-600 mt-1">
                {t('components.dadosAcademicos.shift', { shift: turma.turno })}
              </p>
            )}
          </div>
        </div>

        {/* Status e Período */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{t('components.dadosAcademicos.status')}</p>
            <Badge className={getStatusColor(matricula?.status || 'ativo')}>
              {getStatusLabel(matricula?.status || 'ativo')}
            </Badge>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{t('components.dadosAcademicos.academicTerm')}</p>
            <p className="text-gray-900">
              {turma?.data_inicio && turma?.data_fim
                ? `${new Date(turma.data_inicio).toLocaleDateString('pt-BR')} - ${new Date(turma.data_fim).toLocaleDateString('pt-BR')}`
                : '-'}
            </p>
          </div>
        </div>

        {/* Informações Adicionais */}
        {curso?.descricao && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-1">{t('components.dadosAcademicos.aboutCourse')}</p>
            <p className="text-sm text-blue-800">{curso.descricao}</p>
          </div>
        )}
      </div>
    </div>
  );
}
