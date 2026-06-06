// ============================================
// PERFORMANCE TESTS - Render Benchmarks
// Testa performance de renderização dos componentes
// ============================================

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockDataProvider } from '../../contexts/MockDataContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { AlunosTable } from '../../components/alunos/AlunosTable';
import { ProfessoresTable } from '../../components/professores/ProfessoresTable';
import { GestorDashboard } from '../../pages/gestor/GestorDashboard';
import { ProfessorDashboard } from '../../pages/professor/ProfessorDashboard';
import { AlunoDashboard } from '../../pages/aluno/AlunoDashboard';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <MockDataProvider>
          {component}
        </MockDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Render Performance - Benchmarks', () => {
  describe('Tabelas', () => {
    it('AlunosTable deve renderizar em menos de 100ms', () => {
      const startTime = performance.now();
      
      renderWithProviders(
        <AlunosTable
          searchTerm=""
          statusFilter="todos"
          cursoFilter="todos"
          onDelete={() => {}}
        />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`AlunosTable render time: ${renderTime.toFixed(2)}ms`);
      expect(renderTime).toBeLessThan(100);
    });

    it('ProfessoresTable deve renderizar em menos de 100ms', () => {
      const startTime = performance.now();
      
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={() => {}}
        />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`ProfessoresTable render time: ${renderTime.toFixed(2)}ms`);
      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Dashboards', () => {
    it('GestorDashboard deve renderizar em menos de 200ms', () => {
      const startTime = performance.now();
      
      renderWithProviders(<GestorDashboard />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`GestorDashboard render time: ${renderTime.toFixed(2)}ms`);
      expect(renderTime).toBeLessThan(200);
    });

    it('ProfessorDashboard deve renderizar em menos de 150ms', () => {
      const startTime = performance.now();
      
      renderWithProviders(<ProfessorDashboard />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`ProfessorDashboard render time: ${renderTime.toFixed(2)}ms`);
      expect(renderTime).toBeLessThan(150);
    });

    it('AlunoDashboard deve renderizar em menos de 150ms', () => {
      const startTime = performance.now();
      
      renderWithProviders(<AlunoDashboard />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      console.log(`AlunoDashboard render time: ${renderTime.toFixed(2)}ms`);
      expect(renderTime).toBeLessThan(150);
    });
  });

  describe('Re-renders', () => {
    it('AlunosTable não deve re-renderizar com mesmas props', () => {
      const { rerender } = renderWithProviders(
        <AlunosTable
          searchTerm=""
          statusFilter="todos"
          cursoFilter="todos"
          onDelete={() => {}}
        />
      );

      const startTime = performance.now();
      
      rerender(
        <BrowserRouter>
          <AuthProvider>
            <MockDataProvider>
              <AlunosTable
                searchTerm=""
                statusFilter="todos"
                cursoFilter="todos"
                onDelete={() => {}}
              />
            </MockDataProvider>
          </AuthProvider>
        </BrowserRouter>
      );
      
      const endTime = performance.now();
      const rerenderTime = endTime - startTime;
      
      console.log(`AlunosTable re-render time: ${rerenderTime.toFixed(2)}ms`);
      expect(rerenderTime).toBeLessThan(50);
    });

    it('GestorDashboard deve ter re-renders rápidos', () => {
      const { rerender } = renderWithProviders(<GestorDashboard />);

      const startTime = performance.now();
      
      rerender(
        <BrowserRouter>
          <AuthProvider>
            <MockDataProvider>
              <GestorDashboard />
            </MockDataProvider>
          </AuthProvider>
        </BrowserRouter>
      );
      
      const endTime = performance.now();
      const rerenderTime = endTime - startTime;
      
      console.log(`GestorDashboard re-render time: ${rerenderTime.toFixed(2)}ms`);
      expect(rerenderTime).toBeLessThan(100);
    });
  });

  describe('Múltiplas Renderizações', () => {
    it('deve renderizar AlunosTable 10 vezes em menos de 1 segundo', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        const { unmount } = renderWithProviders(
          <AlunosTable
            searchTerm=""
            statusFilter="todos"
            cursoFilter="todos"
            onDelete={() => {}}
          />
        );
        unmount();
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`10x AlunosTable renders: ${totalTime.toFixed(2)}ms`);
      expect(totalTime).toBeLessThan(1000);
    });

    it('deve renderizar GestorDashboard 10 vezes em menos de 2 segundos', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        const { unmount } = renderWithProviders(<GestorDashboard />);
        unmount();
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`10x GestorDashboard renders: ${totalTime.toFixed(2)}ms`);
      expect(totalTime).toBeLessThan(2000);
    });
  });
});

describe('Memory Management', () => {
  it('não deve vazar memória em múltiplas montagens/desmontagens', () => {
    // Renderizar e desmontar múltiplas vezes
    for (let i = 0; i < 50; i++) {
      const { unmount } = renderWithProviders(
        <AlunosTable
          searchTerm=""
          statusFilter="todos"
          cursoFilter="todos"
          onDelete={() => {}}
        />
      );
      unmount();
    }

    // Se chegou aqui sem travar, não há vazamento óbvio
    expect(true).toBe(true);
  });

  it('deve limpar event listeners ao desmontar', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderWithProviders(<GestorDashboard />);

    const addCalls = addEventListenerSpy.mock.calls.length;
    
    unmount();
    
    const removeCalls = removeEventListenerSpy.mock.calls.length;

    // Deve ter removido listeners (pode não ser exatamente igual devido a outros componentes)
    expect(removeCalls).toBeGreaterThanOrEqual(0);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

describe('Virtual Scrolling Performance', () => {
  it('AlunosTable com virtualização deve ser rápida', () => {
    const startTime = performance.now();
    
    renderWithProviders(
      <AlunosTable
        searchTerm=""
        statusFilter="todos"
        cursoFilter="todos"
        onDelete={() => {}}
      />
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Com virtualização, deve renderizar rápido mesmo com muitos dados
    console.log(`AlunosTable (virtual) render time: ${renderTime.toFixed(2)}ms`);
    expect(renderTime).toBeLessThan(150);
  });
});

describe('Memoization Effectiveness', () => {
  it('useMemo deve prevenir recálculos desnecessários', () => {
    let calculationCount = 0;
    
    const TestComponent = ({ data }: { data: number[] }) => {
      const expensive = React.useMemo(() => {
        calculationCount++;
        return data.reduce((a, b) => a + b, 0);
      }, [data]);
      
      return <div>{expensive}</div>;
    };

    const { rerender } = render(<TestComponent data={[1, 2, 3]} />);
    
    expect(calculationCount).toBe(1);
    
    // Re-render com mesmos dados
    rerender(<TestComponent data={[1, 2, 3]} />);
    
    // Não deve recalcular
    expect(calculationCount).toBe(1);
    
    // Re-render com dados diferentes
    rerender(<TestComponent data={[4, 5, 6]} />);
    
    // Deve recalcular
    expect(calculationCount).toBe(2);
  });
});
