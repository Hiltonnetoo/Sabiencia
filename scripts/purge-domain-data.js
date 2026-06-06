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

async function purge() {
  const tables = [
    'chat_lives',
    'lives',
    'progresso_videoaulas',
    'videoaulas',
    'topicos',
    'observacoes',
    'notificacoes',
    'pagamentos',
    'frequencias',
    'notas',
    'professor_disciplinas',
    'matriculas',
    'comunicados',
    'materiais',
    'turmas',
    'disciplinas',
    'cursos',
    'usuarios'
  ];

  for (const t of tables) {
    const { error } = await supabase.from(t).delete().not('id', 'is', null);
    if (error) {
      console.error(`Error purging ${t}:`, error.message);
      process.exit(1);
    } else {
      console.log(`Purged: ${t}`);
    }
  }
}

purge().then(() => {
  console.log('Domain tables purged successfully.');
}).catch((e) => {
  console.error('Purge failed:', e);
  process.exit(1);
});