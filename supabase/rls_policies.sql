-- RLS e RPC para tabela de usuários

-- Habilitar RLS
alter table if exists public.usuarios enable row level security;

-- Política: usuários autenticados podem selecionar seu próprio perfil
create policy if not exists "select own profile"
on public.usuarios
as permissive
for select
to authenticated
using (
  (exists (select 1 where public.usuarios.auth_id = auth.uid()))
  or (public.usuarios.email = (auth.jwt() ->> 'email'))
);

-- Política: usuários autenticados podem atualizar seu próprio perfil
create policy if not exists "update own profile"
on public.usuarios
as permissive
for update
to authenticated
using (
  (exists (select 1 where public.usuarios.auth_id = auth.uid()))
  or (public.usuarios.email = (auth.jwt() ->> 'email'))
)
with check (
  (exists (select 1 where public.usuarios.auth_id = auth.uid()))
  or (public.usuarios.email = (auth.jwt() ->> 'email'))
);

-- Função RPC para obter e‑mail via CPF (apenas retorna e‑mail)
create or replace function public.get_email_by_cpf(cpf text)
returns text
language sql
security definer
stable
as $$
  select email from public.usuarios where public.usuarios.cpf = cpf limit 1;
$$;

-- Permitir execução da função para anon e authenticated
grant execute on function public.get_email_by_cpf(text) to anon, authenticated;

-- Observações:
-- - As políticas assumem existência de coluna auth_id (vinculada ao auth.users.id). Caso não exista,
--   a verificação por e‑mail via JWT cobre leitura/atualização do próprio registro.
-- - A função RPC limita o retorno a um único campo (email), adequado ao fluxo de login por CPF.