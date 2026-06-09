import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { Play, Users, Calendar, BookOpen, LogIn } from 'lucide-react';
import EnrollmentFlow from './EnrollmentFlow';

const STAT_ICONS = [Calendar, Users, BookOpen];

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  const statLabels = t('landing.hero.stats', { returnObjects: true }) as string[];
  const stats = statLabels.map((label, i) => ({ icon: STAT_ICONS[i], label }));

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 lg:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="outline" className="w-fit bg-blue-50 border-blue-200 text-blue-700 px-4 py-2">
                {t('landing.hero.badge')}
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t('landing.hero.titleStart')}{' '}
                <span className="text-blue-600 relative">
                  {t('landing.hero.titleHighlight')}
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => {
                  const element = document.getElementById('cursos');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {t('landing.hero.ctaCourses')}
              </Button>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-4 text-lg transition-all duration-300"
                  onClick={() => navigate('/login/aluno')}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {t('landing.hero.ctaStudentArea')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-4 text-lg transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {t('landing.hero.ctaFreeClass')}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-600">
                  <stat.icon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="relative z-10">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-8 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Estudantes em aula online"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Floating testimonial card */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-xl shadow-lg max-w-sm">
              <div className="flex items-start space-x-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Aluna satisfeita"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {'★'.repeat(5)}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    "Consegui uma promoção após concluir o curso!"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    - Maria Silva, Técnico em Enfermagem
                  </p>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-12 right-12 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
      
      {/* Enrollment Flow Modal */}
      <EnrollmentFlow
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
      />
    </section>
  );
};

export default HeroSection;