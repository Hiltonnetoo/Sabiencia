import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu, Play } from 'lucide-react';
import EnrollmentFlow from './EnrollmentFlow';
import LoginFlow from './LoginFlow';
import { SabienciaSymbol } from '../brand/SabienciaBrand';

interface HeaderProps {
  onLoginSuccess?: (studentName: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLoginSuccess = (name: string) => {
    if (onLoginSuccess) {
      onLoginSuccess(name);
    }
  };

  const navigation = [
    { name: 'Início', href: '#home' },
    { name: 'Cursos', href: '#cursos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contato', href: '#contato' },
    { name: 'Blog', href: '#blog' },
  ];

  return (
    <>
      <header role="banner" className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Sabiencia</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav role="navigation" aria-label="Menu principal" className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/demo')}
              >
                <Play className="h-4 w-4 mr-2" />
                Ver Demonstração
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/demo/loginaluno')}
              >
                Login
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setIsEnrollmentOpen(true)}
              >
                Matricule-se
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 px-6 py-6">
                  <div className="flex flex-col space-y-6 mt-2">
                    {/* Mobile Logo */}
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
                      </div>
                      <span className="text-xl font-semibold text-gray-900">Sabiencia</span>
                    </div>
                    
                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                        >
                          {item.name}
                        </a>
                      ))}
                    </nav>
                    
                    {/* Mobile Actions */}
                    <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/demo');
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Ver Demonstração
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setIsOpen(false);
                          setIsLoginOpen(true);
                        }}
                      >
                        Login
                      </Button>
                      <Button 
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                          setIsOpen(false);
                          setIsEnrollmentOpen(true);
                        }}
                      >
                        Matricule-se
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      {/* Enrollment Flow Modal */}
      <EnrollmentFlow 
        isOpen={isEnrollmentOpen} 
        onClose={() => setIsEnrollmentOpen(false)} 
      />
      
      {/* Login Flow Modal */}
      <LoginFlow 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onOpenEnrollment={() => {
          setIsLoginOpen(false);
          setIsEnrollmentOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;
