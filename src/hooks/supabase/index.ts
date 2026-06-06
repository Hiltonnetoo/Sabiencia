// ============================================
// SUPABASE INDEX
// Exporta todos os serviços e hooks do Supabase
// ============================================

// Cliente Supabase
export { supabase } from '../lib/supabase';

// Serviços de dados
export * from '../services/supabaseData';

// Hooks de dados
export * from './useSupabaseData';

// Tipos
export type * from '../types';