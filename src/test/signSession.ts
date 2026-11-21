// Assina uma sessão local como o AuthContext faz (HMAC-SHA256 com o
// VITE_AUTH_SECRET definido em src/vitest.config.ts). Use em testes que
// gravam 'sabiencia_auth_user' diretamente no localStorage.
export const signToken = async (token: unknown): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(import.meta.env.VITE_AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const buffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(JSON.stringify(token)));
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};
