import React from 'react';
import { Badge } from '../ui/badge';
import { Calendar, Monitor, Award, Headphones, Clock, Users, MapPin, CheckCircle } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: '2 Anos de Experiência',
      description: 'Escola consolidada no mercado com histórico comprovado de formação de profissionais qualificados.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Monitor,
      title: '100% Online',
      description: 'Estude quando e onde quiser. Aulas gravadas e ao vivo, disponíveis 24h na nossa plataforma.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Award,
      title: 'Certificação Reconhecida',
      description: 'Certificados válidos em todo território nacional, reconhecidos pelo MEC e aceitos pelo mercado.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Headphones,
      title: 'Suporte Personalizado',
      description: 'Acompanhamento individual com tutores especializados e suporte técnico sempre disponível.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const benefits = [
    { text: 'Aulas ao vivo e gravadas', icon: Clock },
    { text: 'Professores especializados', icon: Users },
    { text: 'Provas presenciais em nossa sede', icon: MapPin },
    { text: 'Material didático incluso', icon: CheckCircle },
    { text: 'Acesso vitalício ao conteúdo', icon: CheckCircle },
    { text: 'Certificado digital e impresso', icon: Award }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 bg-blue-50 border-blue-200 text-blue-700">
            Nossos Diferenciais
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Por que escolher nossa escola?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Conheça os diferenciais que fazem da nossa escola a melhor escolha para sua formação técnica profissional.
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
                  Metodologia que funciona
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nossa abordagem combina flexibilidade do ensino online com a credibilidade das avaliações presenciais. 
                  Você estuda no seu ritmo e comprova seu conhecimento de forma consistente.
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
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600 text-sm font-medium">Alunos Formados</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600 text-sm font-medium">Taxa de Aprovação</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                <div className="text-gray-600 text-sm font-medium">Cursos Disponíveis</div>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
                <div className="text-gray-600 text-sm font-medium">Anos de Experiência</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;