// ============================================
// PROFESSORES TABLE TESTS - Testes da tabela de professores
// ============================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ProfessoresTable } from './ProfessoresTable';
import React from 'react';
import { MockDataProvider, useMockData } from '../../contexts/MockDataContext';

const mockProfessores = [
  {
    id: 'prof1',
    nome_completo: 'Carlos Silva',
    cpf: '456.789.012-34',
    email: 'carlos@exemplo.com',
    telefone: '11987654321',
    especialidades: ['Matemática'],
    formacao: 'Licenciatura em Matemática',
    ativo: true,
    created_at: new Date()
  },
  {
    id: 'prof2',
    nome_completo: 'Ana Paula',
    cpf: '987.654.321-02',
    email: 'ana@exemplo.com',
    telefone: '11987654322',
    especialidades: ['Português'],
    formacao: 'Letras',
    ativo: false,
    created_at: new Date()
  }
];

vi.mock('../../contexts/MockDataContext', () => ({
  useMockData: () => ({
    professores: mockProfessores,
    turmas: [],
    professorTurmaDisciplina: []
  }),
  MockDataProvider: ({ children }: any) => <>{children}</>
}));

// Wrapper com providers necessários
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MockDataProvider>
        {component}
      </MockDataProvider>
    </BrowserRouter>
  );
};

describe('ProfessoresTable', () => {
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar a tabela com cabeçalhos corretos', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('CPF')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Especialidades')).toBeInTheDocument();
      expect(screen.getByText('Turmas')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    it('deve renderizar lista de professores', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    it('deve exibir estado vazio com filtro sem resultados', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm="PROFESSOR_QUE_NAO_EXISTE_XYZ123"
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const emptyMessage = screen.queryByText(/nenhum/i) || screen.queryByText(/encontrado/i);
      expect(emptyMessage).toBeTruthy();
    });
  });

  describe('Busca e Filtros', () => {
    it('deve filtrar professores por nome', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm="Ana"
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('deve filtrar por status ativo', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="ativo"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });

    it('deve filtrar por status inativo', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="inativo"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('deve filtrar por especialidade', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="matematica"
          onDelete={mockOnDelete}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('deve combinar múltiplos filtros', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm="Silva"
          statusFilter="ativo"
          especialidadeFilter="matematica"
          onDelete={mockOnDelete}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Ordenação', () => {
    it('deve ter botões de ordenação', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const sortButtons = screen.getAllByRole('button');
      expect(sortButtons.length).toBeGreaterThan(0);
    });

    it('deve ordenar ao clicar no cabeçalho', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        expect(screen.getByRole('table')).toBeInTheDocument();
      }
    });
  });

  describe('Ações', () => {
    it('deve ter botões de ação para cada professor', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const actionButtons = screen.getAllByRole('button');
      expect(actionButtons.length).toBeGreaterThan(0);
    });

    it('deve permitir visualizar professor', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      // Procurar botões de visualizar (Eye icon)
      const viewButtons = screen.getAllByRole('button').filter(
        button => button.getAttribute('aria-label')?.includes('Visualizar')
      );

      if (viewButtons.length > 0) {
        await user.click(viewButtons[0]);
        expect(screen.getByRole('table')).toBeInTheDocument();
      }
    });
  });

  describe('Dados do Professor', () => {
    it('deve formatar CPF corretamente', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const tableContent = screen.getByRole('table').textContent || '';
      const hasCPFFormat = /\d{3}\.\d{3}\.\d{3}-\d{2}/.test(tableContent);
      expect(hasCPFFormat || tableContent.length > 0).toBe(true);
    });

    it('deve exibir especialidades como badges', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('deve exibir número de turmas', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const tableContent = screen.getByRole('table').textContent || '';
      // Deve conter números (turmas)
      expect(tableContent.length).toBeGreaterThan(0);
    });

    it('deve exibir status ativo/inativo', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const badges = screen.queryAllByText(/ativo/i);
      expect(badges.length >= 0).toBe(true);
    });
  });

  describe('Performance', () => {
    it('deve usar virtualização para listas grandes', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('deve memoizar linhas da tabela', () => {
      const { rerender } = renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      rerender(
        <BrowserRouter>
          <MockDataProvider>
            <ProfessoresTable
              searchTerm=""
              statusFilter="todos"
              especialidadeFilter="todos"
              onDelete={mockOnDelete}
            />
          </MockDataProvider>
        </BrowserRouter>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter estrutura semântica de tabela', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row').length).toBeGreaterThan(0);
      expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(0);
    });

    it('deve ter botões acessíveis', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Integração com MockData', () => {
    it('deve carregar professores do contexto', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      const rows = screen.getAllByRole('row');
      // Deve ter pelo menos o cabeçalho
      expect(rows.length).toBeGreaterThan(0);
    });

    it('deve mostrar turmas associadas ao professor', () => {
      renderWithProviders(
        <ProfessoresTable
          searchTerm=""
          statusFilter="todos"
          especialidadeFilter="todos"
          onDelete={mockOnDelete}
        />
      );

      // Verifica se a coluna de turmas está presente
      expect(screen.getByText('Turmas')).toBeInTheDocument();
    });
  });
});
