#!/bin/bash

# ============================================
# AUDIT UNUSED CODE - Detecta código não usado
# ============================================

echo "🔍 AUDITORIA DE CÓDIGO NÃO USADO - Britos Educação"
echo "=================================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
total_components=0
unused_components=0
total_hooks=0
unused_hooks=0
total_utils=0
unused_utils=0

echo "📦 1. VERIFICANDO COMPONENTES NÃO USADOS..."
echo "-------------------------------------------"

# Verificar componentes em src/components
if [ -d "src/components" ]; then
  for file in $(find src/components -type f -name "*.tsx" ! -name "*.test.tsx"); do
    total_components=$((total_components + 1))
    filename=$(basename "$file" .tsx)
    
    # Buscar importações do componente
    imports=$(grep -r "import.*$filename" --include="*.tsx" --include="*.ts" --exclude="$file" src/ App.tsx 2>/dev/null | wc -l)
    
    if [ $imports -eq 0 ]; then
      echo -e "${RED}❌ NÃO USADO:${NC} $file"
      unused_components=$((unused_components + 1))
    fi
  done
fi

echo ""
echo "📎 2. VERIFICANDO HOOKS NÃO USADOS..."
echo "--------------------------------------"

# Verificar hooks em src/hooks
if [ -d "src/hooks" ]; then
  for file in $(find src/hooks -type f -name "*.ts" ! -name "*.test.ts"); do
    total_hooks=$((total_hooks + 1))
    filename=$(basename "$file" .ts)
    
    imports=$(grep -r "import.*$filename" --include="*.tsx" --include="*.ts" --exclude="$file" src/ App.tsx 2>/dev/null | wc -l)
    
    if [ $imports -eq 0 ]; then
      echo -e "${RED}❌ NÃO USADO:${NC} $file"
      unused_hooks=$((unused_hooks + 1))
    fi
  done
fi

echo ""
echo "🛠️  3. VERIFICANDO UTILITÁRIOS NÃO USADOS..."
echo "----------------------------------------------"

# Verificar utils em src/utils
if [ -d "src/utils" ]; then
  for file in $(find src/utils -type f -name "*.ts" -o -name "*.tsx" ! -name "*.test.ts"); do
    total_utils=$((total_utils + 1))
    filename=$(basename "$file" | sed 's/\.[^.]*$//')
    
    imports=$(grep -r "import.*$filename" --include="*.tsx" --include="*.ts" --exclude="$file" src/ App.tsx 2>/dev/null | wc -l)
    
    if [ $imports -eq 0 ]; then
      echo -e "${RED}❌ NÃO USADO:${NC} $file"
      unused_utils=$((unused_utils + 1))
    fi
  done
fi

echo ""
echo "📊 4. RESUMO DA AUDITORIA"
echo "========================="
echo ""

# Componentes
if [ $unused_components -eq 0 ]; then
  echo -e "${GREEN}✅ Componentes:${NC} $total_components analisados, ${GREEN}0 não usados${NC}"
else
  echo -e "${YELLOW}⚠️  Componentes:${NC} $total_components analisados, ${RED}$unused_components não usados${NC}"
fi

# Hooks
if [ $unused_hooks -eq 0 ]; then
  echo -e "${GREEN}✅ Hooks:${NC} $total_hooks analisados, ${GREEN}0 não usados${NC}"
else
  echo -e "${YELLOW}⚠️  Hooks:${NC} $total_hooks analisados, ${RED}$unused_hooks não usados${NC}"
fi

# Utils
if [ $unused_utils -eq 0 ]; then
  echo -e "${GREEN}✅ Utilitários:${NC} $total_utils analisados, ${GREEN}0 não usados${NC}"
else
  echo -e "${YELLOW}⚠️  Utilitários:${NC} $total_utils analisados, ${RED}$unused_utils não usados${NC}"
fi

echo ""

# Total
total_unused=$((unused_components + unused_hooks + unused_utils))

if [ $total_unused -eq 0 ]; then
  echo -e "${GREEN}🎉 EXCELENTE! Nenhum arquivo não usado encontrado.${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Total de arquivos potencialmente não usados: $total_unused${NC}"
  echo ""
  echo "💡 IMPORTANTE:"
  echo "   - Alguns arquivos podem ser usados apenas em demos ou testes"
  echo "   - Verifique manualmente antes de deletar"
  echo "   - Execute os testes após qualquer remoção: npm run test"
  echo ""
  exit 1
fi
