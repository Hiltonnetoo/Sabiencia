import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProfessorForm } from '../../components/professores/ProfessorForm';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { ProfessorFormData } from '../../schemas/userSchemas';
import type { Professor } from '../../types';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges';
import { UnsavedChangesDialog } from '../../components/shared/UnsavedChangesDialog';

export const ProfessorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createProfessor, updateProfessor, getProfessorById } = useMockData();
  
  const [professor, setProfessor] = useState<Professor | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const isEditMode = !!id;

  const { showDialog, confirm, cancel } = useUnsavedChanges({
    when: isFormDirty && !isLoading,
  });

  // Carregar professor se estiver em modo de edição
  useEffect(() => {
    if (isEditMode && id) {
      const professorData = getProfessorById(id);
      if (professorData) {
        setProfessor(professorData);
      } else {
        toast.error('Professor não encontrado');
        navigate('/gestor/professores');
      }
    }
    setIsLoadingData(false);
  }, [id, isEditMode, getProfessorById, navigate]);

  const handleSubmit = async (data: ProfessorFormData) => {
    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditMode && id) {
        // Atualizar professor existente
        updateProfessor(id, {
          ...data,
          role: 'professor' as const,
        });
        toast.success('Professor atualizado com sucesso!');
      } else {
        // Criar novo professor
        createProfessor({
          ...data,
          role: 'professor' as const,
          cpf: data.cpf.replace(/\D/g, ''), // Remover formatação do CPF
        });
        toast.success('Professor cadastrado com sucesso!');
      }

      setIsFormDirty(false);
      navigate('/gestor/professores');
    } catch (error) {
      toast.error('Erro ao salvar professor. Tente novamente.');
      console.error('Erro ao salvar professor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/gestor/professores');
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
          onClick={() => navigate('/gestor/professores')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Editar Professor' : 'Novo Professor'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Atualize as informações do professor'
              : 'Preencha os dados para cadastrar um novo professor'}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <ProfessorForm
        professor={professor}
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

export default ProfessorFormPage;
