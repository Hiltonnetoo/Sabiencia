import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Github } from 'lucide-react';
import { SabienciaSymbol } from '../brand/SabienciaBrand';
import {
  CONTACT_EMAIL,
  mailtoHref,
  whatsappHref,
  GITHUB_URL,
  PORTFOLIO_URL,
  DEMO_HOME,
} from './landing.config';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: t('landing.nav.product'), href: '#home' },
    { name: t('landing.nav.roles'), href: '#roles' },
    { name: t('landing.nav.features'), href: '#features' },
    { name: t('landing.nav.why'), href: '#why' },
    { name: t('landing.nav.contact'), href: '#contact' },
  ];

  return (
    <footer role="contentinfo" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
              <span className="text-xl font-semibold text-white">Sabiencia</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm max-w-sm">
              {t('landing.footer.productDesc')}
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              <Github className="w-5 h-5" />
              {t('landing.footer.credit')}
            </a>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="font-semibold text-white mb-5">{t('landing.footer.navTitle')}</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to={DEMO_HOME}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {t('landing.footer.demo')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5">{t('landing.footer.contactTitle')}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  {t('landing.contact.whatsappCta')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} {t('landing.footer.copyright')}
            </p>
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {t('landing.footer.tagline')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
