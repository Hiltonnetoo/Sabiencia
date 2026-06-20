import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import {
  Users,
  ClipboardCheck,
  Video,
  Megaphone,
  DollarSign,
  FileDown,
  Search,
  Palette,
} from 'lucide-react';

const FEATURE_META = [
  { icon: Users, color: 'bg-blue-100 text-blue-600' },
  { icon: ClipboardCheck, color: 'bg-green-100 text-green-600' },
  { icon: Video, color: 'bg-orange-100 text-orange-600' },
  { icon: Megaphone, color: 'bg-purple-100 text-purple-600' },
  { icon: DollarSign, color: 'bg-green-100 text-green-600' },
  { icon: FileDown, color: 'bg-blue-100 text-blue-600' },
  { icon: Search, color: 'bg-orange-100 text-orange-600' },
  { icon: Palette, color: 'bg-purple-100 text-purple-600' },
];

interface FeatureItem {
  title: string;
  description: string;
}

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = (t('landing.features.items', { returnObjects: true }) as FeatureItem[]).map(
    (f, i) => ({ ...f, icon: FEATURE_META[i].icon, color: FEATURE_META[i].color })
  );

  return (
    <section id="features" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 bg-blue-50 border-blue-200 text-blue-700">
            {t('landing.features.badge')}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t('landing.features.title')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('landing.features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-5`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
