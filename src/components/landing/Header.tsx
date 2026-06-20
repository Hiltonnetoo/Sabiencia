import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu, Play } from 'lucide-react';
import { SabienciaSymbol } from '../brand/SabienciaBrand';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { ThemeToggle } from '../shared/ThemeToggle';
import { DEMO_HOME } from './landing.config';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: t('landing.nav.product'), href: '#home' },
    { name: t('landing.nav.roles'), href: '#roles' },
    { name: t('landing.nav.features'), href: '#features' },
    { name: t('landing.nav.why'), href: '#why' },
    { name: t('landing.nav.contact'), href: '#contact' },
  ];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center space-x-2" aria-label="Sabiencia">
            <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
            <span className="text-xl font-semibold text-gray-900">Sabiencia</span>
          </a>

          {/* Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main menu"
            className="hidden md:flex items-center space-x-8"
          >
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageSwitcher variant="ghost" />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => navigate(DEMO_HOME)}
            >
              <Play className="h-4 w-4 mr-2" />
              {t('landing.actions.viewDemo')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/login/ceo')}>
              {t('landing.actions.login')}
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={scrollToContact}
            >
              {t('landing.actions.requestDemo')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t('landing.actions.openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 px-6 py-6">
                <div className="flex flex-col space-y-6 mt-2">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-2">
                    <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
                    <span className="text-xl font-semibold text-gray-900">Sabiencia</span>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                      >
                        {item.name}
                      </a>
                    ))}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 pb-1">
                      <LanguageSwitcher variant="outline" />
                      <ThemeToggle />
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setIsOpen(false);
                        navigate(DEMO_HOME);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {t('landing.actions.viewDemo')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/login/ceo');
                      }}
                    >
                      {t('landing.actions.login')}
                    </Button>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setIsOpen(false);
                        scrollToContact();
                      }}
                    >
                      {t('landing.actions.requestDemo')}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
