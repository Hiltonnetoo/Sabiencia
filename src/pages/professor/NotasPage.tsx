// ============================================
// NOTAS PAGE (PROFESSOR) - Lançamento de notas
// ============================================

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LancamentoNotasForm } from '../../components/notas/LancamentoNotasForm';
import { Card, CardContent } from '../../components/ui/card';
import { FileCheck } from 'lucide-react';
import { toast } from 'sonner';

export const NotasPage: React.FC = () => {
  const { user } = useAuth();

  const handleSuccess = () => {
    toast.success('Notas lançadas com sucesso!');
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500">Você precisa estar logado para acessar esta página</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lançamento de Notas</h1>
            <p className="text-gray-600 mt-1">
              Lance as notas das avaliações dos alunos
            </p>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-900 mb-2">Como lançar notas:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>1. Selecione a turma, disciplina e tipo de avaliação</li>
            <li>2. Defina o peso da avaliação e a data</li>
            <li>3. Digite as notas de 0 a 10 (use ponto para decimais, ex: 7.5)</li>
            <li>4. Veja a tendência de cada aluno comparando com notas anteriores</li>
            <li>5. Adicione observações quando necessário</li>
            <li>6. Clique em "Salvar Notas" para confirmar</li>
          </ul>
        </CardContent>
      </Card>

      {/* Formulário */}
      <LancamentoNotasForm
        professorId={user.id}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default NotasPage;
