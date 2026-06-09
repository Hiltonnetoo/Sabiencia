import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { Calendar, Monitor, Award, Headphones, Clock, Users, MapPin, CheckCircle } from 'lucide-react';

const FEATURE_META = [
  { icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  { icon: Monitor, color: 'bg-green-100 text-green-600' },
  { icon: Award, color: 'bg-orange-100 text-orange-600' },
  { icon: Headphones, color: 'bg-purple-100 text-purple-600' },
];

const BENEFIT_ICONS = [Clock, Users, MapPin, CheckCircle, CheckCircle, Award];
const STAT_COLORS = ['text-blue-600', 'text-green-600', 'text-orange-600', 'text-purple-600'];

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = (t('landing.features.items', { returnObjects: true }) as { title: string; description: string }[])
    .map((f, i) => ({ ...f, icon: FEATURE_META[i].icon, color: FEATURE_META[i].color }));

  const benefits = (t('landing.features.benefits', { returnObjects: true }) as string[])
    .map((text, i) => ({ text, icon: BENEFIT_ICONS[i] }));

  const stats = (t('landing.features.stats', { returnObjects: true }) as { value: string; label: string }[])
    .map((s, i) => ({ ...s, color: STAT_COLORS[i] }));

  return (
    <section className="py-16 lg:py-24 bg-white">
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

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {t('landing.features.methodTitle')}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('landing.features.methodText')}
                </p>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;