# Scripts Utilitários do Supabase

Arquivos neste diretório são utilitários manuais e ferramentas administrativas.
Eles foram intencionalmente separados do diretório `supabase/migrations/` para não fazerem parte do fluxo normal de migrações automáticas de evolução contínua.

## Scripts

### `purge_dev_data.sql`
> ⚠️ **ATENÇÃO: OPERAÇÃO DESTRUTIVA**
>
> Executa a limpeza e reset com `TRUNCATE ... RESTART IDENTITY CASCADE` de todas as 18 tabelas de domínio do banco de dados.
> **Nunca execute este script em ambiente de produção ou homologação compartilhada.**
> Use apenas em bancos locais/descartáveis durante desenvolvimento inicial.
