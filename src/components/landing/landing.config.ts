// ============================================
// LANDING CONFIG — single source of truth for the public landing page.
//
// ⚠️ TODO(owner): replace the CONTACT_* placeholders below with the REAL
// e-mail and WhatsApp number used to capture leads. These power the
// "Request a demo" / contact CTAs (mailto + wa.me) — there is no backend,
// so messages go straight to these channels.
// ============================================

/** Lead-capture e-mail (used in mailto: links). */
export const CONTACT_EMAIL = 'hello@sabiencia.app'; // ⚠️ placeholder — set the real address

/** WhatsApp number in international format, digits only (country + area + number). */
export const WHATSAPP_NUMBER = '5599985104312'; // ⚠️ placeholder — set the real number

/** Public source / portfolio links shown as a discreet credit. */
export const GITHUB_URL = 'https://github.com/Hiltonnetoo/Sabiencia';
export const PORTFOLIO_URL = 'https://github.com/Hiltonnetoo';

/** Subject/body used to pre-fill the contact channels. */
export const CONTACT_EMAIL_SUBJECT = 'Sabiencia — demo request';
export const CONTACT_MESSAGE =
  'Hi! I would like to know more about Sabiencia for my institution.';

/** Ready-to-use links derived from the values above. */
export const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  CONTACT_EMAIL_SUBJECT
)}&body=${encodeURIComponent(CONTACT_MESSAGE)}`;

export const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  CONTACT_MESSAGE
)}`;

/** Live demo entry points (auto-login demo users — see DemoIndex / demoRoutes). */
export const DEMO_HOME = '/demo';
export const DEMO_LINKS = {
  manager: '/demo/gestor',
  teacher: '/demo/professor',
  student: '/demo/aluno',
} as const;

/** Real dashboard screenshots served from src/public (publicDir). */
export const SCREENSHOTS = {
  manager: '/screenshots/manager.png',
  teacher: '/screenshots/teacher.png',
  student: '/screenshots/student.png',
} as const;

export type RoleKey = keyof typeof DEMO_LINKS;
