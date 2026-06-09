import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { Clock, Monitor, Award, ArrowRight } from 'lucide-react';
import EnrollmentFlow from './EnrollmentFlow';

interface CourseItem {
  title: string;
  description: string;
  duration: string;
  hours: string;
  nextClass: string;
  price: string;
  category: string;
  level: string;
  highlights: string[];
}

const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
];

const CoursesSection = () => {
  const { t } = useTranslation();
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);

  const courses = (t('landing.courses.items', { returnObjects: true }) as CourseItem[]).map(
    (course, index) => ({ ...course, id: index + 1, image: COURSE_IMAGES[index] })
  );

  return (
    <section id="cursos" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 bg-blue-50 border-blue-200 text-blue-700">
            {t('landing.courses.badge')}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {t('landing.courses.title')}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('landing.courses.subtitle')}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-md">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-xl">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.title}
                    className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white">
                      {course.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90 border-green-200 text-green-700">
                      {t('landing.courses.newClass')}: {course.nextClass}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{course.hours}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Monitor className="w-4 h-4" />
                      <span>{t('landing.courses.online')}</span>
                    </div>
                  </div>

                  {/* Course Highlights */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('landing.courses.learnLabel')}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {course.highlights.slice(0, 4).map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {course.price}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('landing.courses.levelLabel')}: {course.level}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-colors"
                  onClick={() => setIsEnrollmentOpen(true)}
                >
                  {t('landing.courses.knowMore')}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Section Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            {t('landing.courses.footerText')}
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => setIsEnrollmentOpen(true)}
          >
            {t('landing.courses.viewAll')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
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

export default CoursesSection;