#!/usr/bin/env node

// ============================================
// AUDIT UNUSED CODE - Detecta código não usado
// ============================================

const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log('🔍 AUDITORIA DE CÓDIGO NÃO USADO - Sabiencia');
console.log('==================================================\n');

// Funções auxiliares
function getAllFiles(dir, fileList = [], extensions = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList, extensions);
    } else {
      const ext = path.extname(file);
      if (extensions.length === 0 || extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function searchInFiles(searchTerm, files) {
  let count = 0;

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes(searchTerm)) {
        count++;
      }
    } catch (err) {
      // Ignora erros de leitura
    }
  });

  return count;
}

function getFileName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

// Coletar todos os arquivos do projeto
const allSourceFiles = [
  ...getAllFiles('src', [], ['.ts', '.tsx']),
  ...getAllFiles('.', [], ['.tsx']).filter(f => f.includes('App.tsx'))
];

// Auditoria
const results = {
  components: { total: 0, unused: [] },
  hooks: { total: 0, unused: [] },
  utils: { total: 0, unused: [] },
};

console.log('📦 1. VERIFICANDO COMPONENTES NÃO USADOS...');
console.log('-------------------------------------------');

// Componentes
const componentFiles = getAllFiles('src/components', [], ['.tsx'])
  .filter(f => !f.includes('.test.tsx'));

componentFiles.forEach(file => {
  results.components.total++;
  const fileName = getFileName(file);
  
  // Buscar importações do componente
  const importPattern = new RegExp(`import.*${fileName}`, 'g');
  const otherFiles = allSourceFiles.filter(f => f !== file);
  
  let found = false;
  for (const searchFile of otherFiles) {
    try {
      const content = fs.readFileSync(searchFile, 'utf8');
      if (importPattern.test(content)) {
        found = true;
        break;
      }
    } catch (err) {
      // Ignora erros
    }
  }
  
  if (!found) {
    console.log(`${colors.red}❌ NÃO USADO:${colors.reset} ${file}`);
    results.components.unused.push(file);
  }
});

console.log('\n📎 2. VERIFICANDO HOOKS NÃO USADOS...');
console.log('--------------------------------------');

// Hooks
const hookFiles = getAllFiles('src/hooks', [], ['.ts'])
  .filter(f => !f.includes('.test.ts'));

hookFiles.forEach(file => {
  results.hooks.total++;
  const fileName = getFileName(file);
  
  const importPattern = new RegExp(`import.*${fileName}`, 'g');
  const otherFiles = allSourceFiles.filter(f => f !== file);
  
  let found = false;
  for (const searchFile of otherFiles) {
    try {
      const content = fs.readFileSync(searchFile, 'utf8');
      if (importPattern.test(content)) {
        found = true;
        break;
      }
    } catch (err) {
      // Ignora erros
    }
  }
  
  if (!found) {
    console.log(`${colors.red}❌ NÃO USADO:${colors.reset} ${file}`);
    results.hooks.unused.push(file);
  }
});

console.log('\n🛠️  3. VERIFICANDO UTILITÁRIOS NÃO USADOS...');
console.log('----------------------------------------------');

// Utils
const utilFiles = getAllFiles('src/utils', [], ['.ts', '.tsx'])
  .filter(f => !f.includes('.test.ts') && !f.includes('.test.tsx'));

utilFiles.forEach(file => {
  results.utils.total++;
  const fileName = getFileName(file);
  
  const importPattern = new RegExp(`import.*${fileName}`, 'g');
  const otherFiles = allSourceFiles.filter(f => f !== file);
  
  let found = false;
  for (const searchFile of otherFiles) {
    try {
      const content = fs.readFileSync(searchFile, 'utf8');
      if (importPattern.test(content)) {
        found = true;
        break;
      }
    } catch (err) {
      // Ignora erros
    }
  }
  
  if (!found) {
    console.log(`${colors.red}❌ NÃO USADO:${colors.reset} ${file}`);
    results.utils.unused.push(file);
  }
});

// Resumo
console.log('\n📊 4. RESUMO DA AUDITORIA');
console.log('=========================\n');

const printSummary = (category, data) => {
  if (data.unused.length === 0) {
    console.log(`${colors.green}✅ ${category}:${colors.reset} ${data.total} analisados, ${colors.green}0 não usados${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  ${category}:${colors.reset} ${data.total} analisados, ${colors.red}${data.unused.length} não usados${colors.reset}`);
  }
};

printSummary('Componentes', results.components);
printSummary('Hooks', results.hooks);
printSummary('Utilitários', results.utils);

console.log('');

const totalUnused = results.components.unused.length + 
                    results.hooks.unused.length + 
                    results.utils.unused.length;

if (totalUnused === 0) {
  console.log(`${colors.green}🎉 EXCELENTE! Nenhum arquivo não usado encontrado.${colors.reset}`);
  process.exit(0);
} else {
  console.log(`${colors.yellow}⚠️  Total de arquivos potencialmente não usados: ${totalUnused}${colors.reset}\n`);
  console.log('💡 IMPORTANTE:');
  console.log('   - Alguns arquivos podem ser usados apenas em demos ou testes');
  console.log('   - Verifique manualmente antes de deletar');
  console.log('   - Execute os testes após qualquer remoção: npm run test');
  console.log('');
  
  // Salvar relatório
  const report = {
    date: new Date().toISOString(),
    summary: {
      components: results.components,
      hooks: results.hooks,
      utils: results.utils,
      total_unused: totalUnused
    }
  };
  
  fs.writeFileSync(
    'audit-report.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log(`📄 Relatório detalhado salvo em: ${colors.blue}audit-report.json${colors.reset}\n`);
  
  process.exit(1);
}
