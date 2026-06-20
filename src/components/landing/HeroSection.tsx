import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { Play, ArrowRight, Check } from 'lucide-react';
import { DEMO_HOME, SCREENSHOTS } from './landing.config';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const trust = t('landing.hero.trust', { returnObjects: true }) as string[];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="w-fit bg-blue-50 border-blue-200 text-blue-700 px-4 py-2"
              >
                {t('landing.hero.badge')}
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t('landing.hero.titleStart')}{' '}
                <span className="text-blue-600 relative">
                  {t('landing.hero.titleHighlight')}
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 rounded-full" />
                </span>{' '}
                {t('landing.hero.titleEnd')}
              </h1>

              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                {t('landing.hero.subtitle')}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-sm"
                onClick={() => navigate(DEMO_HOME)}
              >
                <Play className="w-5 h-5 mr-2" />
                {t('landing.hero.ctaDemo')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
                onClick={scrollToContact}
              >
                {t('landing.hero.ctaContact')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Trust strip — factual capabilities, not invented numbers */}
            <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product screenshot — the buyer's view (Manager / CEO dashboard) */}
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-100">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <ImageWithFallback
                src={SCREENSHOTS.manager}
                alt="Sabiencia — Manager dashboard"
                className="w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
