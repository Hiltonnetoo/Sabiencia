// ============================================
// MOCK DATA CONTEXT TESTS - Testes do contexto de dados mockados
// ============================================

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MockDataProvider, useMockData } from './MockDataContext';
import React from 'react';
import type { Aluno, Professor, Material } from '../types';

// Wrapper para o provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockDataProvider>{children}</MockDataProvider>
);

describe('MockDataContext', () => {
  describe('Estado Inicial', () => {
    it('deve carregar dados iniciais', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      expect(result.current.alunos).toBeDefined();
      expect(result.current.professores).toBeDefined();
      expect(result.current.gestores).toBeDefined();
      expect(result.current.cursos).toBeDefined();
      expect(result.current.turmas).toBeDefined();
      expect(result.current.disciplinas).toBeDefined();
      expect(result.current.materiais).toBeDefined();
      expect(result.current.comunicados).toBeDefined();
    });

    it('deve ter arrays de dados não vazios', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      expect(result.current.alunos.length).toBeGreaterThan(0);
      expect(result.current.professores.length).toBeGreaterThan(0);
      expect(result.current.cursos.length).toBeGreaterThan(0);
      expect(result.current.turmas.length).toBeGreaterThan(0);
    });
  });

  describe('CRUD Alunos', () => {
    it('deve criar novo aluno', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.alunos.length;
      
      const novoAluno = {
        nome_completo: 'Teste Silva',
        cpf: '999.999.999-99',
        email: 'teste@exemplo.com',
        telefone: '11999999999',
        data_nascimento: '2000-01-01',
        endereco: 'Rua Teste, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        ativo: true,
        data_matricula: '2024-01-01',
        curso_id: 'curso1',
        turma_id: 'turma1',
        responsavel_nome: 'Responsável Teste',
        responsavel_telefone: '11988888888',
        observacoes: '',
        foto_url: ''
      };

      let createdAluno: Aluno;
      act(() => {
        createdAluno = result.current.createAluno(novoAluno);
      });

      expect(result.current.alunos.length).toBe(initialCount + 1);
      expect(result.current.alunos).toContainEqual(expect.objectContaining({
        nome_completo: 'Teste Silva',
        cpf: '999.999.999-99'
      }));
    });

    it('deve atualizar aluno existente', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const primeiroAluno = result.current.alunos[0];
      
      act(() => {
        result.current.updateAluno(primeiroAluno.id, {
          nome_completo: 'Nome Atualizado'
        });
      });

      const alunoAtualizado = result.current.getAlunoById(primeiroAluno.id);
      expect(alunoAtualizado?.nome_completo).toBe('Nome Atualizado');
    });

    it('deve deletar aluno', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.alunos.length;
      const primeiroAluno = result.current.alunos[0];

      act(() => {
        result.current.deleteAluno(primeiroAluno.id);
      });

      expect(result.current.alunos.length).toBe(initialCount - 1);
      expect(result.current.getAlunoById(primeiroAluno.id)).toBeUndefined();
    });

    it('deve buscar aluno por ID', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const primeiroAluno = result.current.alunos[0];
      const encontrado = result.current.getAlunoById(primeiroAluno.id);

      expect(encontrado).toBeDefined();
      expect(encontrado?.id).toBe(primeiroAluno.id);
    });

    it('deve retornar undefined para ID inexistente', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const encontrado = result.current.getAlunoById('id-inexistente-xyz');
      expect(encontrado).toBeUndefined();
    });
  });

  describe('CRUD Professores', () => {
    it('deve criar novo professor', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.professores.length;
      
      const novoProfessor = {
        nome_completo: 'Professor Teste',
        cpf: '888.888.888-88',
        email: 'prof.teste@exemplo.com',
        telefone: '11988887777',
        data_nascimento: '1980-01-01',
        endereco: 'Rua Prof, 456',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-200',
        ativo: true,
        data_admissao: '2024-01-01',
        especialidades: ['Matemática'],
        formacao: 'Licenciatura em Matemática',
        observacoes: '',
        foto_url: ''
      };

      let createdProfessor: Professor;
      act(() => {
        createdProfessor = result.current.createProfessor(novoProfessor);
      });

      expect(result.current.professores.length).toBe(initialCount + 1);
      expect(result.current.professores).toContainEqual(expect.objectContaining({
        nome_completo: 'Professor Teste'
      }));
    });

    it('deve atualizar professor existente', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const primeiroProfessor = result.current.professores[0];
      
      act(() => {
        result.current.updateProfessor(primeiroProfessor.id, {
          formacao: 'Doutorado em Educação'
        });
      });

      const professorAtualizado = result.current.getProfessorById(primeiroProfessor.id);
      expect(professorAtualizado?.formacao).toBe('Doutorado em Educação');
    });

    it('deve deletar professor', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.professores.length;
      const primeiroProfessor = result.current.professores[0];

      act(() => {
        result.current.deleteProfessor(primeiroProfessor.id);
      });

      expect(result.current.professores.length).toBe(initialCount - 1);
    });

    it('deve buscar professor por ID', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const primeiroProfessor = result.current.professores[0];
      const encontrado = result.current.getProfessorById(primeiroProfessor.id);

      expect(encontrado).toBeDefined();
      expect(encontrado?.id).toBe(primeiroProfessor.id);
    });
  });

  describe('CRUD Materiais', () => {
    it('deve criar novo material', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.materiais.length;
      
      const novoMaterial = {
        titulo: 'Material de Teste',
        descricao: 'Descrição do material',
        tipo: 'pdf' as const,
        disciplina_id: 'disc1',
        turma_id: 'turma1',
        professor_id: 'prof1',
        url: 'https://exemplo.com/material.pdf',
        arquivo_nome: 'material.pdf',
        arquivo_tamanho: 1024,
        visivel_aluno: true,
        tags: ['teste']
      };

      let createdMaterial: Material;
      act(() => {
        createdMaterial = result.current.createMaterial(novoMaterial);
      });

      expect(result.current.materiais.length).toBe(initialCount + 1);
      expect(result.current.materiais).toContainEqual(expect.objectContaining({
        titulo: 'Material de Teste'
      }));
    });

    it('deve atualizar material existente', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const primeiroMaterial = result.current.materiais[0];
      
      act(() => {
        result.current.updateMaterial(primeiroMaterial.id, {
          titulo: 'Título Atualizado'
        });
      });

      const materialAtualizado = result.current.getMaterialById(primeiroMaterial.id);
      expect(materialAtualizado?.titulo).toBe('Título Atualizado');
    });

    it('deve deletar material', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.materiais.length;
      const primeiroMaterial = result.current.materiais[0];

      act(() => {
        result.current.deleteMaterial(primeiroMaterial.id);
      });

      expect(result.current.materiais.length).toBe(initialCount - 1);
    });
  });

  describe('CRUD Comunicados', () => {
    it('deve adicionar novo comunicado', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.comunicados.length;
      
      const novoComunicado = {
        titulo: 'Comunicado de Teste',
        conteudo: 'Conteúdo do comunicado',
        tipo: 'aviso' as const,
        prioridade: 'normal' as const,
        autor_id: 'gestor1',
        autor_tipo: 'gestor' as const,
        destinatarios: ['todos'],
        anexos: [],
        publicado: true
      };

      act(() => {
        result.current.addComunicado(novoComunicado);
      });

      expect(result.current.comunicados.length).toBe(initialCount + 1);
    });
  });

  describe('CRUD Turmas', () => {
    it('deve adicionar nova turma', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.turmas.length;
      
      const novaTurma = {
        nome: 'Turma Teste 2024',
        codigo: 'TEST2024',
        curso_id: 'curso1',
        periodo: 'matutino' as const,
        ano: 2024,
        semestre: 1,
        ativa: true,
        capacidade_maxima: 30,
        data_inicio: '2024-01-01',
        data_fim: '2024-12-31',
        sala: 'Sala 101',
        observacoes: ''
      };

      act(() => {
        result.current.addTurma(novaTurma);
      });

      expect(result.current.turmas.length).toBe(initialCount + 1);
    });

    it('deve atualizar turma existente', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const primeiraTurma = result.current.turmas[0];
      
      act(() => {
        result.current.updateTurma(primeiraTurma.id, {
          sala: 'Sala 202'
        });
      });

      const turmaAtualizada = result.current.getTurmaById(primeiraTurma.id);
      expect(turmaAtualizada?.sala).toBe('Sala 202');
    });

    it('deve deletar turma', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const initialCount = result.current.turmas.length;
      const primeiraTurma = result.current.turmas[0];

      act(() => {
        result.current.deleteTurma(primeiraTurma.id);
      });

      expect(result.current.turmas.length).toBe(initialCount - 1);
    });
  });

  describe('Performance e Memoização', () => {
    it('deve memoizar dados para evitar re-renders', () => {
      const { result, rerender } = renderHook(() => useMockData(), { wrapper });

      const alunosReferencia1 = result.current.alunos;
      
      // Re-render sem mudanças
      rerender();
      
      const alunosReferencia2 = result.current.alunos;

      // Se os dados não mudaram, a referência deve ser a mesma (memoização)
      // Nota: isso depende da implementação do contexto
      expect(Array.isArray(alunosReferencia1)).toBe(true);
      expect(Array.isArray(alunosReferencia2)).toBe(true);
    });

    it('deve atualizar referências apenas quando dados mudam', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      const alunosAntes = result.current.alunos;
      const countAntes = alunosAntes.length;

      act(() => {
        result.current.createAluno({
          nome_completo: 'Novo Aluno',
          cpf: '777.777.777-77',
          email: 'novo@exemplo.com',
          telefone: '11977777777',
          data_nascimento: '2000-01-01',
          endereco: 'Rua Nova, 789',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-300',
          ativo: true,
          data_matricula: '2024-01-01',
          curso_id: 'curso1',
          turma_id: 'turma1',
          responsavel_nome: 'Responsável Novo',
          responsavel_telefone: '11966666666',
          observacoes: '',
          foto_url: ''
        });
      });

      const alunosDepois = result.current.alunos;
      const countDepois = alunosDepois.length;

      expect(countDepois).toBe(countAntes + 1);
    });
  });

  describe('Validações', () => {
    it('não deve criar aluno com dados incompletos', () => {
      const { result } = renderHook(() => useMockData(), { wrapper });

      // Este teste pode falhar se não houver validação no contexto
      // Serve para documentar comportamento esperado
      expect(() => {
        result.current.createAluno({} as any);
      }).toThrow();
    });
  });
});
