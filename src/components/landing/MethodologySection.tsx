import React from 'react';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { Play, BookOpen, PenTool, Award, ArrowRight } from 'lucide-react';

const MethodologySection = () => {
  const steps = [
    {
      number: '01',
      icon: Play,
      title: 'Estude Online',
      subtitle: 'Flexibilidade total',
      description: 'Acesse aulas gravadas e ao vivo a qualquer hora, em qualquer lugar. Nossa plataforma está disponível 24h.',
      features: [
        'Aulas em vídeo HD',
        'Material PDF interativo',
        'Exercícios práticos',
        'Fórum de dúvidas'
      ]
    },
    {
      number: '02',
      icon: BookOpen,
      title: 'Pratique',
      subtitle: 'Aprendizado ativo',
      description: 'Desenvolva projetos reais e execute exercícios práticos que simulam situações do mercado de trabalho.',
      features: [
        'Projetos práticos',
        'Simuladores',
        'Estudos de caso',
        'Laboratórios virtuais'
      ]
    },
    {
      number: '03',
      icon: PenTool,
      title: 'Comprove',
      subtitle: 'Avaliação presencial',
      description: 'Realize provas presenciais em nossa sede para validar seu aprendizado e garantir a credibilidade do certificado.',
      features: [
        'Provas presenciais',
        'Avaliação técnica',
        'Feedback individual',
        'Segunda chamada'
      ]
    },
    {
      number: '04',
      icon: Award,
      title: 'Certifique-se',
      subtitle: 'Reconhecimento oficial',
      description: 'Receba seu certificado técnico reconhecido pelo MEC e aceito em todo o território nacional.',
      features: [
        'Certificado MEC',
        'Versão digital',
        'Versão impressa',
        'Histórico escolar'
      ]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 bg-blue-50 border-blue-200 text-blue-700">
            Nossa Metodologia
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Como funciona nosso método de ensino
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Uma metodologia inovadora que combina a flexibilidade do ensino online com a credibilidade das avaliações presenciais.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-600 mb-1">
                      ETAPA {step.number}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {step.subtitle}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center lg:justify-start pt-8">
                    <div className="flex items-center space-x-2 text-blue-500">
                      <div className="w-px h-8 bg-blue-200"></div>
                      <ArrowRight className="w-5 h-5" />
                      <div className="text-sm font-medium">Próxima etapa</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <ImageWithFallback
                      src={
                        index === 0 
                          ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          : index === 1
                          ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          : index === 2
                          ? "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      alt={`Etapa ${step.number}: ${step.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Step number overlay */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-100">
                    <span className="text-2xl font-bold text-blue-600">{step.number}</span>
                  </div>

                  {/* Background decoration */}
                  <div className={`absolute -z-10 w-full h-full rounded-2xl transform ${index % 2 === 0 ? 'rotate-3 translate-x-4 translate-y-4' : '-rotate-3 -translate-x-4 translate-y-4'}`}>
                    <div className={`w-full h-full rounded-2xl ${index % 2 === 0 ? 'bg-gradient-to-br from-blue-200 to-blue-300' : 'bg-gradient-to-br from-purple-200 to-purple-300'} opacity-20`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-16 border-t border-gray-200">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Pronto para começar sua jornada?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Junte-se aos mais de 500 profissionais que já transformaram suas carreiras com nossos cursos técnicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Matricule-se Agora
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;