// ============================================
// LOGIN DEBUG - Página de debug do login
// ============================================

import React, { useState } from 'react';
import { mockUsers } from '../../data/mockUsers';
import { mockData } from '../../data/mockData';

export const LoginDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];
    
    // Teste 1: Verificar se mockUsers está carregado
    results.push(`✅ mockUsers carregado: ${mockUsers.length} usuários`);
    
    // Teste 2: Listar usuários
    mockUsers.forEach(user => {
      results.push(`  - ${user.role}: CPF ${user.cpf} | Senha: ${user.senha}`);
    });
    
    // Teste 3: Verificar mockData
    results.push(`✅ mockData carregado:`);
    results.push(`  - ${mockData.alunos.length} alunos`);
    results.push(`  - ${mockData.professores.length} professores`);
    results.push(`  - ${mockData.gestores.length} gestores`);
    
    // Teste 4: Tentar login manual
    const testCPF = '000.000.000-01';
    const testSenha = 'gestor123';
    const found = mockUsers.find(u => u.cpf === testCPF && u.senha === testSenha);
    
    if (found) {
      results.push(`✅ Login teste PASSOU: ${testCPF} encontrado como ${found.role}`);
      
      // Verificar se o gestor existe no mockData
      const gestor = mockData.gestores.find(g => g.id === found.user_id);
      if (gestor) {
        results.push(`✅ Dados do gestor encontrados: ${gestor.nome_completo}`);
      } else {
        results.push(`❌ ERRO: Gestor ${found.user_id} NÃO encontrado no mockData`);
      }
    } else {
      results.push(`❌ Login teste FALHOU: ${testCPF} NÃO encontrado`);
    }
    
    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            🔍 Debug do Sistema de Login
          </h1>
          
          <button
            onClick={runTests}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-6"
          >
            Executar Testes
          </button>

          {testResults.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="text-gray-800">
                  {result}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-bold mb-4">Credenciais de Teste</h2>
            <div className="grid gap-4">
              {mockUsers.map((user, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-bold text-blue-900 mb-2">
                    {user.role.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-700">
                    <div>CPF: <span className="font-mono">{user.cpf}</span></div>
                    <div>Senha: <span className="font-mono">{user.senha}</span></div>
                    <div>ID: <span className="font-mono text-xs">{user.user_id}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
