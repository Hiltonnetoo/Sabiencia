// ============================================
// VIRTUAL TABLE - Performance para Listas Grandes
// ============================================

import React, { useRef, useState, ReactNode } from 'react';

interface VirtualTableProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderRow: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * Tabela com Virtual Scrolling
 * Renderiza apenas itens visíveis - otimizado para 1000+ linhas
 * 
 * @example
 * <VirtualTable
 *   items={alunos}
 *   itemHeight={60}
 *   containerHeight={600}
 *   renderRow={(aluno, index) => (
 *     <AlunoRow aluno={aluno} key={aluno.id} />
 *   )}
 * />
 */
export function VirtualTable<T>({
  items,
  itemHeight,
  containerHeight,
  renderRow,
  overscan = 3,
  className = '',
}: VirtualTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, idx) => (
            <div key={startIndex + idx} style={{ height: itemHeight }}>
              {renderRow(item, startIndex + idx)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para detectar se deve usar virtual scrolling
 */
export function useVirtualScrolling(itemCount: number, threshold: number = 50): boolean {
  return itemCount > threshold;
}
