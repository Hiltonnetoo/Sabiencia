// ============================================
// SEARCH BUTTON - Botão de busca global
// ============================================

import React from 'react';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-80"
    >
      <Search className="mr-2 h-4 w-4" />
      <span className="inline-flex">Buscar...</span>
    </Button>
  );
};