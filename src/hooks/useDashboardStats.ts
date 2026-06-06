import { useMemo } from 'react';
import { useMockData } from '../contexts/MockDataContext';
import { calculateFrequenciaPercentual } from '../utils/calculations';

export function useDashboardStats() {
  const { alunos, professores, turmas, matriculas, pagamentos, frequencias, comunicados } = useMockData();

  const estatisticas = useMemo(() => {
    const totalAlunos = alunos.filter((a) => a.ativo).length;
    const totalProfessores = professores.filter((p) => p.ativo).length;
    const totalTurmas = turmas.filter((t) => t.ativa).length;

    const alunosAtivos = matriculas.filter((m) => m.status === 'ativo').length;
    const mesAtual = new Date();
    const novosAlunosMes = alunos.filter((a) => {
      const criacao = new Date(a.created_at);
      return (
        criacao.getMonth() === mesAtual.getMonth() &&
        criacao.getFullYear() === mesAtual.getFullYear()
      );
    }).length;

    const pagamentosVencidos = pagamentos.filter((p) => p.status === 'vencido').length;
    const totalReceber = pagamentos
      .filter((p) => p.status === 'pendente' || p.status === 'vencido')
      .reduce((acc, p) => acc + p.valor, 0);

    const frequenciaGeral = calculateFrequenciaPercentual(frequencias);

    return {
      totalAlunos,
      totalProfessores,
      totalTurmas,
      alunosAtivos,
      novosAlunosMes,
      pagamentosVencidos,
      totalReceber,
      frequenciaGeral,
    };
  }, [alunos, professores, turmas, matriculas, pagamentos, frequencias]);

  const ultimasMatriculas = useMemo(
    () =>
      [...matriculas]
        .sort(
          (a, b) =>
            new Date(b.data_matricula).getTime() - new Date(a.data_matricula).getTime()
        )
        .slice(0, 5),
    [matriculas]
  );

  const ultimosComunicados = useMemo(
    () =>
      [...comunicados]
        .sort(
          (a, b) =>
            new Date(b.data_envio).getTime() - new Date(a.data_envio).getTime()
        )
        .slice(0, 3),
    [comunicados]
  );

  return { estatisticas, ultimasMatriculas, ultimosComunicados, alunos, turmas };
}
