import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(projectRoot, 'docs', 'brand-svgs');
const publicRoot = path.join(projectRoot, 'src', 'public');

const iconSources = {
  icon192: path.join(docsRoot, '02-tile', 'tile-pwa-192.svg'),
  icon512: path.join(docsRoot, '02-tile', 'tile-pwa-512.svg'),
  appleTouch: path.join(docsRoot, '02-tile', 'tile-pwa-192.svg'),
  favicon: path.join(docsRoot, '01-symbol', 'symbol-favicon-16.svg'),
};

async function renderSvgToPng(svgPath, outputPath, width, height) {
  const svg = await fs.readFile(svgPath, 'utf8');
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });

    await page.setContent(
      `<!doctype html>
      <html>
        <head>
          <style>
            html, body {
              margin: 0;
              width: ${width}px;
              height: ${height}px;
              overflow: hidden;
              background: transparent;
            }
            body {
              display: flex;
              align-items: stretch;
              justify-content: stretch;
            }
            svg {
              width: ${width}px;
              height: ${height}px;
              display: block;
            }
          </style>
        </head>
        <body>${svg}</body>
      </html>`
    );

    await page.screenshot({
      path: outputPath,
      omitBackground: true,
      type: 'png',
    });
  } finally {
    await browser.close();
  }
}

function pngToIco(pngBuffer, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const directory = Buffer.alloc(16);
  directory.writeUInt8(width >= 256 ? 0 : width, 0);
  directory.writeUInt8(height >= 256 ? 0 : height, 1);
  directory.writeUInt8(0, 2);
  directory.writeUInt8(0, 3);
  directory.writeUInt16LE(1, 4);
  directory.writeUInt16LE(32, 6);
  directory.writeUInt32LE(pngBuffer.length, 8);
  directory.writeUInt32LE(22, 12);

  return Buffer.concat([header, directory, pngBuffer]);
}

async function main() {
  await fs.mkdir(publicRoot, { recursive: true });

  const icon192Path = path.join(publicRoot, 'icon-192.png');
  const icon512Path = path.join(publicRoot, 'icon-512.png');
  const appleTouchPath = path.join(publicRoot, 'apple-touch-icon.png');
  const faviconPngPath = path.join(publicRoot, 'favicon-16.png');
  const faviconIcoPath = path.join(publicRoot, 'favicon.ico');

  await renderSvgToPng(iconSources.icon192, icon192Path, 192, 192);
  await renderSvgToPng(iconSources.icon512, icon512Path, 512, 512);
  await renderSvgToPng(iconSources.appleTouch, appleTouchPath, 180, 180);
  await renderSvgToPng(iconSources.favicon, faviconPngPath, 16, 16);

  const faviconPng = await fs.readFile(faviconPngPath);
  const faviconIco = pngToIco(faviconPng, 16, 16);
  await fs.writeFile(faviconIcoPath, faviconIco);
  await fs.unlink(faviconPngPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
