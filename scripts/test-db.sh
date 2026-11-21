#!/usr/bin/env bash
# ============================================
# Testes de banco (RLS) contra Postgres real.
#
# Cria um banco descartável, aplica o stub do Supabase, todas as migrações
# em ordem e executa supabase/tests/rls_test.sql.
#
# Uso: PGHOST=127.0.0.1 PGPORT=5432 PGUSER=postgres PGPASSWORD=... npm run test:db
# Nunca aponte para um banco real: o banco TEST_DB é apagado e recriado.
# ============================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEST_DB="${TEST_DB:-sabiencia_rls_test}"
PSQL=(psql -X -q -v ON_ERROR_STOP=1)
# Mensagens do servidor em inglês para o filtro abaixo funcionar em qualquer locale
export PGOPTIONS="${PGOPTIONS:-} -c lc_messages=C"

if [[ "$TEST_DB" != *test* ]]; then
  echo "TEST_DB precisa conter 'test' no nome (recebido: $TEST_DB)" >&2
  exit 1
fi

"${PSQL[@]}" -d postgres -c "DROP DATABASE IF EXISTS \"$TEST_DB\"" -c "CREATE DATABASE \"$TEST_DB\"" >/dev/null 2>&1

run() {
  echo "→ $1"
  "${PSQL[@]}" -d "$TEST_DB" -o /dev/null -f "$ROOT/$1" 2> >(grep -vE 'NOTICE' >&2 || true)
}

run supabase/tests/00_supabase_auth_stub.sql
for f in "$ROOT"/supabase/migrations/*.sql; do
  run "supabase/migrations/$(basename "$f")"
done

echo "→ supabase/tests/rls_test.sql"
OUT="$("${PSQL[@]}" -d "$TEST_DB" -o /dev/null -f "$ROOT/supabase/tests/rls_test.sql" 2>&1)" || {
  echo "$OUT" | sed -E 's/^psql:[^ ]+ NOTICE: +//'
  exit 1
}
echo "$OUT" | sed -nE 's/.*NOTICE: +(ok - .*)/  \1/p'
PASSED="$(echo "$OUT" | grep -c 'ok - ' || true)"
echo
echo "$PASSED asserções de RLS passaram."

if [[ "${KEEP_TEST_DB:-}" != "1" ]]; then
  "${PSQL[@]}" -d postgres -c "DROP DATABASE IF EXISTS \"$TEST_DB\"" >/dev/null
fi
