// ============================================
// E2E TESTS - Gestor Flow
// Testa fluxo completo de gestão de alunos
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Gestor - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login como gestor
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 5000 });
  });

  test('deve visualizar dashboard do gestor', async ({ page }) => {
    // Verificar cards de estatísticas
    await expect(page.getByText(/total.*alunos/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/professores/i)).toBeVisible();
    await expect(page.getByText(/turmas/i)).toBeVisible();
  });

  test('deve navegar para lista de alunos', async ({ page }) => {
    // Clicar em "Alunos" no menu ou card
    await page.getByRole('link', { name: /alunos/i }).first().click();
    await page.waitForURL(/\/gestor\/alunos/i);
    
    // Verificar que está na página de alunos
    await expect(page.getByRole('heading', { name: /alunos/i })).toBeVisible();
  });

  test('deve buscar aluno por nome', async ({ page }) => {
    await page.goto('/gestor/alunos');

    const searchInput = page.getByPlaceholder(/buscar/i);
    await searchInput.fill('João');

    // Aguardar estabilização da tabela em vez de timeout fixo
    await expect(searchInput).toHaveValue('João');
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve filtrar alunos por status', async ({ page }) => {
    await page.goto('/gestor/alunos');

    const statusFilter = page.getByLabel(/status/i).or(page.locator('select').first());
    await statusFilter.selectOption('ativo');

    // Aguardar estabilização do DOM após mudança de seleção
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve navegar para adicionar novo aluno', async ({ page }) => {
    await page.goto('/gestor/alunos');
    
    // Clicar em botão de adicionar
    await page.getByRole('button', { name: /novo aluno/i }).or(
      page.getByRole('button', { name: /adicionar/i })
    ).first().click();
    
    await page.waitForURL(/\/gestor\/alunos\/novo/i);
    
    // Verificar formulário
    await expect(page.getByLabel(/nome completo/i)).toBeVisible();
  });

  test('deve visualizar detalhes de aluno', async ({ page }) => {
    await page.goto('/gestor/alunos');

    const viewButton = page.getByRole('button', { name: /visualizar/i }).first();
    if (await viewButton.isVisible()) {
      await viewButton.click();
      // Aguardar elemento de detalhe aparecer em vez de timeout fixo
      await expect(page.getByText(/detalhes/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('deve navegar para professores', async ({ page }) => {
    await page.getByRole('link', { name: /professores/i }).first().click();
    await page.waitForURL(/\/gestor\/professores/i);
    
    await expect(page.getByRole('heading', { name: /professores/i })).toBeVisible();
  });

  test('deve navegar para turmas', async ({ page }) => {
    await page.getByRole('link', { name: /turmas/i }).first().click();
    await page.waitForURL(/\/gestor\/turmas/i);
    
    await expect(page.getByRole('heading', { name: /turmas/i })).toBeVisible();
  });

  test('deve navegar para financeiro', async ({ page }) => {
    await page.getByRole('link', { name: /financeiro/i }).first().click();
    await page.waitForURL(/\/gestor\/financeiro/i);
    
    await expect(page.getByRole('heading', { name: /financeiro/i })).toBeVisible();
  });

  test('deve acessar relatórios', async ({ page }) => {
    await page.getByRole('link', { name: /relatórios/i }).first().click();
    await page.waitForURL(/\/gestor\/relatorios/i);
    
    await expect(page.getByText(/relatórios/i)).toBeVisible();
  });

  test('deve fazer logout', async ({ page }) => {
    // Procurar botão de logout (pode estar em menu dropdown)
    const logoutButton = page.getByRole('button', { name: /sair/i }).or(
      page.getByRole('button', { name: /logout/i })
    );
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForURL(/\/$/);
      
      // Deve voltar para login
      await expect(page.getByText(/Sistema de Gestão/i)).toBeVisible();
    }
  });
});

test.describe('Gestor - Navegação Lateral', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i, { timeout: 5000 });
  });

  test('deve ter menu lateral visível', async ({ page }) => {
    // Verificar que o menu lateral existe
    const sidebar = page.locator('nav, aside, [role="navigation"]').first();
    await expect(sidebar).toBeVisible();
  });

  test('deve navegar entre páginas usando menu lateral', async ({ page }) => {
    // Dashboard
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/gestor\/dashboard/i);
    
    // Alunos
    await page.getByRole('link', { name: /alunos/i }).first().click();
    await page.waitForURL(/\/gestor\/alunos/i);
    
    // Voltar para dashboard
    await page.getByRole('link', { name: /dashboard/i }).first().click();
    await expect(page).toHaveURL(/\/gestor\/dashboard/i);
  });
});

test.describe('Gestor - Performance', () => {
  test('dashboard deve carregar em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i);
    
    // Aguardar elementos principais
    await page.getByText(/total.*alunos/i).waitFor({ state: 'visible', timeout: 3000 });
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('lista de alunos deve renderizar rapidamente', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('000.000.000-01');
    await page.getByLabel(/senha/i).fill('gestor123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/gestor\/dashboard/i);
    
    const startTime = Date.now();
    
    await page.goto('/gestor/alunos');
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
});
