// ============================================
// E2E TESTS - Aluno Flow
// Testa fluxo completo de aluno
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Aluno - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login como aluno
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('333.333.333-33');
    await page.getByLabel(/senha/i).fill('aluno123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/aluno\/dashboard/i, { timeout: 5000 });
  });

  test('deve visualizar dashboard do aluno', async ({ page }) => {
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('deve acessar minhas aulas', async ({ page }) => {
    await page.getByRole('link', { name: /aulas/i }).first().click();
    await page.waitForURL(/\/aluno\/aulas/i);
    await expect(page.getByText(/aulas/i)).toBeVisible();
  });

  test('deve acessar minhas notas', async ({ page }) => {
    await page.getByRole('link', { name: /notas/i }).first().click();
    await page.waitForURL(/\/aluno\/notas/i);
    
    await expect(page.getByText(/notas/i)).toBeVisible();
  });

  test('deve acessar frequência', async ({ page }) => {
    await page.getByRole('link', { name: /frequência/i }).first().click();
    await page.waitForURL(/\/aluno\/frequencia/i);
    
    await expect(page.getByText(/frequência/i)).toBeVisible();
  });

  test('deve acessar biblioteca', async ({ page }) => {
    await page.getByRole('link', { name: /biblioteca/i }).first().click();
    await page.waitForURL(/\/aluno\/biblioteca/i);
    
    await expect(page.getByText(/biblioteca/i)).toBeVisible();
  });

  test('deve acessar financeiro', async ({ page }) => {
    await page.getByRole('link', { name: /financeiro/i }).first().click();
    await page.waitForURL(/\/aluno\/financeiro/i);
    
    await expect(page.getByText(/financeiro/i)).toBeVisible();
  });

  test('deve acessar comunicados', async ({ page }) => {
    await page.getByRole('link', { name: /comunicados/i }).first().click();
    await page.waitForURL(/\/aluno\/comunicados/i);
    
    await expect(page.getByText(/comunicados/i)).toBeVisible();
  });

  test('deve acessar certificados', async ({ page }) => {
    await page.getByRole('link', { name: /certificados/i }).first().click();
    await page.waitForURL(/\/aluno\/certificados/i);
    
    await expect(page.getByText(/certificados/i)).toBeVisible();
  });
});

test.describe('Aluno - Mobile', () => {
  test('deve funcionar em dispositivo móvel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.getByLabel(/cpf/i).fill('333.333.333-33');
    await page.getByLabel(/senha/i).fill('aluno123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL(/\/aluno\/dashboard/i, { timeout: 5000 });
    
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });
});
