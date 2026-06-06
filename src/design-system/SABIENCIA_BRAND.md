# Sabiencia - Design System & Brand Guidelines

## 1. Nome e Posicionamento da Marca
**Sabiencia** é um Sistema de Gestão Educacional EAD completo, moderno e intuitivo, focado em entregar a melhor experiência de ensino e aprendizagem para alunos, professores e gestores. A marca reflete sabedoria, inovação, clareza e acessibilidade, desvinculando-se de legados anteriores para estabelecer um novo padrão de qualidade em plataformas educacionais.

## 2. Paleta de Cores (Design Tokens)
O sistema de cores utiliza variáveis CSS globais (disponíveis em `globals.css` e `index.css`) para garantir consistência em toda a aplicação.

### Cores de Marca
- **Primary:** `--color-primary: #3b82f6` (Azul principal)
- **Primary Hover:** `--color-primary-hover: #2563eb`
- **Primary Active:** `--color-primary-active: #1d4ed8`

### Superfícies e Backgrounds
- **Background:** `--color-background: #f8fafc` (Cinza muito claro, fundo geral)
- **Surface 1:** `--color-surface-1: #ffffff` (Branco puro, para cards e modais principais)
- **Surface 2:** `--color-surface-2: #f1f5f9` (Cinza claro, para fundos secundários e áreas de destaque)

### Textos
- **Text Primary:** `--color-text-primary: #1e293b` (Cinza escuro/Slate, alto contraste)

### Feedbacks e Estados
- **Success:** `--color-success: #059669` (Verde)
- **Warning:** `--color-warning: #d97706` (Laranja)
- **Error:** `--color-error: #dc2626` (Vermelho)

## 3. Tipografia
O projeto importa as fontes diretamente do Google Fonts (`index.html`) e as aplica através de variáveis globais.

### Famílias
- **Títulos (`--font-titles`):** `Poppins, Inter, sans-serif`
  - Utilizada para todos os cabeçalhos (`h1` a `h6`).
  - Traz um aspecto mais geométrico e moderno para destaques.
- **Corpo (`--font-body`):** `Inter, -apple-system, BlinkMacSystemFont, sans-serif`
  - Utilizada para parágrafos, inputs, botões e labels.
  - Otimizada para legibilidade em textos longos e interfaces densas.

### Pesos (Font Weights) Utilizados
- Regular (400): Textos corridos e descrições.
- Medium (500): Botões, labels e subtítulos.
- Semi-bold (600) / Bold (700): Títulos principais e ênfases.

## 4. Regras de Uso da Logo
Os componentes visuais da marca estão centralizados em `src/components/brand/SabienciaBrand.tsx`.

- **Logo Horizontal (`<SabienciaHorizontalLogo />`):** 
  - **Uso:** Telas de login (`LoginPage`), telas iniciais de demonstração, e locais com bastante espaço horizontal.
  - **Descrição:** Apresenta o símbolo alinhado ao texto "Sabiencia".
  
- **Símbolo (`<SabienciaSymbol />`):** 
  - **Uso:** Cabeçalhos internos (como o `Header` principal da plataforma) e locais que exigem identificação da marca mas têm limitação de largura.
  - **Descrição:** Apenas o ícone gráfico da marca (livro estilizado/abstrato com círculo).

- **Monograma (`<SabienciaMonogramBadge />`):**
  - **Uso:** `Sidebar` (quando contraída), `TopBar`, e pequenos crachás/avatares.
  - **Descrição:** Contém as letras "Sa" sobre um fundo com gradiente radial/linear nas cores primárias da marca.

## 5. Componentes Atualizados no Rebranding
Durante a migração para a marca Sabiencia, os seguintes arquivos/componentes foram adaptados para consumir a nova identidade visual e tipografia:

### Componentes de UI e Layout
- `Header.tsx` (Substituição por `SabienciaSymbol`)
- `Sidebar.tsx` e `TopBar.tsx` (Substituição por `SabienciaMonogramBadge`)
- `Footer.tsx` (Limpeza de assets antigos)
- `LoginFlow.tsx` e `StudentPlatform.tsx` (Atualização de cabeçalhos e rodapés de diálogos)

### Páginas de Autenticação e Demo
- `src/components/auth/LoginPage.tsx` (Implementação da `SabienciaHorizontalLogo`)
- `src/pages/demo/DemoIndex.tsx`
- `src/pages/demo/DemoLoginAluno.tsx`, `DemoLoginGestor.tsx`, `DemoLoginProfessor.tsx`
- `src/pages/demo/ProfessorRegisterPage.tsx`

### Arquivos Base
- `index.html` (Metadados, `theme-color`, Fontes)
- `vite.config.ts` (Manifesto PWA, cores de tema)
- `src/styles/globals.css` e `src/index.css` (Definição dos novos design tokens)
- `scripts/generate-brand-icons.mjs` (Gerador de Favicon e PWA Icons)

## 6. Versionamento e Histórico
- **Versão da Identidade:** 1.0.0
- **Data da Atualização:** 13 de Maio de 2026
- **Nota:** Rebranding completo de "Britos Educação" para "Sabiencia", contemplando expurgo de assets antigos, atualização de metadados, manifesto PWA, e paleta de cores.
