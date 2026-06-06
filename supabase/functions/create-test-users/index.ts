// ============================================
// CRIAR USUÁRIOS DE TESTE NO SUPABASE AUTH
// Script para criar usuários de teste via API
// ============================================

// IMPORTANTE: Este script deve ser executado manualmente via console
// ou via Edge Function no Supabase

const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key';

// Função para criar usuário de teste
async function createTestUser(email: string, password: string, userData: any) {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: userData
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar usuário: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Usuário criado com sucesso: ${email}`);
    return data;
  } catch (error) {
    console.error(`Erro ao criar usuário ${email}:`, error);
    return null;
  }
}

// Dados dos usuários de teste
const testUsers = [
  {
    email: 'admin@britos.edu.br',
    password: 'Admin@2024',
    userData: {
      role: 'gestor',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      nome: 'Administrador Teste'
    }
  },
  {
    email: 'professor@britos.edu.br',
    password: 'Professor@2024',
    userData: {
      role: 'professor',
      user_id: '550e8400-e29b-41d4-a716-446655440002',
      nome: 'Professor Teste'
    }
  },
  {
    email: 'aluno@britos.edu.br',
    password: 'Aluno@2024',
    userData: {
      role: 'aluno',
      user_id: '550e8400-e29b-41d4-a716-446655440004',
      nome: 'Aluno Teste',
      turma_id: '550e8400-e29b-41d4-a716-446655440003'
    }
  }
];

// Função para criar todos os usuários de teste
async function createAllTestUsers() {
  console.log('Iniciando criação de usuários de teste...');
  
  for (const user of testUsers) {
    await createTestUser(user.email, user.password, user.userData);
    // Aguardar um pouco entre as requisições para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Criação de usuários de teste concluída!');
}

// Executar
// createAllTestUsers();

// Exportar para uso em Edge Functions
export { createTestUser, createAllTestUsers, testUsers };