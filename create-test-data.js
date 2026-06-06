const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const SUPABASE_SERVICE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables. Please check .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTestData() {
  try {
    console.log('Creating test data...');

    // Get the user IDs we created earlier
    const { data: adminUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', 'admin@britos.com.br')
      .single();

    const { data: professorUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', 'professor@britos.com.br')
      .single();

    const { data: alunoUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', 'aluno@britos.com.br')
      .single();

    // Create courses
    const { data: cursoEnfermagem } = await supabase
      .from('cursos')
      .insert({
        nome: 'Técnico em Enfermagem',
        descricao: 'Curso técnico completo em enfermagem com foco em práticas hospitalares',
        carga_horaria: 1200,
        duracao_meses: 18,
        valor_mensalidade: 450.00,
        ativo: true
      })
      .select()
      .single();

    const { data: cursoInformatica } = await supabase
      .from('cursos')
      .insert({
        nome: 'Técnico em Informática',
        descricao: 'Curso técnico em informática com ênfase em desenvolvimento de software',
        carga_horaria: 1000,
        duracao_meses: 12,
        valor_mensalidade: 380.00,
        ativo: true
      })
      .select()
      .single();

    console.log('Courses created');

    // Create classes/turmas
    const { data: turmaEnfermagem } = await supabase
      .from('turmas')
      .insert({
        curso_id: cursoEnfermagem.id,
        nome: 'Turma A - Enfermagem 2024',
        codigo: 'ENF-A-2024',
        periodo: '1º Período',
        turno: 'Manhã',
        data_inicio: '2024-01-15',
        data_fim: '2025-07-15',
        ativo: true
      })
      .select()
      .single();

    const { data: turmaInformatica } = await supabase
      .from('turmas')
      .insert({
        curso_id: cursoInformatica.id,
        nome: 'Turma A - Informática 2024',
        codigo: 'INF-A-2024',
        periodo: '1º Período',
        turno: 'Tarde',
        data_inicio: '2024-01-15',
        data_fim: '2025-01-15',
        ativo: true
      })
      .select()
      .single();

    console.log('Classes created');

    // Create disciplines
    const { data: disciplinaAnatomia } = await supabase
      .from('disciplinas')
      .insert({
        curso_id: cursoEnfermagem.id,
        nome: 'Anatomia Humana',
        codigo: 'ENF-001',
        carga_horaria: 80,
        ordem: 1
      })
      .select()
      .single();

    const { data: disciplinaFundEnf } = await supabase
      .from('disciplinas')
      .insert({
        curso_id: cursoEnfermagem.id,
        nome: 'Fundamentos de Enfermagem',
        codigo: 'ENF-002',
        carga_horaria: 120,
        ordem: 2
      })
      .select()
      .single();

    const { data: disciplinaProg } = await supabase
      .from('disciplinas')
      .insert({
        curso_id: cursoInformatica.id,
        nome: 'Programação I',
        codigo: 'INF-001',
        carga_horaria: 100,
        ordem: 1
      })
      .select()
      .single();

    console.log('Disciplines created');

    // Assign professor to disciplines
    await supabase
      .from('professor_disciplinas')
      .insert([
        {
          professor_id: professorUser.id,
          disciplina_id: disciplinaAnatomia.id,
          turma_id: turmaEnfermagem.id
        },
        {
          professor_id: professorUser.id,
          disciplina_id: disciplinaFundEnf.id,
          turma_id: turmaEnfermagem.id
        },
        {
          professor_id: professorUser.id,
          disciplina_id: disciplinaProg.id,
          turma_id: turmaInformatica.id
        }
      ]);

    console.log('Professor-discipline assignments created');

    // Enroll student in classes
    await supabase
      .from('matriculas')
      .insert([
        {
          aluno_id: alunoUser.id,
          turma_id: turmaEnfermagem.id,
          curso_id: cursoEnfermagem.id,
          status: 'ativo',
          data_matricula: '2024-01-10'
        },
        {
          aluno_id: alunoUser.id,
          turma_id: turmaInformatica.id,
          curso_id: cursoInformatica.id,
          status: 'ativo',
          data_matricula: '2024-01-10'
        }
      ]);

    console.log('Student enrollments created');

    // Create some grades
    await supabase
      .from('notas')
      .insert([
        {
          aluno_id: alunoUser.id,
          disciplina_id: disciplinaAnatomia.id,
          turma_id: turmaEnfermagem.id,
          tipo_avaliacao: 'Prova 1',
          nota: 8.5,
          peso: 1.0,
          data_avaliacao: '2024-02-15'
        },
        {
          aluno_id: alunoUser.id,
          disciplina_id: disciplinaAnatomia.id,
          turma_id: turmaEnfermagem.id,
          tipo_avaliacao: 'Trabalho 1',
          nota: 9.0,
          peso: 0.5,
          data_avaliacao: '2024-02-20'
        },
        {
          aluno_id: alunoUser.id,
          disciplina_id: disciplinaProg.id,
          turma_id: turmaInformatica.id,
          tipo_avaliacao: 'Prova 1',
          nota: 7.5,
          peso: 1.0,
          data_avaliacao: '2024-02-18'
        }
      ]);

    console.log('Grades created');

    // Create attendance records
    await supabase
      .from('frequencias')
      .insert([
        {
          aluno_id: alunoUser.id,
          disciplina_id: disciplinaAnatomia.id,
          turma_id: turmaEnfermagem.id,
          data: '2024-02-01',
          presente: true
        },
        {
          aluno_id: alunoUser.id,
          disciplina_id: disciplinaAnatomia.id,
          turma_id: turmaEnfermagem.id,
          data: '2024-02-05',
          presente: true
        },
        {
          aluno_id: alunoUser.id,
          disciplina_id: disciplinaAnatomia.id,
          turma_id: turmaEnfermagem.id,
          data: '2024-02-08',
          presente: false,
          justificado: true,
          observacao: 'Comparecimento médico'
        }
      ]);

    console.log('Attendance records created');

    // Create materials
    await supabase
      .from('materiais')
      .insert([
        {
          professor_id: professorUser.id,
          disciplina_id: disciplinaAnatomia.id,
          titulo: 'Apostila de Anatomia - Módulo 1',
          descricao: 'Material completo sobre sistema esquelético',
          tipo: 'pdf',
          url: 'https://example.com/materials/anatomia-modulo1.pdf',
          tags: ['anatomia', 'sistema-esquelético', 'módulo-1']
        },
        {
          professor_id: professorUser.id,
          disciplina_id: disciplinaProg.id,
          titulo: 'Vídeo Aula - Introdução à Programação',
          descricao: 'Conceitos básicos de lógica de programação',
          tipo: 'video',
          url: 'https://youtube.com/watch?v=abc123',
          tags: ['programação', 'lógica', 'introdução']
        }
      ]);

    console.log('Materials created');

    // Create communications
    await supabase
      .from('comunicados')
      .insert([
        {
          autor_id: adminUser.id,
          titulo: 'Boas Vindas - Início do Semestre',
          conteudo: 'Sejam bem-vindos ao novo semestre! As aulas começam dia 15/01.',
          prioridade: 'normal',
          destinatarios: ['todos'],
          fixado: true
        },
        {
          autor_id: professorUser.id,
          titulo: 'Aviso importante - Prova de Anatomia',
          conteudo: 'A prova de anatomia será dia 20/02. Estudem os capítulos 1 a 3.',
          prioridade: 'alta',
          destinatarios: ['ENF-A-2024'],
          fixado: false
        }
      ]);

    console.log('Communications created');

    // Create observations
    await supabase
      .from('observacoes')
      .insert([
        {
          aluno_id: alunoUser.id,
          autor_id: professorUser.id,
          tipo: 'pedagogica',
          prioridade: 'normal',
          texto: 'Aluno demonstra bom desempenho nas aulas práticas',
          visivel_para: 'equipe'
        }
      ]);

    console.log('Observations created');

    // Create topics for video lessons
    const { data: topicoAnatomia } = await supabase
      .from('topicos')
      .insert({
        disciplina_id: disciplinaAnatomia.id,
        titulo: 'Sistema Esquelético',
        descricao: 'Estudo dos ossos e articulações',
        ordem: 1
      })
      .select()
      .single();

    const { data: topicoProg } = await supabase
      .from('topicos')
      .insert({
        disciplina_id: disciplinaProg.id,
        titulo: 'Introdução à Programação',
        descricao: 'Conceitos básicos de programação',
        ordem: 1
      })
      .select()
      .single();

    console.log('Topics created');

    // Create video lessons
    await supabase
      .from('videoaulas')
      .insert([
        {
          topico_id: topicoAnatomia.id,
          titulo: 'Aula 1 - Estrutura dos Ossos',
          descricao: 'Introdução à anatomia dos ossos',
          youtube_url: 'https://youtube.com/watch?v=osso123',
          duracao: 45,
          ordem: 1,
          professor_id: professorUser.id
        },
        {
          topico_id: topicoProg.id,
          titulo: 'Aula 1 - O que é Programação?',
          descricao: 'Conceitos fundamentais de programação',
          youtube_url: 'https://youtube.com/watch?v=prog123',
          duracao: 30,
          ordem: 1,
          professor_id: professorUser.id
        }
      ]);

    console.log('Video lessons created');

    // Create payment records
    await supabase
      .from('pagamentos')
      .insert([
        {
          aluno_id: alunoUser.id,
          matricula_id: (await supabase.from('matriculas').select('id').eq('aluno_id', alunoUser.id).eq('curso_id', cursoEnfermagem.id).single()).data.id,
          valor: 450.00,
          status: 'pago',
          forma_pagamento: 'cartão',
          data_vencimento: '2024-01-10',
          data_pagamento: '2024-01-05',
          numero_parcela: 1,
          total_parcelas: 18
        },
        {
          aluno_id: alunoUser.id,
          matricula_id: (await supabase.from('matriculas').select('id').eq('aluno_id', alunoUser.id).eq('curso_id', cursoInformatica.id).single()).data.id,
          valor: 380.00,
          status: 'pendente',
          forma_pagamento: 'boleto',
          data_vencimento: '2024-02-10',
          numero_parcela: 2,
          total_parcelas: 12
        }
      ]);

    console.log('Payment records created');

    console.log('\n✅ Test data creation completed successfully!');
    console.log('\nTest data summary:');
    console.log('- 2 Courses created');
    console.log('- 2 Classes created');
    console.log('- 3 Disciplines created');
    console.log('- Professor assigned to disciplines');
    console.log('- Student enrolled in classes');
    console.log('- Grades, attendance, materials, communications created');
    console.log('- Video lessons and topics created');
    console.log('- Payment records created');

  } catch (error) {
    console.error('Error creating test data:', error);
  }
}

createTestData();