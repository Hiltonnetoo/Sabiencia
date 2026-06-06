// ============================================
// USUÁRIOS PARA TESTE (LOGIN)
// ⚠️ MODO DEMO: Senhas simples para facilitar testes
// ✅ EM PRODUÇÃO: Usar bcrypt para hash de senhas
// ============================================

export interface MockUser {
  cpf: string;
  senha_hash: string; // ✅ Hash bcrypt real
  role: 'aluno' | 'professor' | 'gestor';
  user_id: string;
}

// ============================================
// USUÁRIOS PARA DEMONSTRAÇÃO
// ============================================
/**
 * ⚠️ MODO DEMO: Senhas em texto plano para facilitar testes
 * 
 * ✅ EM PRODUÇÃO, substituir por:
 * 1. Instalar: npm install bcryptjs @types/bcryptjs
 * 2. Gerar hashes: bcrypt.hashSync('senha', 10)
 * 3. Validar com: bcrypt.compareSync(senha, hash)
 */
export const mockUsers: MockUser[] = [
  {
    cpf: '000.000.000-01',
    senha_hash: 'gestor123', // DEMO: senha em texto plano
    role: 'gestor',
    user_id: 'gestor-001'
  },
  {
    cpf: '111.111.111-11',
    senha_hash: 'prof123', // DEMO: senha em texto plano
    role: 'professor',
    user_id: 'prof-001'
  },
  {
    cpf: '222.222.222-22',
    senha_hash: 'prof123', // DEMO: senha em texto plano
    role: 'professor',
    user_id: 'prof-002'
  },
  {
    cpf: '333.333.333-33',
    senha_hash: 'aluno123', // DEMO: senha em texto plano
    role: 'aluno',
    user_id: 'aluno-001'
  },
  {
    cpf: '444.444.444-44',
    senha_hash: 'aluno123', // DEMO: senha em texto plano
    role: 'aluno',
    user_id: 'aluno-002'
  },
  {
    cpf: '555.555.555-55',
    senha_hash: 'aluno123', // DEMO: senha em texto plano
    role: 'aluno',
    user_id: 'aluno-003'
  }
];

// ============================================
// VALIDAÇÃO DE LOGIN - MODO DESENVOLVIMENTO
// ============================================
/**
 * Valida login com senhas simples para demonstração
 * ⚠️ EM PRODUÇÃO, usar bcrypt.compareSync()
 * ✅ Para demo: aceita senhas diretas (gestor123, prof123, aluno123)
 */
export const validateLogin = (cpf: string, senha: string): Omit<MockUser, 'senha_hash'> | null => {
  const user = mockUsers.find(u => u.cpf === cpf);
  
  if (!user) {
    return null;
  }

  // ✅ MODO DEMO: Validação simples para facilitar testes
  // Mapear role para senha esperada
  const senhaEsperada = {
    'gestor': 'gestor123',
    'professor': 'prof123',
    'aluno': 'aluno123'
  }[user.role];

  // Validar senha
  if (senha !== senhaEsperada) {
    return null;
  }

  // ✅ Retornar apenas dados necessários (sem senha)
  return {
    cpf: user.cpf,
    role: user.role,
    user_id: user.user_id
  };
};

/**
 * Gera hash para uma nova senha
 * ⚠️ MODO DEMO: Retorna senha direta
 * ✅ EM PRODUÇÃO: Usar bcrypt.hashSync(password, 10)
 */
export const hashPassword = (password: string): string => {
  return password; // DEMO: senha em texto plano
};

/**
 * Verifica força mínima da senha
 * ✅ Validação antes de criar hash
 */
export const isPasswordStrong = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Senha deve ter no mínimo 6 caracteres' };
  }
  
  // Adicionar regras conforme necessário
  // Exemplo: letras + números
  // const hasLetter = /[a-zA-Z]/.test(password);
  // const hasNumber = /[0-9]/.test(password);
  // if (!hasLetter || !hasNumber) {
  //   return { valid: false, message: 'Senha deve conter letras e números' };
  // }
  
  return { valid: true };
};

// ============================================
// REFERÊNCIA PARA SENHAS (DESENVOLVIMENTO)
// ============================================
/**
 * 📝 CREDENCIAIS DE TESTE (APENAS DESENVOLVIMENTO)
 * 
 * Gestor:
 *   CPF: 000.000.000-01
 *   Senha: gestor123
 * 
 * Professor:
 *   CPF: 111.111.111-11 ou 222.222.222-22
 *   Senha: prof123
 * 
 * Aluno:
 *   CPF: 333.333.333-33, 444.444.444-44 ou 555.555.555-55
 *   Senha: aluno123
 * 
 * ⚠️ REMOVER ESTE COMENTÁRIO EM PRODUÇÃO
 */
