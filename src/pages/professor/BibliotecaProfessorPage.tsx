// ============================================
// BIBLIOTECA PROFESSOR PAGE - Gerenciar materiais
// ============================================

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { MaterialCard } from '../../components/biblioteca/MaterialCard';
import { MaterialFilters } from '../../components/biblioteca/MaterialFilters';
import { MaterialViewDialog } from '../../components/biblioteca/MaterialViewDialog';
import { MaterialUploadForm } from '../../components/biblioteca/MaterialUploadForm';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { BookOpen, FileText, Video, Plus, Upload } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { Material } from '../../types';
import type { MaterialFormData } from '../../schemas/materialSchemas';

export const BibliotecaProfessorPage: React.FC = () => {
  const { user } = useAuth();
  const { materiais: allMateriais, disciplinas, createMaterial, updateMaterial, deleteMaterial } = useMockData();

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [disciplinaFilter, setDisciplinaFilter] = useState('all');
  const [moduloFilter, setModuloFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Estados de modais
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);
  const [viewMaterial, setViewMaterial] = useState<Material | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar materiais do professor
  const myMateriais = allMateriais.filter(m => m.professor_id === user?.id);

  // Extrair tags, módulos
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    myMateriais.forEach(m => m.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [myMateriais]);

  const allModulos = useMemo(() => {
    const modulos = new Set<string>();
    myMateriais.forEach(m => modulos.add(m.modulo));
    return Array.from(modulos).sort();
  }, [myMateriais]);

  // Filtrar materiais
  const filteredMateriais = useMemo(() => {
    return myMateriais.filter(material => {
      const matchesSearch =
        material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = tipoFilter === 'all' || material.tipo === tipoFilter;
      const matchesDisciplina = disciplinaFilter === 'all' || material.disciplina_id === disciplinaFilter;
      const matchesModulo = moduloFilter === 'all' || material.modulo === moduloFilter;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => material.tags.includes(tag));

      return matchesSearch && matchesTipo && matchesDisciplina && matchesModulo && matchesTags;
    });
  }, [myMateriais, searchTerm, tipoFilter, disciplinaFilter, moduloFilter, selectedTags]);

  const pdfs = filteredMateriais.filter(m => m.tipo === 'pdf');
  const videos = filteredMateriais.filter(m => m.tipo === 'video');

  // Handlers
  const handleView = (material: Material) => {
    setViewMaterial(material);
    setViewDialogOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditMaterial(material);
    setUploadDialogOpen(true);
  };

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (materialToDelete) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        deleteMaterial(materialToDelete.id);
        toast.success('Material excluído com sucesso!');
        setDeleteDialogOpen(false);
        setMaterialToDelete(null);
      } catch (error) {
        toast.error('Erro ao excluir material');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (data: MaterialFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editMaterial) {
        updateMaterial(editMaterial.id, data as any);
        toast.success('Material atualizado com sucesso!');
      } else {
        createMaterial({
          ...data,
          professor_id: user!.id,
        } as any);
        toast.success('Material publicado com sucesso!');
      }

      setUploadDialogOpen(false);
      setEditMaterial(null);
    } catch (error) {
      toast.error('Erro ao salvar material');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (material: Material) => {
    window.open(material.url, '_blank');
    toast.success('Abrindo material...');
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTipoFilter('all');
    setDisciplinaFilter('all');
    setModuloFilter('all');
    setSelectedTags([]);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Minha Biblioteca</h1>
          <p className="text-gray-600 mt-1">
            Gerencie materiais de estudo para seus alunos
          </p>
        </div>
        <Button
          onClick={() => {
            setEditMaterial(null);
            setUploadDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Material
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Meus Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myMateriais.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDFs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myMateriais.filter(m => m.tipo === 'pdf').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vídeos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myMateriais.filter(m => m.tipo === 'video').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Publicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myMateriais.filter(m => m.visivel_para_alunos).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            tipoFilter={tipoFilter}
            onTipoFilterChange={setTipoFilter}
            disciplinaFilter={disciplinaFilter}
            onDisciplinaFilterChange={setDisciplinaFilter}
            moduloFilter={moduloFilter}
            onModuloFilterChange={setModuloFilter}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availableTags={allTags}
            availableDisciplinas={disciplinas}
            availableModulos={allModulos}
            onClearFilters={handleClearFilters}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="todos">
            Todos ({filteredMateriais.length})
          </TabsTrigger>
          <TabsTrigger value="pdfs">PDFs ({pdfs.length})</TabsTrigger>
          <TabsTrigger value="videos">Vídeos ({videos.length})</TabsTrigger>
        </TabsList>

        {/* Todos */}
        <TabsContent value="todos" className="mt-6">
          {filteredMateriais.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  {myMateriais.length === 0
                    ? 'Você ainda não possui materiais publicados'
                    : 'Nenhum material encontrado com os filtros selecionados'}
                </p>
                {myMateriais.length === 0 && (
                  <Button
                    onClick={() => setUploadDialogOpen(true)}
                    className="mt-4 gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Publicar Primeiro Material
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMateriais.map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* PDFs */}
        <TabsContent value="pdfs" className="mt-6">
          {pdfs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum PDF publicado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pdfs.map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Vídeos */}
        <TabsContent value="videos" className="mt-6">
          {videos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Nenhum vídeo publicado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de Upload/Edição */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMaterial ? 'Editar Material' : 'Novo Material'}
            </DialogTitle>
          </DialogHeader>
          <MaterialUploadForm
            material={editMaterial || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setUploadDialogOpen(false);
              setEditMaterial(null);
            }}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <MaterialViewDialog
        material={viewMaterial}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onDownload={handleDownload}
      />

      {/* Dialog de Exclusão */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Material"
        itemName={materialToDelete?.titulo}
        description="Esta ação irá remover permanentemente o material da biblioteca. Os alunos não poderão mais acessá-lo."
      />
    </div>
  );
};

export default BibliotecaProfessorPage;
