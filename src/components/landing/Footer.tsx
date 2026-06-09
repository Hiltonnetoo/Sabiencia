import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { SabienciaSymbol } from '../brand/SabienciaBrand';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const courses = (t('landing.courses.items', { returnObjects: true }) as { title: string }[]).map(
    (c) => c.title
  );

  const quickLinks = [
    { name: t('landing.nav.home'), href: '#home' },
    { name: t('landing.nav.courses'), href: '#cursos' },
    { name: t('landing.nav.about'), href: '#sobre' },
    { name: t('landing.nav.contact'), href: '#contato' },
    { name: t('landing.nav.blog'), href: '#blog' },
    { name: t('landing.footer.studentArea'), href: '#login' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-500' }
  ];

  const legalLinks = (t('landing.footer.legal', { returnObjects: true }) as string[]).map((name) => ({
    name,
    href: '#',
  }));

  return (
    <footer role="contentinfo" className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
                </div>
                <span className="text-xl font-semibold text-white">Sabiencia</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm">
                {t('landing.footer.companyDesc')}
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-white mb-3">{t('landing.footer.follow')}</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">{t('landing.footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-white mb-6">{t('landing.footer.coursesTitle')}</h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course}>
                  <a
                    href="#cursos"
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {course}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('landing.footer.viewAll')}
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6">{t('landing.footer.contact')}</h4>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>{t('landing.footer.addressLine1')}</p>
                  <p>{t('landing.footer.addressLine2')}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>(99) 98510-4312</p>
                  <p className="text-xs text-green-400">{t('landing.footer.whatsapp')}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>contato@sabiencia.edu.br</p>
                  <p>matricula@sabiencia.edu.br</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-gray-800">
                <h5 className="font-medium text-white text-sm mb-2">{t('landing.footer.hoursTitle')}</h5>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>{t('landing.footer.hoursWeek')}</p>
                  <p>{t('landing.footer.hoursSat')}</p>
                  <p>{t('landing.footer.hoursWhats')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('landing.footer.newsletterTitle')}
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('landing.footer.newsletterText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('landing.footer.emailPlaceholder')}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-auto"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                {t('landing.footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-300">
              <p>&copy; {currentYear} {t('landing.footer.copyright')}</p>
              <p className="text-xs text-gray-400 mt-1">
                {t('landing.footer.accreditation')}
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              {t('landing.footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
