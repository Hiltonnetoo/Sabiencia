import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { SabienciaSymbol } from '../brand/SabienciaBrand';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const courses = [
    'Técnico em Enfermagem',
    'Técnico em Administração',
    'Técnico em Contabilidade'
  ];

  const quickLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Cursos', href: '#cursos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contato', href: '#contato' },
    { name: 'Blog', href: '#blog' },
    { name: 'Área do Aluno', href: '#login' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-500' }
  ];

  const legalLinks = [
    { name: 'Política de Privacidade', href: '#' },
    { name: 'Termos de Uso', href: '#' },
    { name: 'Política de Cookies', href: '#' },
    { name: 'LGPD', href: '#' }
  ];

  return (
    <footer role="contentinfo" className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              {/* Logo */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
                </div>
                <span className="text-xl font-semibold text-white">Sabiencia</span>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm">
                Formando profissionais qualificados há 2 anos. Cursos técnicos 100% online 
                com certificação reconhecida pelo MEC e comprovação presencial.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-white mb-3">Siga-nos</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-300 transition-colors ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-white mb-6">Nossos Cursos</h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course}>
                  <a
                    href="#cursos"
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {course}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Ver Todos os Cursos
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6">Contato</h4>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Rua Paulo Ramos, 225</p>
                  <p>Centro - Balsas/MA</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>(99) 98510-4312</p>
                  <p className="text-xs text-green-400">WhatsApp disponível</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>contato@sabiencia.edu.br</p>
                  <p>matricula@sabiencia.edu.br</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-gray-800">
                <h5 className="font-medium text-white text-sm mb-2">Horários de Atendimento</h5>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábados: 8h às 12h</p>
                  <p>WhatsApp: 24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Fique por dentro das novidades
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Receba informações sobre novos cursos, datas de matrícula e dicas para sua carreira profissional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-auto"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-300">
              <p>&copy; {currentYear} Sabiencia. Todos os direitos reservados.</p>
              <p className="text-xs text-gray-400 mt-1">
                CNPJ: 12.345.678/0001-90 | Credenciamento MEC nº 12345
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Esta escola segue todas as diretrizes do MEC para educação técnica profissional. 
              Os certificados emitidos têm validade nacional e são reconhecidos pelo mercado de trabalho.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
