# Sabiencia · Brand SVGs

Pacote de SVGs vetorizados para a marca **Sabiencia** — direção D02 Ponto de Convergência.
Todos os arquivos são editáveis em qualquer ferramenta vetorial (Figma, Illustrator, Inkscape, Canva).

## Estrutura

```
brand-svgs/
├── 01-symbol/                    # Símbolo isolado (sem wordmark)
│   ├── symbol-primary.svg        # Padrão · stroke #3b82f6 + dot #1e40af · use em fundos claros
│   ├── symbol-white.svg          # Inverso · tudo branco · use em fundos azul, dark, dentro de tiles
│   ├── symbol-ink.svg            # Parchment · stroke #1e293b + dot #1e40af
│   ├── symbol-mono-blue.svg      # Monocromático azul
│   ├── symbol-mono-dark.svg      # Monocromático azul escuro
│   ├── symbol-mono-ink.svg       # Monocromático ink
│   └── symbol-favicon-16.svg     # Otimizado para 16px (stroke +0.4, dot +0.4)
│
├── 02-tile/                      # Tiles com gradient (sidebar, PWA, OG)
│   ├── tile-sidebar-40.svg       # 40×40 · radius 10 · sidebar item de marca
│   ├── tile-pwa-192.svg          # 192×192 · radius 42 · PWA padrão
│   ├── tile-pwa-512.svg          # 512×512 · radius 112 · PWA maskable
│   └── tile-og-1200x630.svg      # Open Graph / social share
│
├── 03-lockup-horizontal/         # Símbolo + wordmark lado a lado
│   ├── lockup-horizontal-on-light.svg
│   ├── lockup-horizontal-on-blue.svg
│   ├── lockup-horizontal-on-dark.svg
│   ├── lockup-horizontal-on-parchment.svg
│   ├── lockup-horizontal-mono-blue.svg
│   └── lockup-horizontal-mono-ink.svg
│
└── 04-lockup-vertical/           # Símbolo empilhado sobre wordmark (alternativo)
    ├── lockup-vertical-on-light.svg
    ├── lockup-vertical-on-blue.svg
    ├── lockup-vertical-on-dark.svg
    └── lockup-vertical-on-parchment.svg
```

## Especificações técnicas

**Símbolo · viewBox 32×32 · centro (16, 16)**
- 2 hastes superiores a ±60° da vertical · endpoints (6.47, 10.5) e (25.53, 10.5) · L = 11
- 1 haste inferior reta · endpoint (16, 29.2) · L = 13.2 (+20% para ancoragem)
- Stroke 2px uniforme · stroke-linecap: round
- Núcleo central r=3 · fill sólido (geralmente #1e40af)

**Wordmark**
- Font: **Poppins 500** · letter-spacing -0.5
- Tamanho display: 30px (lockup horizontal)
- Cor: ink #0f172a sobre claros · branco sobre escuros

**Gradient brand (tiles)**
- linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)

## Notas

- Os lockups usam **text element** com font-family Poppins. Para garantir renderização idêntica fora do navegador, instale a Poppins localmente ou converta os textos em paths antes de enviar para impressão.
- Os SVGs são limpos — sem IDs duplicados, sem código de editor. Seguros para inline em HTML.
- Para o favicon real (.ico), gere a partir do `symbol-favicon-16.svg` em uma ferramenta como realfavicongenerator.net.

— Sabiencia · Brand v1.0 · Maio 2026
