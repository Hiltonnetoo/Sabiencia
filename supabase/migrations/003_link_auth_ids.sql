alter table if exists public.usuarios add column if not exists auth_id uuid;
update public.usuarios u set auth_id = au.id from auth.users au where lower(u.email) = lower(au.email) and (u.auth_id is null or u.auth_id <> au.id);
create index if not exists idx_usuarios_auth_id on public.usuarios(auth_id);