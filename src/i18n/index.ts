// ============================================
// i18n — internationalization (English-first, PT switch)
// ============================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Base resources (landing, demo, auth, topbar, nav, dashboard, language)
import en from './locales/en.json';
import pt from './locales/pt.json';

export const SUPPORTED_LANGUAGES = ['en', 'pt'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type Dict = Record<string, unknown>;

/** Recursively merges plain objects; later sources win on leaf collisions. */
function deepMerge(target: Dict, source: Dict): Dict {
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = target[key];
    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      target[key] = deepMerge({ ...(targetVal as Dict) }, sourceVal as Dict);
    } else {
      target[key] = sourceVal;
    }
  }
  return target;
}

/**
 * Auto-loads every per-area locale file (one file per translation lot), so new
 * namespaces are picked up just by dropping a JSON into `locales/en` / `locales/pt`.
 * Files are deep-merged into the base resources, so multiple files may contribute
 * to the same top-level namespace (e.g. `aluno`) without conflicting.
 */
function loadArea(modules: Record<string, { default: Dict }>): Dict {
  const merged: Dict = {};
  // Sort by path for deterministic merge order.
  for (const path of Object.keys(modules).sort()) {
    deepMerge(merged, modules[path].default);
  }
  return merged;
}

const enAreas = loadArea(
  import.meta.glob('./locales/en/*.json', { eager: true }) as Record<string, { default: Dict }>,
);
const ptAreas = loadArea(
  import.meta.glob('./locales/pt/*.json', { eager: true }) as Record<string, { default: Dict }>,
);

const enResources = deepMerge({ ...(en as Dict) }, enAreas);
const ptResources = deepMerge({ ...(pt as Dict) }, ptAreas);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enResources },
      pt: { translation: ptResources },
    },
    // English-first: only persisted choice overrides the default; otherwise English.
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'sabiencia-lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

/**
 * Resolves a localized field for mock/demo data.
 *
 * Demo entities store free-text in i18n under the `data` namespace, keyed by a
 * stable id (e.g. `data.disciplina.anatomia.nome`). Use this helper to read the
 * value for the active language, with the Portuguese seed text as a safe
 * fallback when a key is missing.
 *
 * @param key      Full i18n key inside the `data` namespace.
 * @param fallback Original Portuguese text to show if the key is absent.
 */
export function localizeData(key: string, fallback: string): string {
  const translated = i18n.t(key, { defaultValue: fallback });
  return typeof translated === 'string' ? translated : fallback;
}

export default i18n;
