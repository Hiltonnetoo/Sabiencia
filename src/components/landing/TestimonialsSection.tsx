import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva Santos',
      course: 'Técnico em Informática',
      role: 'Desenvolvedora Web',
      company: 'TechStart Solutions',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      testimony: 'O curso superou minhas expectativas! A metodologia online com provas presenciais me deu confiança total no certificado. Hoje trabalho como desenvolvedora e consegui aumentar meu salário em 80%. Os professores são excelentes e o suporte é incomparável.',
      completedYear: '2024',
      salaryIncrease: '80%'
    },
    {
      id: 2,
      name: 'João Pedro Costa',
      course: 'Técnico em Administração',
      role: 'Coordenador Administrativo',
      company: 'Empresa Nacional Ltda',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      testimony: 'Flexibilidade total para estudar! Como pai de família, consegui conciliar trabalho, estudos e família. O material é muito completo e as aulas são dinâmicas. Após me formar, assumi a coordenação do setor administrativo da empresa onde trabalho.',
      completedYear: '2023',
      salaryIncrease: '45%'
    },
    {
      id: 3,
      name: 'Ana Carolina Ferreira',
      course: 'Técnico em Contabilidade',
      role: 'Contadora Plena',
      company: 'Consultoria Fiscal ABC',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      testimony: 'A qualidade do ensino é excepcional. Saí do curso preparada para o mercado de trabalho real. Os casos práticos fizeram toda diferença na minha formação. Recomendo para todos que buscam uma educação técnica de qualidade e reconhecimento profissional.',
      completedYear: '2024',
      salaryIncrease: '60%'
    },
    {
      id: 4,
      name: 'Rafael Oliveira',
      course: 'Técnico em Informática',
      role: 'Analista de Suporte',
      company: 'TI Solutions Corp',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      testimony: 'Mudei completamente de área profissional através do curso. Saí da área comercial para TI e não me arrependo. O acompanhamento dos tutores foi fundamental para meu sucesso. Hoje trabalho em uma empresa de tecnologia e tenho uma carreira sólida pela frente.',
      completedYear: '2023',
      salaryIncrease: '120%'
    },
    {
      id: 5,
      name: 'Patrícia Mendes',
      course: 'Técnico em Administração',
      role: 'Gestora de Projetos',
      company: 'Inovação Empresarial',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      rating: 5,
      testimony: 'Curso muito bem estruturado! A parte de gestão de pessoas e planejamento estratégico transformou minha visão empresarial. Consegui uma promoção antes mesmo de terminar o curso. A escola realmente prepara para o mercado de trabalho atual.',
      completedYear: '2024',
      salaryIncrease: '50%'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 bg-white/10 border-white/20 text-white">
            Depoimentos
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            O que nossos alunos dizem
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            Mais de 500 profissionais já transformaram suas carreiras. Conheça algumas histórias de sucesso.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Desktop View - 3 Cards */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 transform transition-all duration-500 ${
                  index === 1 ? 'scale-105 bg-white/15' : ''
                }`}
              >
                <TestimonialCard testimonial={testimonial} featured={index === 1} />
              </div>
            ))}
          </div>

          {/* Mobile View - 1 Card */}
          <div className="lg:hidden">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <TestimonialCard testimonial={testimonials[currentSlide]} featured={true} />
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
            <div className="text-blue-200 text-sm">Alunos Formados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-blue-200 text-sm">Aprovação</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">4.8</div>
            <div className="text-blue-200 text-sm">Nota Média</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">85%</div>
            <div className="text-blue-200 text-sm">Empregabilidade</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, featured = false }) => {
  return (
    <div className="relative h-full flex flex-col">
      {/* Quote Icon */}
      <div className="absolute -top-2 -left-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Quote className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>

      {/* Testimony */}
      <blockquote className="text-white/90 leading-relaxed mb-6 flex-grow">
        "{testimonial.testimony}"
      </blockquote>

      {/* Author Info */}
      <div className="flex items-start space-x-4">
        <ImageWithFallback
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
        />
        <div className="flex-1">
          <div className="font-semibold text-white mb-1">{testimonial.name}</div>
          <div className="text-sm text-blue-200 mb-1">{testimonial.role}</div>
          <div className="text-xs text-blue-300">{testimonial.company}</div>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline" className="bg-green-500/20 border-green-400/30 text-green-300 text-xs">
              +{testimonial.salaryIncrease}
            </Badge>
            <span className="text-xs text-blue-300">{testimonial.course}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;