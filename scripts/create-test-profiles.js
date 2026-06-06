const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const SUPABASE_URL = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1];
const SUPABASE_SERVICE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables. Please check .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createProfiles() {
  const testUsers = [
    {
      email: 'admin@sabiencia.com.br',
      nome: 'Administrador Sabiencia',
      cpf: '11111111111',
      role: 'gestor',
      telefone: '(11) 99999-9999'
    },
    {
      email: 'professor@sabiencia.com.br',
      nome: 'Professor Teste',
      cpf: '22222222222',
      role: 'professor',
      telefone: '(11) 98888-8888'
    },
    {
      email: 'aluno@sabiencia.com.br',
      nome: 'Aluno Teste',
      cpf: '33333333333',
      role: 'aluno',
      telefone: '(11) 97777-7777'
    }
  ];

  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    console.error('Error listing auth users:', error.message);
    process.exit(1);
  }

  const users = data?.users || [];

  for (const u of testUsers) {
    const authUser = users.find(x => x.email && x.email.toLowerCase() === u.email.toLowerCase());
    if (!authUser) {
      console.warn(`Auth user not found: ${u.email}`);
      continue;
    }
    const { data: existingProfile } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', u.email)
      .maybeSingle();
    if (existingProfile && existingProfile.id) {
      console.log(`Profile already exists: ${u.email}`);
      continue;
    }
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert({
        auth_id: authUser.id,
        email: u.email,
        nome: u.nome,
        cpf: u.cpf,
        role: u.role,
        telefone: u.telefone
      });
    if (insertError) {
      console.error(`Error creating profile for ${u.email}:`, insertError.message);
      process.exit(1);
    } else {
      console.log(`Profile created: ${u.email}`);
    }
  }
}

createProfiles()
  .then(() => console.log('Profiles creation completed.'))
  .catch((e) => {
    console.error('Failed:', e);
    process.exit(1);
  });
