import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { EnrollmentData } from '../EnrollmentFlow';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Award, Users, CheckCircle } from 'lucide-react';

interface CourseSelectionStepProps {
  data: EnrollmentData;
  onUpdate: (data: Partial<EnrollmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CourseSelectionStep: React.FC<CourseSelectionStepProps> = ({ 
  data, 
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
    data.selectedCourse?.id || null
  );

  const courses = [
    {
      id: 1,
      title: 'Técnico em Enfermagem',
      description: 'Cuidados de enfermagem, anatomia e fisiologia, administração de medicamentos e procedimentos técnicos. Forme-se na área da saúde.',
      duration: '18 meses',
      hours: '1200h',
      nextClass: 'Março/2025',
      price: 'A partir de R$ 299/mês',
      fullPrice: 'R$ 5.382,00',
      category: 'Saúde',
      level: 'Iniciante ao Avançado',
      highlights: [
        'Cuidados de Enfermagem',
        'Administração de Medicamentos',
        'Procedimentos Técnicos',
        'Primeiros Socorros'
      ],
      marketInfo: {
        averageSalary: 'R$ 2.500 - R$ 4.200',
        jobOpportunities: 'Alta demanda no mercado',
        workPlaces: 'Hospitais, Clínicas, UBS, Home Care'
      }
    },
    {
      id: 2,
      title: 'Técnico em Administração',
      description: 'Gestão empresarial, recursos humanos, finanças e marketing. Prepare-se para liderar equipes e processos.',
      duration: '15 meses',
      hours: '1000h',
      nextClass: 'Abril/2025',
      price: 'A partir de R$ 249/mês',
      fullPrice: 'R$ 3.735,00',
      category: 'Gestão',
      level: 'Iniciante ao Intermediário',
      highlights: [
        'Gestão de Pessoas',
        'Planejamento Estratégico',
        'Finanças Empresariais',
        'Marketing Digital'
      ],
      marketInfo: {
        averageSalary: 'R$ 1.800 - R$ 3.500',
        jobOpportunities: 'Mercado em crescimento',
        workPlaces: 'Empresas privadas, Órgãos públicos, Startups'
      }
    },
    {
      id: 3,
      title: 'Técnico em Contabilidade',
      description: 'Escrituração fiscal, demonstrações financeiras, análise contábil e compliance. Torne-se um especialista em números.',
      duration: '20 meses',
      hours: '1400h',
      nextClass: 'Maio/2025',
      price: 'A partir de R$ 279/mês',
      fullPrice: 'R$ 5.580,00',
      category: 'Finanças',
      level: 'Intermediário ao Avançado',
      highlights: [
        'Escrituração Fiscal',
        'Análise Financeira',
        'Auditoria',
        'Compliance'
      ],
      marketInfo: {
        averageSalary: 'R$ 2.200 - R$ 4.800',
        jobOpportunities: 'Sempre em demanda',
        workPlaces: 'Escritórios contábeis, Empresas, Consultorias'
      }
    }
  ];

  const handleCourseSelect = (course: typeof courses[0]) => {
    setSelectedCourseId(course.id);
    onUpdate({
      selectedCourse: {
        id: course.id,
        title: course.title,
        price: course.price,
        duration: course.duration
      }
    });
  };

  const handleNext = () => {
    if (selectedCourseId) {
      onNext();
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Escolha seu Curso</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Selecione o curso técnico que melhor se adequa aos seus objetivos profissionais.
          </p>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`relative border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedCourseId === course.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  {/* Selection Indicator */}
                  {selectedCourseId === course.id && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-600 rounded-full p-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Course Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-600 text-white">
                            {course.category}
                          </Badge>
                          <Badge variant="outline" className="border-green-200 text-green-700">
                            Nova Turma: {course.nextClass}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {course.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{course.price}</p>
                        <p className="text-sm text-gray-500">ou {course.fullPrice} à vista</p>
                      </div>
                    </div>

                    {/* Course Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {course.description}
                    </p>

                    {/* Course Details */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{course.hours}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.level}</span>
                      </div>
                    </div>

                    {/* Course Highlights */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">O que você vai aprender:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {course.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Market Information */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Informações do Mercado:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Salário médio:</span>
                          <br />
                          {course.marketInfo.averageSalary}
                        </div>
                        <div>
                          <span className="font-medium">Oportunidades:</span>
                          <br />
                          {course.marketInfo.jobOpportunities}
                        </div>
                        <div>
                          <span className="font-medium">Onde trabalhar:</span>
                          <br />
                          {course.marketInfo.workPlaces}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {!selectedCourseId && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                Por favor, selecione um curso para continuar com a matrícula.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
            <Button variant="outline" onClick={onPrev}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!selectedCourseId}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima Etapa
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseSelectionStep;
