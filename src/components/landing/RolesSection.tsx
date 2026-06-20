import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { Briefcase, GraduationCap, BookOpen, Check, ArrowRight } from 'lucide-react';
import { DEMO_LINKS, SCREENSHOTS, type RoleKey } from './landing.config';

interface RoleItem {
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
}

const ROLE_META: { key: RoleKey; icon: typeof Briefcase; color: string }[] = [
  { key: 'manager', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  { key: 'teacher', icon: GraduationCap, color: 'bg-green-100 text-green-600' },
  { key: 'student', icon: BookOpen, color: 'bg-orange-100 text-orange-600' },
];

const RolesSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items = t('landing.roles.items', { returnObjects: true }) as RoleItem[];
  const roles = items.map((item, i) => ({ ...item, ...ROLE_META[i] }));

  return (
    <section id="roles" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 bg-blue-50 border-blue-200 text-blue-700">
            {t('landing.roles.badge')}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t('landing.roles.title')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('landing.roles.subtitle')}
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card
              key={role.key}
              className="flex flex-col overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                <div className="border-b border-gray-200 bg-gray-50">
                  <ImageWithFallback
                    src={SCREENSHOTS[role.key]}
                    alt={`Sabiencia — ${role.name}`}
                    className="w-full aspect-[16/10] object-cover object-top"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-6 flex-grow space-y-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${role.color}`}
                  >
                    <role.icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {role.name}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {role.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{role.description}</p>

                <ul className="space-y-2">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  variant="outline"
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate(DEMO_LINKS[role.key])}
                >
                  {t('landing.roles.openDemo')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
