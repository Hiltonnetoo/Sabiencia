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

async function createTestUsers() {
  try {
    console.log('Creating test users...');

    // Test users data
    const testUsers = [
      {
        email: 'admin@britos.com.br',
        password: 'admin123',
        userData: {
          nome: 'Administrador Britos',
          cpf: '11111111111',
          role: 'gestor',
          telefone: '(11) 99999-9999'
        }
      },
      {
        email: 'professor@britos.com.br',
        password: 'prof123',
        userData: {
          nome: 'Professor Teste',
          cpf: '22222222222',
          role: 'professor',
          telefone: '(11) 98888-8888'
        }
      },
      {
        email: 'aluno@britos.com.br',
        password: 'aluno123',
        userData: {
          nome: 'Aluno Teste',
          cpf: '33333333333',
          role: 'aluno',
          telefone: '(11) 97777-7777'
        }
      }
    ];

    for (const user of testUsers) {
      console.log(`Creating user: ${user.email}`);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError);
        continue;
      }

      console.log(`Auth user created: ${authData.user.id}`);

      // Create profile in usuarios table
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert({
          auth_id: authData.user.id,
          email: user.email,
          ...user.userData
        });

      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError);
        // Rollback auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
      } else {
        console.log(`Profile created for: ${user.email}`);
      }
    }

    console.log('Test users creation completed!');
    console.log('\nTest users:');
    console.log('Admin - admin@britos.com.br / admin123');
    console.log('Professor - professor@britos.com.br / prof123');
    console.log('Aluno - aluno@britos.com.br / aluno123');

  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

createTestUsers();