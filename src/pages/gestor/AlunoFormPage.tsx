import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlunoForm } from '../../components/alunos/AlunoForm';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { AlunoFormData } from '../../schemas/userSchemas';
import type { Aluno } from '../../types';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { UnsavedChangesDialog } from '../../components/shared/UnsavedChangesDialog';

export const AlunoFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createAluno, updateAluno, getAlunoById } = useMockData();
  
  const [aluno, setAluno] = useState<Aluno | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const isEditMode = !!id;

  const { showDialog, confirm, cancel } = useUnsavedChanges({
    when: isFormDirty && !isLoading,
  });

  // Carregar aluno se estiver em modo de edição
  useEffect(() => {
    if (isEditMode && id) {
      const alunoData = getAlunoById(id);
      if (alunoData) {
        setAluno(alunoData);
      } else {
        toast.error('Aluno não encontrado');
        navigate('/gestor/alunos');
      }
    }
    setIsLoadingData(false);
  }, [id, isEditMode, getAlunoById, navigate]);

  const handleSubmit = async (data: AlunoFormData) => {
    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditMode && id) {
        // Atualizar aluno existente
        updateAluno(id, {
          ...data,
          role: 'aluno' as const,
        });
        toast.success('Aluno atualizado com sucesso!');
      } else {
        // Criar novo aluno
        createAluno({
          ...data,
          role: 'aluno' as const,
          cpf: data.cpf.replace(/\D/g, ''), // Remover formatação do CPF
        });
        toast.success('Aluno cadastrado com sucesso!');
      }

      setIsFormDirty(false);
      navigate('/gestor/alunos');
    } catch (error) {
      toast.error('Erro ao salvar aluno. Tente novamente.');
      console.error('Erro ao salvar aluno:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gestor/alunos');
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/gestor/alunos')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Editar Aluno' : 'Novo Aluno'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Atualize as informações do aluno'
              : 'Preencha os dados para cadastrar um novo aluno'}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <AlunoForm
        aluno={aluno}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
        onDirtyChange={setIsFormDirty}
      />

      {/* Dialog de Confirmação */}
      <UnsavedChangesDialog
        open={showDialog}
        onConfirm={confirm}
        onCancel={cancel}
      />
    </div>
  );
};

export default AlunoFormPage;
