import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { Rocket, Database, ShieldCheck, FlaskConical, Globe, Zap } from 'lucide-react';

const TRUST_ICONS = [Rocket, Database, ShieldCheck, FlaskConical, Globe, Zap];

interface TrustItem {
  title: string;
  description: string;
}

const WhySabienciaSection: React.FC = () => {
  const { t } = useTranslation();

  const items = (t('landing.trust.items', { returnObjects: true }) as TrustItem[]).map(
    (item, i) => ({ ...item, icon: TRUST_ICONS[i] })
  );

  return (
    <section id="why" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 bg-blue-50 border-blue-200 text-blue-700">
            {t('landing.trust.badge')}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t('landing.trust.title')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('landing.trust.subtitle')}
          </p>
        </div>

        {/* Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-gray-50 p-7 rounded-2xl border border-gray-200"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-5">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySabienciaSection;
