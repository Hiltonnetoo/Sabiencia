// ============================================
// BIBLIOTECA GESTOR PAGE - Visão geral e moderação
// ============================================

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { MaterialCard } from '../../components/biblioteca/MaterialCard';
import { MaterialFilters } from '../../components/biblioteca/MaterialFilters';
import { MaterialViewDialog } from '../../components/biblioteca/MaterialViewDialog';
import { DeleteConfirmDialog } from '../../components/shared/DeleteConfirmDialog';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { BookOpen, FileText, Video, Users, Eye, EyeOff, TrendingUp, Upload } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { toast } from 'sonner';
import type { Material } from '../../types';
import { Badge } from '../../components/ui/badge';
import { EmptyState, SearchEmptyState, FilterEmptyState } from '../../components/shared/EmptyState';

export const BibliotecaGestorPage: React.FC = () => {
  const { materiais: allMateriais, disciplinas, professores, updateMaterial, deleteMaterial } = useMockData();

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [disciplinaFilter, setDisciplinaFilter] = useState('all');
  const [moduloFilter, setModuloFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  // Estados de modais
  const [viewMaterial, setViewMaterial] = useState<Material | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extrair tags e módulos
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allMateriais.forEach(m => m.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [allMateriais]);

  const allModulos = useMemo(() => {
    const modulos = new Set<string>();
    allMateriais.forEach(m => modulos.add(m.modulo));
    return Array.from(modulos).sort();
  }, [allMateriais]);

  // Filtrar materiais
  const filteredMateriais = useMemo(() => {
    return allMateriais.filter(material => {
      const matchesSearch =
        material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = tipoFilter === 'all' || material.tipo === tipoFilter;
      const matchesDisciplina = disciplinaFilter === 'all' || material.disciplina_id === disciplinaFilter;
      const matchesModulo = moduloFilter === 'all' || material.modulo === moduloFilter;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => material.tags.includes(tag));
      
      const matchesVisibility = 
        visibilityFilter === 'all' ||
        (visibilityFilter === 'visible' && material.visivel_para_alunos) ||
        (visibilityFilter === 'hidden' && !material.visivel_para_alunos);

      return matchesSearch && matchesTipo && matchesDisciplina && matchesModulo && matchesTags && matchesVisibility;
    });
  }, [allMateriais, searchTerm, tipoFilter, disciplinaFilter, moduloFilter, selectedTags, visibilityFilter]);

  const pdfs = filteredMateriais.filter(m => m.tipo === 'pdf');
  const videos = filteredMateriais.filter(m => m.tipo === 'video');
  const visibleMaterials = allMateriais.filter(m => m.visivel_para_alunos);
  const hiddenMaterials = allMateriais.filter(m => !m.visivel_para_alunos);

  // Stats por professor
  const materialsByProfessor = useMemo(() => {
    const stats = new Map<string, number>();
    allMateriais.forEach(m => {
      stats.set(m.professor_id, (stats.get(m.professor_id) || 0) + 1);
    });
    return stats;
  }, [allMateriais]);

  // Handlers
  const handleView = (material: Material) => {
    setViewMaterial(material);
    setViewDialogOpen(true);
  };

  const handleToggleVisibility = async (material: Material) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateMaterial(material.id, {
        visivel_para_alunos: !material.visivel_para_alunos,
      });
      toast.success(
        material.visivel_para_alunos
          ? 'Material ocultado dos alunos'
          : 'Material visível para alunos'
      );
    } catch (error) {
      toast.error('Erro ao atualizar visibilidade');
    } finally {
      setIsLoading(false);
    }
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
    setVisibilityFilter('all');
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Biblioteca Virtual</h1>
        <p className="text-gray-600 mt-1">
          Visão geral e gerenciamento de materiais
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Total de Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allMateriais.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {pdfs.length} PDFs • {videos.length} Vídeos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{visibleMaterials.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {((visibleMaterials.length / allMateriais.length) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Ocultos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{hiddenMaterials.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              Não visíveis para alunos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Professores Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materialsByProfessor.size}</div>
            <p className="text-xs text-gray-500 mt-1">
              Com materiais publicados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Professores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Professores com Mais Materiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from(materialsByProfessor.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([professorId, count]) => {
                const professor = professores.find(p => p.id === professorId);
                if (!professor) return null;
                return (
                  <div key={professorId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {professor.nome_completo.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{professor.nome_completo}</p>
                        <p className="text-sm text-gray-500">{professor.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      {count} materiais
                    </Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Filtro adicional de visibilidade */}
          <div className="flex gap-2">
            <Button
              variant={visibilityFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisibilityFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={visibilityFilter === 'visible' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisibilityFilter('visible')}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Visíveis
            </Button>
            <Button
              variant={visibilityFilter === 'hidden' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVisibilityFilter('hidden')}
              className="gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Ocultos
            </Button>
          </div>
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
                  Nenhum material encontrado com os filtros selecionados
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMateriais.map(material => (
                <div key={material.id} className="relative">
                  {/* Badge de visibilidade */}
                  {!material.visivel_para_alunos && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge variant="destructive" className="gap-1">
                        <EyeOff className="h-3 w-3" />
                        Oculto
                      </Badge>
                    </div>
                  )}
                  <MaterialCard
                    material={material}
                    onView={handleView}
                    onDelete={handleDeleteClick}
                    onDownload={handleDownload}
                    showActions={false}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleView(material)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button
                      onClick={() => handleToggleVisibility(material)}
                      variant={material.visivel_para_alunos ? 'outline' : 'default'}
                      size="sm"
                    >
                      {material.visivel_para_alunos ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
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
                <p className="text-gray-500">Nenhum PDF encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pdfs.map(material => (
                <div key={material.id} className="relative">
                  {!material.visivel_para_alunos && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge variant="destructive" className="gap-1">
                        <EyeOff className="h-3 w-3" />
                        Oculto
                      </Badge>
                    </div>
                  )}
                  <MaterialCard
                    material={material}
                    onView={handleView}
                    onDelete={handleDeleteClick}
                    onDownload={handleDownload}
                    showActions={false}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleView(material)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button
                      onClick={() => handleToggleVisibility(material)}
                      variant={material.visivel_para_alunos ? 'outline' : 'default'}
                      size="sm"
                    >
                      {material.visivel_para_alunos ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
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
                <p className="text-gray-500">Nenhum vídeo encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map(material => (
                <div key={material.id} className="relative">
                  {!material.visivel_para_alunos && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge variant="destructive" className="gap-1">
                        <EyeOff className="h-3 w-3" />
                        Oculto
                      </Badge>
                    </div>
                  )}
                  <MaterialCard
                    material={material}
                    onView={handleView}
                    onDelete={handleDeleteClick}
                    onDownload={handleDownload}
                    showActions={false}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleView(material)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button
                      onClick={() => handleToggleVisibility(material)}
                      variant={material.visivel_para_alunos ? 'outline' : 'default'}
                      size="sm"
                    >
                      {material.visivel_para_alunos ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
        description="Esta ação é irreversível. O material será removido permanentemente da biblioteca."
      />
    </div>
  );
};

export default BibliotecaGestorPage;
