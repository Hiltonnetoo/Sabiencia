// ============================================
// GLOBAL SEARCH - Busca global do sistema
// ============================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../contexts/MockDataContext';
import { useAuth } from '../../contexts/AuthContext';
import { SearchService } from '../../utils/searchService';
import { SearchResult, CATEGORY_LABELS, SearchCategory } from '../../types/search';
import { 
  User, 
  GraduationCap, 
  Users, 
  BookOpen, 
  FileText, 
  Megaphone, 
  StickyNote, 
  Bell, 
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_ICON_MAP: Record<SearchCategory, React.ReactNode> = {
  alunos: <GraduationCap className="h-4 w-4" />,
  professores: <User className="h-4 w-4" />,
  turmas: <Users className="h-4 w-4" />,
  disciplinas: <BookOpen className="h-4 w-4" />,
  materiais: <FileText className="h-4 w-4" />,
  comunicados: <Megaphone className="h-4 w-4" />,
  observacoes: <StickyNote className="h-4 w-4" />,
  notificacoes: <Bell className="h-4 w-4" />,
  pagamentos: <DollarSign className="h-4 w-4" />,
};

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const mockData = useMockData();

  // Carregar buscas recentes do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar buscas recentes:', e);
      }
    }
  }, []);

  // Salvar busca recente
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5); // Manter apenas as 5 mais recentes
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Buscar resultados
  const results = useMemo(() => {
    if (!query || !user) return [];

    return SearchService.searchAll(
      query,
      {
        alunos: mockData.alunos,
        professores: mockData.professores,
        turmas: mockData.turmas,
        disciplinas: mockData.disciplinas,
        materiais: mockData.materiais,
        comunicados: mockData.comunicados,
        observacoes: mockData.observacoes,
        notificacoes: mockData.notificacoes,
        pagamentos: mockData.pagamentos,
      },
      user.role
    );
  }, [query, user, mockData]);

  // Agrupar resultados por categoria
  const groupedResults = useMemo(() => {
    return SearchService.groupByCategory(results);
  }, [results]);

  // Navegar para resultado
  const handleSelect = (result: SearchResult) => {
    saveRecentSearch(query);
    navigate(result.url);
    onOpenChange(false);
    setQuery('');
  };

  // Usar busca recente
  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  // Limpar busca recente
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Buscar alunos, professores, materiais..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!query && recentSearches.length > 0 && (
          <>
            <CommandGroup heading="Buscas Recentes">
              {recentSearches.map((search, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleRecentSearch(search)}
                  className="cursor-pointer"
                >
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{search}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={clearRecentSearches}
                className="cursor-pointer text-red-600"
              >
                Limpar histórico
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {query && results.length === 0 && (
          <CommandEmpty>
            Nenhum resultado encontrado para &quot;{query}&quot;
          </CommandEmpty>
        )}

        {query && results.length > 0 && (
          <>
            {/* Mostrar total de resultados */}
            <div className="px-3 py-2 text-sm text-gray-500 border-b">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>
                  {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </span>
              </div>
            </div>

            {/* Resultados agrupados por categoria */}
            {Object.entries(groupedResults).map(([category, items]) => (
              <CommandGroup 
                key={category} 
                heading={CATEGORY_LABELS[category as SearchCategory]}
              >
                {items.map((result) => (
                  <CommandItem
                    key={`${result.type}-${result.id}`}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="mt-0.5 text-gray-500">
                        {CATEGORY_ICON_MAP[result.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{result.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {CATEGORY_LABELS[result.type]}
                          </Badge>
                        </div>
                        {result.subtitle && (
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {result.subtitle}
                          </p>
                        )}
                        {result.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </>
        )}

        {!query && recentSearches.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-500">
            <p>Digite para começar a buscar</p>
            <p className="text-xs mt-2">
              Você pode buscar por alunos, professores, materiais e muito mais
            </p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
};
