import { defineConfig, devices } from '@playwright/test';

/**
 * PLAYWRIGHT CONFIG - Testes E2E
 * Testa fluxos completos de usuário
 */
export default defineConfig({
  testDir: './e2e',
  
  // Timeout para cada teste
  timeout: 30 * 1000,
  
  // Configurações globais
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],

  // Configurações compartilhadas
  use: {
    // URL base da aplicação
    baseURL: 'http://localhost:3000',
    
    // Coletar traces em falhas
    trace: 'on-first-retry',
    
    // Screenshots em falhas
    screenshot: 'only-on-failure',
    
    // Vídeo em falhas
    video: 'retain-on-failure',
    
    // Timeout para ações
    actionTimeout: 10 * 1000,
    
    // Timeout para navegação
    navigationTimeout: 15 * 1000,
  },

  // Projetos para diferentes navegadores
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },

    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },

    // Tablet
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Servidor de desenvolvimento
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
