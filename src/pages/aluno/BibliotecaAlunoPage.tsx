// ============================================
// BIBLIOTECA ALUNO PAGE - Biblioteca virtual para alunos
// ============================================

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { MaterialCard } from '../../components/biblioteca/MaterialCard';
import { MaterialFilters } from '../../components/biblioteca/MaterialFilters';
import { MaterialViewDialog } from '../../components/biblioteca/MaterialViewDialog';
import { BookOpen, FileText, Video, Heart, Download } from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { Material } from '../../types';

export const BibliotecaAlunoPage: React.FC = () => {
  const { user } = useAuth();
  const { materiais: allMateriais, disciplinas } = useMockData();

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [disciplinaFilter, setDisciplinaFilter] = useState('all');
  const [moduloFilter, setModuloFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Estado do modal de visualização
  const [viewMaterial, setViewMaterial] = useState<Material | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Favoritos (localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(`favorites_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Filtrar materiais visíveis para alunos
  const materiais = allMateriais.filter(m => m.visivel_para_alunos);

  // Extrair tags únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    materiais.forEach(m => m.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [materiais]);

  // Extrair módulos únicos
  const allModulos = useMemo(() => {
    const modulos = new Set<string>();
    materiais.forEach(m => modulos.add(m.modulo));
    return Array.from(modulos).sort();
  }, [materiais]);

  // Filtrar materiais
  const filteredMateriais = useMemo(() => {
    return materiais.filter(material => {
      // Busca
      const matchesSearch =
        material.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.descricao.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de tipo
      const matchesTipo = tipoFilter === 'all' || material.tipo === tipoFilter;

      // Filtro de disciplina
      const matchesDisciplina =
        disciplinaFilter === 'all' || material.disciplina_id === disciplinaFilter;

      // Filtro de módulo
      const matchesModulo = moduloFilter === 'all' || material.modulo === moduloFilter;

      // Filtro de tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag => material.tags.includes(tag));

      return matchesSearch && matchesTipo && matchesDisciplina && matchesModulo && matchesTags;
    });
  }, [materiais, searchTerm, tipoFilter, disciplinaFilter, moduloFilter, selectedTags]);

  // Materiais favoritos
  const favoriteMateriais = useMemo(() => {
    return materiais.filter(m => favorites.includes(m.id));
  }, [materiais, favorites]);

  // PDFs e Vídeos
  const pdfs = filteredMateriais.filter(m => m.tipo === 'pdf');
  const videos = filteredMateriais.filter(m => m.tipo === 'video');

  // Togglear favorito
  const handleToggleFavorite = (material: Material) => {
    const newFavorites = favorites.includes(material.id)
      ? favorites.filter(id => id !== material.id)
      : [...favorites, material.id];

    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(newFavorites));

    toast.success(
      favorites.includes(material.id)
        ? 'Removido dos favoritos'
        : 'Adicionado aos favoritos'
    );
  };

  // Visualizar material
  const handleView = (material: Material) => {
    setViewMaterial(material);
    setViewDialogOpen(true);
  };

  // Download
  const handleDownload = (material: Material) => {
    window.open(material.url, '_blank');
    toast.success('Abrindo material em nova aba...');
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setSearchTerm('');
    setTipoFilter('all');
    setDisciplinaFilter('all');
    setModuloFilter('all');
    setSelectedTags([]);
  };

  // Toggle tag
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Biblioteca Virtual</h1>
        <p className="text-gray-600 mt-1">
          Acesse materiais de estudo, vídeos e documentos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Total de Materiais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materiais.length}</div>
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
            <div className="text-2xl font-bold">{pdfs.length}</div>
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
            <div className="text-2xl font-bold">{videos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites.length}</div>
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
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="todos">
            Todos ({filteredMateriais.length})
          </TabsTrigger>
          <TabsTrigger value="pdfs">PDFs ({pdfs.length})</TabsTrigger>
          <TabsTrigger value="videos">Vídeos ({videos.length})</TabsTrigger>
          <TabsTrigger value="favoritos">
            Favoritos ({favoriteMateriais.length})
          </TabsTrigger>
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
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onDownload={handleDownload}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(material.id)}
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
                <p className="text-gray-500">Nenhum PDF encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pdfs.map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onDownload={handleDownload}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(material.id)}
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
                <p className="text-gray-500">Nenhum vídeo encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onDownload={handleDownload}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(material.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Favoritos */}
        <TabsContent value="favoritos" className="mt-6">
          {favoriteMateriais.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  Você ainda não possui materiais favoritos
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Clique no ❤️ nos materiais para adicioná-los aos favoritos
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteMateriais.map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onView={handleView}
                  onDownload={handleDownload}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={true}
                />
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
    </div>
  );
};

export default BibliotecaAlunoPage;
