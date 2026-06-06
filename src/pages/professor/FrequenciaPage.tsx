// ============================================
// FREQUÊNCIA PAGE (PROFESSOR) - Registro de presença
// ============================================

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ListaPresencaForm } from '../../components/frequencia/ListaPresencaForm';
import { Card, CardContent } from '../../components/ui/card';
import { ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

export const FrequenciaPage: React.FC = () => {
  const { user } = useAuth();

  const handleSuccess = () => {
    toast.success('Frequência registrada com sucesso!');
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
            <ClipboardCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registro de Frequência</h1>
            <p className="text-gray-600 mt-1">
              Registre a presença dos alunos nas aulas
            </p>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-medium text-blue-900 mb-2">Como registrar a frequência:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>1. Selecione a turma, disciplina e data da aula</li>
            <li>2. Clique no status de cada aluno para alternar entre Presente/Ausente/Justificado</li>
            <li>3. Adicione observações quando necessário</li>
            <li>4. Use os botões "Todos presentes" ou "Todos ausentes" para agilizar</li>
            <li>5. Clique em "Salvar Frequência" para confirmar</li>
          </ul>
        </CardContent>
      </Card>

      {/* Formulário */}
      <ListaPresencaForm
        professorId={user.id}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default FrequenciaPage;
