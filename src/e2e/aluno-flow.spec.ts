// ============================================
// E2E TESTS - Aluno Flow
// Testa fluxo completo de aluno
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Aluno - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login como aluno via /login/aluno
    await page.goto('/login/aluno');
    await page.getByLabel(/cpf/i).fill('333.333.333-33');
    await page.getByLabel(/senha|password/i).fill('aluno123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/aluno\/dashboard/i, { timeout: 10000 });
  });

  test('deve visualizar dashboard do aluno', async ({ page }) => {
    await expect(page.getByText(/início|dashboard|olá|welcome|home/i).first()).toBeVisible();
  });

  test('deve acessar minhas aulas', async ({ page }) => {
    await page.getByRole('link', { name: /aulas|lessons/i }).first().click();
    await page.waitForURL(/\/aluno\/aulas/i);
    await expect(page.getByText(/aulas|lessons/i).first()).toBeVisible();
  });

  test('deve acessar minhas notas', async ({ page }) => {
    await page.getByRole('link', { name: /notas|grades/i }).first().click();
    await page.waitForURL(/\/aluno\/notas/i);
    
    await expect(page.getByText(/notas|grades/i).first()).toBeVisible();
  });

  test('deve acessar frequência', async ({ page }) => {
    await page.getByRole('link', { name: /frequência|attendance/i }).first().click();
    await page.waitForURL(/\/aluno\/frequencia/i);
    
    await expect(page.getByText(/frequência|attendance/i).first()).toBeVisible();
  });

  test('deve acessar biblioteca', async ({ page }) => {
    await page.getByRole('link', { name: /biblioteca|materiais|library/i }).first().click();
    await page.waitForURL(/\/aluno\/materiais/i);
    
    await expect(page.getByText(/biblioteca|materiais|library/i).first()).toBeVisible();
  });

  test('deve acessar financeiro', async ({ page }) => {
    await page.getByRole('link', { name: /financeiro|financial/i }).first().click();
    await page.waitForURL(/\/aluno\/financeiro/i);
    
    await expect(page.getByText(/financeiro|financial/i).first()).toBeVisible();
  });

  test('deve acessar comunicados', async ({ page }) => {
    await page.getByRole('link', { name: /comunicados|announcements/i }).first().click();
    await page.waitForURL(/\/aluno\/comunicados/i);
    
    await expect(page.getByText(/comunicados|announcements/i).first()).toBeVisible();
  });

  test('deve acessar certificados', async ({ page }) => {
    await page.getByRole('link', { name: /certificados|certificates/i }).first().click();
    await page.waitForURL(/\/aluno\/certificados/i);
    
    await expect(page.getByText(/certificados|certificates/i).first()).toBeVisible();
  });
});

test.describe('Aluno - Mobile', () => {
  test('deve funcionar em dispositivo móvel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login/aluno');
    await page.getByLabel(/cpf/i).fill('333.333.333-33');
    await page.getByLabel(/senha|password/i).fill('aluno123');
    await page.getByRole('button', { name: /entrar|sign in/i }).click();
    await page.waitForURL(/\/aluno\/dashboard/i, { timeout: 10000 });
    
    await expect(page.getByText(/início|dashboard|olá|welcome|home/i).first()).toBeVisible();
  });
});
