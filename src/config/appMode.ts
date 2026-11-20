// ============================================
// APP MODE - Configuração do modo de execução
// 'demo'     -> Execução local no navegador, dados persistidos no localStorage, zero dependência de rede
// 'supabase' -> Integração real com backend Supabase (autenticação JWT, Postgres, RLS)
// ============================================

export type AppMode = 'demo' | 'supabase';

/**
 * Resolve o modo de execução da aplicação:
 * 1. `VITE_APP_MODE` explícito ('demo' | 'supabase')
 * 2. Compatibilidade legada: `VITE_DEMO_MODE === 'true'` ativa 'demo'
 * 3. Fallback inteligente: se não há credenciais do Supabase configuradas, assume 'demo'
 */
export const getAppMode = (): AppMode => {
  const explicit = (import.meta.env.VITE_APP_MODE || '').toLowerCase().trim();
  if (explicit === 'demo' || explicit === 'supabase') {
    return explicit;
  }

  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    return 'demo';
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const hasRealCredentials = Boolean(
    supabaseUrl &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseKey &&
    supabaseKey !== 'placeholder_key'
  );

  return hasRealCredentials ? 'supabase' : 'demo';
};

export const isDemoMode = (): boolean => getAppMode() === 'demo';
export const isSupabaseMode = (): boolean => getAppMode() === 'supabase';
