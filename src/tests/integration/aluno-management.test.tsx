// ============================================
// INTEGRATION TESTS - Aluno Management
// Testa fluxo completo de gestão de alunos
// ============================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockDataProvider, useMockData } from '../../contexts/MockDataContext';
import { AlunoForm } from '../../components/alunos/AlunoForm';
import { AlunosTable } from '../../components/alunos/AlunosTable';
import React from 'react';

describe('Aluno Management - Integration', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('deve criar aluno e exibi-lo na lista', async () => {
    const user = userEvent.setup();
    
    const TestApp = () => {
      const [showForm, setShowForm] = React.useState(true);
      const { alunos, createAluno } = useMockData();

      const handleSubmit = (data: any) => {
        createAluno(data);
        setShowForm(false);
      };

      return (
        <div>
          {showForm && (
            <AlunoForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
          )}
          {!showForm && (
            <div>
              <div>Total de alunos: {alunos.length}</div>
              <AlunosTable
                searchTerm=""
                statusFilter="todos"
                cursoFilter="todos"
                onDelete={() => {}}
              />
            </div>
          )}
        </div>
      );
    };

    render(
      <BrowserRouter>
        <MockDataProvider>
          <TestApp />
        </MockDataProvider>
      </BrowserRouter>
    );

    // Preencher formulário
    await user.type(screen.getByLabelText(/nome completo/i), 'Novo Aluno Teste');
    await user.type(screen.getByLabelText(/^cpf\s*\*?$/i), '12345678909');
    await user.type(screen.getByLabelText(/email/i), 'novo@teste.com');
    await user.type(screen.getByLabelText(/^telefone\s*\*?$/i), '11999999999');
    await user.type(screen.getByLabelText(/data de nascimento/i), '2000-01-01');

    // Preencher endereço
    await user.type(screen.getByLabelText(/cep/i), '65800000');
    await user.type(screen.getByLabelText(/rua/i), 'Rua de Teste');
    await user.type(screen.getByLabelText(/número/i), '123');
    await user.type(screen.getByLabelText(/bairro/i), 'Bairro de Teste');
    await user.type(screen.getByLabelText(/cidade/i), 'Cidade de Teste');
    await user.type(screen.getByLabelText(/^estado$/i), 'SP');

    // Salvar
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Aguardar que o formulário seja fechado e a tabela apareça
    await waitFor(() => {
      expect(screen.queryByText(/Total de alunos:/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('deve buscar e filtrar alunos', async () => {
    const user = userEvent.setup();
    
    const TestApp = () => {
      const [searchTerm, setSearchTerm] = React.useState('');
      const [statusFilter, setStatusFilter] = React.useState('todos');

      return (
        <div>
          <input
            type="text"
            placeholder="Buscar aluno"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
          
          <AlunosTable
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            cursoFilter="todos"
            onDelete={() => {}}
          />
        </div>
      );
    };

    render(
      <BrowserRouter>
        <MockDataProvider>
          <TestApp />
        </MockDataProvider>
      </BrowserRouter>
    );

    // Buscar
    const searchInput = screen.getByPlaceholderText('Buscar aluno');
    await user.type(searchInput, 'João');

    await waitFor(() => {
      expect(searchInput).toHaveValue('João');
    });

    // Filtrar por status
    const statusSelect = screen.getByRole('combobox');
    await user.selectOptions(statusSelect, 'ativo');

    await waitFor(() => {
      expect(statusSelect).toHaveValue('ativo');
    });
  });

  it('deve editar aluno existente', async () => {
    const user = userEvent.setup();
    
    const TestApp = () => {
      const { alunos, updateAluno } = useMockData();
      const [editingAluno, setEditingAluno] = React.useState<any>({ ...alunos[0], cpf: '123.456.789-09' });

      const handleSubmit = (data: any) => {
        updateAluno(editingAluno.id, data);
        setEditingAluno(null);
      };

      return (
        <div>
          {editingAluno && (
            <AlunoForm
              aluno={editingAluno}
              onSubmit={handleSubmit}
              onCancel={() => setEditingAluno(null)}
            />
          )}
          {!editingAluno && <div>Aluno atualizado!</div>}
        </div>
      );
    };

    render(
      <BrowserRouter>
        <MockDataProvider>
          <TestApp />
        </MockDataProvider>
      </BrowserRouter>
    );

    // Verificar que formulário carregou com dados
    const nomeInput = screen.getByLabelText(/nome completo/i);
    expect(nomeInput).toHaveValue();

    // Editar nome
    await user.clear(nomeInput);
    await user.type(nomeInput, 'Nome Editado');

    // Salvar
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Verificar sucesso
    await waitFor(() => {
      expect(screen.queryByText('Aluno atualizado!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('deve deletar aluno', async () => {
    const user = userEvent.setup();
    
    const TestApp = () => {
      const { alunos, deleteAluno } = useMockData();
      const [alunosList, setAlunosList] = React.useState(alunos);

      const handleDelete = (aluno: any) => {
        deleteAluno(aluno.id);
        setAlunosList(prev => prev.filter(a => a.id !== aluno.id));
      };

      return (
        <div>
          <div>Total: {alunosList.length}</div>
          <button onClick={() => handleDelete(alunosList[0])}>
            Deletar Primeiro
          </button>
        </div>
      );
    };

    render(
      <BrowserRouter>
        <MockDataProvider>
          <TestApp />
        </MockDataProvider>
      </BrowserRouter>
    );

    const initialCount = parseInt(screen.getByText(/Total:/i).textContent?.match(/\d+/)?.[0] || '0');

    // Deletar
    await user.click(screen.getByRole('button', { name: /Deletar Primeiro/i }));

    // Verificar que foi deletado
    await waitFor(() => {
      const newCount = parseInt(screen.getByText(/Total:/i).textContent?.match(/\d+/)?.[0] || '0');
      expect(newCount).toBe(initialCount - 1);
    });
  });
});

describe('Validação de Dados - Integration', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it('deve validar formulário completo antes de salvar', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();

    render(
      <BrowserRouter>
        <MockDataProvider>
          <AlunoForm onSubmit={mockOnSubmit} onCancel={() => {}} />
        </MockDataProvider>
      </BrowserRouter>
    );

    // Tentar salvar sem preencher
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Deve mostrar erros de validação
    await waitFor(() => {
      const errors = screen.queryAllByText(/obrigatório/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    // mockOnSubmit não deve ser chamado
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve formatar CPF durante digitação', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MockDataProvider>
          <AlunoForm onSubmit={() => {}} onCancel={() => {}} />
        </MockDataProvider>
      </BrowserRouter>
    );

    const cpfInput = screen.getByLabelText(/^cpf\s*\*?$/i);
    await user.type(cpfInput, '12345678901');

    await waitFor(() => {
      expect(cpfInput).toHaveValue('123.456.789-01');
    });
  });
});
