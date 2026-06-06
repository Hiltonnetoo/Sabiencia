// ============================================
// E2E TESTS - Login Flow
// Testa fluxo completo de login para os 3 perfis
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Login Flow - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir página de login inicial', async ({ page }) => {
    await expect(page).toHaveTitle(/Sabiencia/i);
    await expect(page.getByText(/Sabiencia/i)).toBeVisible();
  });

  test('deve fazer login como GESTOR e acessar dashboard', async ({ page }) => {
    // Preencher formulário
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha/i).fill('gestor123');
    
    // Clicar em entrar
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Aguardar redirecionamento
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 5000 });
    
    // Verificar que está no dashboard do gestor
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByText(/total.*alunos/i)).toBeVisible({ timeout: 3000 });
  });

  test('deve fazer login como PROFESSOR e acessar dashboard', async ({ page }) => {
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha/i).fill('prof123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 5000 });
    
    await expect(page.getByText(/dashboard/i)).toBeVisible();
    await expect(page.getByText(/turmas/i)).toBeVisible({ timeout: 3000 });
  });

  test('deve fazer login como ALUNO e acessar dashboard', async ({ page }) => {
    await page.getByLabel(/cpf/i).fill('333.333.333-33');
    await page.getByLabel(/senha/i).fill('aluno123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    await page.waitForURL(/\/aluno\/dashboard/i, { timeout: 5000 });
    
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('deve rejeitar credenciais inválidas', async ({ page }) => {
    await page.getByLabel(/cpf/i).fill('999.999.999-99');
    await page.getByLabel(/senha/i).fill('senhaerrada');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Deve mostrar mensagem de erro
    await expect(page.getByText(/cpf ou senha inválidos/i)).toBeVisible({ timeout: 3000 });
  });

  test('deve formatar CPF automaticamente', async ({ page }) => {
    const cpfInput = page.getByLabel(/cpf/i);
    await cpfInput.fill('12345678901');
    
    // Verificar formatação
    await expect(cpfInput).toHaveValue(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });

  test('deve alternar visibilidade da senha', async ({ page }) => {
    const senhaInput = page.getByLabel(/senha/i);
    
    // Senha escondida por padrão
    await expect(senhaInput).toHaveAttribute('type', 'password');
    
    // Mostrar senha
    await page.getByRole('button', { name: /mostrar senha/i }).click();
    await expect(senhaInput).toHaveAttribute('type', 'text');
    
    // Esconder novamente
    await page.getByRole('button', { name: /ocultar senha/i }).click();
    await expect(senhaInput).toHaveAttribute('type', 'password');
  });

  test('deve navegar para modo demonstração', async ({ page }) => {
    await page.getByRole('link', { name: /modo demonstração/i }).click();
    await page.waitForURL(/\/demo/i);
    
    await expect(page.getByText(/demonstração/i)).toBeVisible();
  });
});

test.describe('Login - Acessibilidade', () => {
  test('deve ser navegável por teclado', async ({ page }) => {
    await page.goto('/');
    
    // Tab para CPF
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/cpf/i)).toBeFocused();
    
    // Tab para Senha
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/senha/i)).toBeFocused();
    
    // Tab para Botão
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /entrar/i })).toBeFocused();
  });

  test('deve permitir login com Enter', async ({ page }) => {
    await page.goto('/');
    
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha/i).fill('gestor123');
    
    // Pressionar Enter
    await page.keyboard.press('Enter');
    
    // Deve redirecionar
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 5000 });
  });
});

test.describe('Login - Responsividade', () => {
  test('deve funcionar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.getByText(/Sistema de Gestão/i)).toBeVisible();
    
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 5000 });
  });

  test('deve funcionar em tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await page.getByLabel(/cpf/i).fill('111.111.111-11');
    await page.getByLabel(/senha/i).fill('prof123');
    await page.getByRole('button', { name: /entrar/i }).click();
    
    await page.waitForURL(/\/professor\/dashboard/i, { timeout: 5000 });
  });
});
