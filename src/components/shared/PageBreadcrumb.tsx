// ============================================
// PAGE BREADCRUMB - Componente de breadcrumb para páginas
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';

interface PageBreadcrumbProps {
  /**
   * Label customizado para o breadcrumb atual (usado em páginas de detalhes com nomes dinâmicos)
   */
  customLabel?: string;
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Componente de breadcrumb que mostra a navegação hierárquica
 * Uso: <PageBreadcrumb customLabel="João Silva" />
 */
export const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ 
  customLabel,
  className 
}) => {
  const breadcrumbs = useBreadcrumbs(customLabel);

  // Não renderiza se não houver breadcrumbs
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = item.icon;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {Icon && <Icon className="h-4 w-4 mr-1.5 inline-block" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href!}>
                      {Icon && <Icon className="h-4 w-4 mr-1.5 inline-block" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
