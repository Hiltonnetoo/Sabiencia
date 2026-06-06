// ============================================
// VISUAL TESTS - Screenshot Testing
// Testa regressões visuais com screenshots
// ============================================

import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Screenshots', () => {
  test.describe('Login Page', () => {
    test('deve capturar screenshot da página de login - desktop', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Aguardar elementos principais
      await page.getByText(/Sistema de Gestão Educacional/i).waitFor();
      
      // Screenshot completo
      await expect(page).toHaveScreenshot('login-page-desktop.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('deve capturar screenshot da página de login - mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.getByText(/Sistema de Gestão/i).waitFor();
      
      await expect(page).toHaveScreenshot('login-page-mobile.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('deve capturar screenshot de erro de login', async ({ page }) => {
      await page.goto('/');
      
      await page.getByLabel(/cpf/i).fill('999.999.999-99');
      await page.getByLabel(/senha/i).fill('senhaerrada');
      await page.getByRole('button', { name: /entrar/i }).click();
      
      // Aguardar mensagem de erro
      await page.getByText(/cpf ou senha inválidos/i).waitFor();
      
      await expect(page).toHaveScreenshot('login-error.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Gestor Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByLabel(/cpf/i).fill('000.000.000-01');
      await page.getByLabel(/senha/i).fill('gestor123');
      await page.getByRole('button', { name: /entrar/i }).click();
      await page.waitForURL(/\/gestor\/dashboard/i);
    });

    test('deve capturar screenshot do dashboard do gestor', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.getByText(/total.*alunos/i).waitFor({ timeout: 3000 });
      
      await expect(page).toHaveScreenshot('gestor-dashboard.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('deve capturar screenshot da lista de alunos', async ({ page }) => {
      await page.goto('/gestor/alunos');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('gestor-alunos-list.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('deve capturar screenshot da tabela de alunos', async ({ page }) => {
      await page.goto('/gestor/alunos');
      await page.waitForLoadState('networkidle');
      
      // Screenshot apenas da tabela
      const table = page.locator('table').first();
      await expect(table).toHaveScreenshot('alunos-table.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Professor Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByLabel(/cpf/i).fill('111.111.111-11');
      await page.getByLabel(/senha/i).fill('prof123');
      await page.getByRole('button', { name: /entrar/i }).click();
      await page.waitForURL(/\/professor\/dashboard/i);
    });

    test('deve capturar screenshot do dashboard do professor', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.getByText(/turmas/i).waitFor({ timeout: 3000 });
      
      await expect(page).toHaveScreenshot('professor-dashboard.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Aluno Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.getByLabel(/cpf/i).fill('333.333.333-33');
      await page.getByLabel(/senha/i).fill('aluno123');
      await page.getByRole('button', { name: /entrar/i }).click();
      await page.waitForURL(/\/aluno\/dashboard/i);
    });

    test('deve capturar screenshot do dashboard do aluno', async ({ page }) => {
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('aluno-dashboard.png', {
        fullPage: true,
        animations: 'disabled',
      });
    });
  });

  test.describe('Componentes Isolados', () => {
    test('deve capturar screenshot de cards vazios', async ({ page }) => {
      await page.goto('/gestor/alunos');
      await page.waitForLoadState('networkidle');

      await page.getByPlaceholder(/buscar/i).fill('XXXNONEXISTENTXXX');
      // Aguardar o estado vazio aparecer em vez de timeout fixo
      await page.getByText(/nenhum aluno encontrado|nenhum resultado/i).waitFor({ state: 'visible' });

      await expect(page).toHaveScreenshot('empty-state.png', {
        animations: 'disabled',
      });
    });

    test('deve capturar screenshot de loading states', async ({ page }) => {
      await page.goto('/');

      await page.getByLabel(/cpf/i).fill('000.000.000-01');
      await page.getByLabel(/senha/i).fill('gestor123');

      const submitButton = page.getByRole('button', { name: /entrar/i });
      await submitButton.click();

      // Aguardar o botão mudar para estado "Entrando..." (determinístico)
      await expect(submitButton).toHaveText(/entrando/i);
      await expect(page).toHaveScreenshot('loading-state.png', {
        animations: 'disabled',
      });
    });
  });

  test.describe('Responsividade', () => {
    const viewports = [
      { name: 'mobile-small', width: 320, height: 568 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'mobile-large', width: 414, height: 896 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'desktop-large', width: 2560, height: 1440 },
    ];

    viewports.forEach(({ name, width, height }) => {
      test(`deve capturar login em ${name}`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        await expect(page).toHaveScreenshot(`login-${name}.png`, {
          fullPage: true,
          animations: 'disabled',
        });
      });
    });
  });

  test.describe('Dark Mode (Se implementado)', () => {
    test('deve capturar em modo claro', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('login-light-mode.png', {
        animations: 'disabled',
      });
    });

    test('deve capturar em modo escuro', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('login-dark-mode.png', {
        animations: 'disabled',
      });
    });
  });
});

test.describe('Visual Regression - Elementos Específicos', () => {
  test('deve capturar botões em diferentes estados', async ({ page }) => {
    await page.goto('/');
    
    const button = page.getByRole('button', { name: /entrar/i });
    
    // Normal
    await expect(button).toHaveScreenshot('button-normal.png');
    
    // Hover
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
    
    // Focus
    await button.focus();
    await expect(button).toHaveScreenshot('button-focus.png');
  });

  test('deve capturar inputs em diferentes estados', async ({ page }) => {
    await page.goto('/');
    
    const cpfInput = page.getByLabel(/cpf/i);
    
    // Empty
    await expect(cpfInput).toHaveScreenshot('input-empty.png');
    
    // Filled
    await cpfInput.fill('000.000.000-01');
    await expect(cpfInput).toHaveScreenshot('input-filled.png');
    
    // Error (tentando submeter)
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(cpfInput).toHaveScreenshot('input-error.png');
  });
});
