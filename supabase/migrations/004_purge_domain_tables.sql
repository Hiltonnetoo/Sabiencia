begin;

-- Opcional: desabilitar RLS temporariamente para garantir operações administrativas
alter table if exists public.usuarios disable row level security;

-- Purga completa das tabelas do domínio (reinicia IDs e remove dependências)
truncate table
  public.chat_lives,
  public.lives,
  public.progresso_videoaulas,
  public.videoaulas,
  public.topicos,
  public.observacoes,
  public.notificacoes,
  public.pagamentos,
  public.frequencias,
  public.notas,
  public.professor_disciplinas,
  public.matriculas,
  public.comunicados,
  public.materiais,
  public.turmas,
  public.disciplinas,
  public.cursos,
  public.usuarios
restart identity cascade;

-- Reabilitar RLS
alter table if exists public.usuarios enable row level security;

commit;