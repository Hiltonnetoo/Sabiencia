// ============================================
// SKIP LINKS - Links de navegação rápida para acessibilidade
// ============================================

import React from 'react';
import { cn } from '../ui/utils';

interface SkipLink {
  id: string;
  label: string;
  href: string;
}

const defaultSkipLinks: SkipLink[] = [
  {
    id: 'skip-to-main',
    label: 'Pular para o conteúdo principal',
    href: '#main-content',
  },
  {
    id: 'skip-to-nav',
    label: 'Pular para a navegação',
    href: '#main-navigation',
  },
  {
    id: 'skip-to-search',
    label: 'Pular para a busca',
    href: '#search',
  },
  {
    id: 'skip-to-footer',
    label: 'Pular para o rodapé',
    href: '#footer',
  },
];

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

/**
 * Componente de Skip Links para navegação rápida por teclado
 * Links ficam invisíveis até receberem foco (Tab)
 * 
 * @example
 * <SkipLinks />
 * 
 * // No layout:
 * <main id="main-content">...</main>
 * <nav id="main-navigation">...</nav>
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({ 
  links = defaultSkipLinks,
  className,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId);
    
    if (target) {
      // Move o foco para o elemento alvo
      target.setAttribute('tabindex', '-1');
      target.focus();
      
      // Scroll suave para o elemento
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Remove tabindex após o foco (para não afetar navegação normal)
      setTimeout(() => {
        target.removeAttribute('tabindex');
      }, 1000);
    }
  };

  return (
    <div className={cn('skip-links', className)}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className={cn(
            // Invisível por padrão
            'absolute left-0 top-0 z-[9999]',
            'px-4 py-2',
            'bg-blue-600 text-white',
            'translate-y-[-100%]',
            'transition-transform duration-200',
            // Visível ao receber foco
            'focus:translate-y-0',
            'focus:outline-none focus:ring-2 focus:ring-blue-400',
            'hover:bg-blue-700'
          )}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

/**
 * Componente para marcar áreas principais da página
 * Facilita navegação com skip links
 */
interface LandmarkProps {
  id: string;
  as?: 'main' | 'nav' | 'aside' | 'footer' | 'section' | 'div';
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const Landmark: React.FC<LandmarkProps> = ({
  id,
  as = 'div',
  ariaLabel,
  children,
  className,
}) => {
  const Component = as as React.ElementType;
  return (
    <Component
      id={id}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </Component>
  );
};

/**
 * Hook para registrar landmarks dinamicamente
 */
export const useLandmark = (id: string) => {
  React.useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      // Adiciona atributo para facilitar debug
      element.setAttribute('data-landmark', 'true');
    }
  }, [id]);
};

/**
 * Componente Main com skip link automático
 */
export const MainContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <main
      id="main-content"
      role="main"
      aria-label="Conteúdo principal"
      className={className}
      tabIndex={-1} // Permite receber foco programaticamente
    >
      {children}
    </main>
  );
};

/**
 * Componente Nav com skip link automático
 */
export const MainNavigation: React.FC<{
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}> = ({ children, className, ariaLabel = 'Navegação principal' }) => {
  return (
    <nav
      id="main-navigation"
      role="navigation"
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </nav>
  );
};
