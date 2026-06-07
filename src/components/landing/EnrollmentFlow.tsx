import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import PersonalInfoStep from './enrollment/PersonalInfoStep';
import CourseSelectionStep from './enrollment/CourseSelectionStep';
import ContactInfoStep from './enrollment/ContactInfoStep';
import ConfirmationStep from './enrollment/ConfirmationStep';
import { X } from 'lucide-react';

export interface EnrollmentData {
  // Informações Pessoais
  fullName: string;
  cpf: string;
  birthDate: string;
  gender: string;
  
  // Informações de Contato
  email: string;
  phone: string;
  whatsapp: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Curso selecionado
  selectedCourse: {
    id: number;
    title: string;
    price: string;
    duration: string;
  } | null;
  
  // Informações acadêmicas
  education: string;
  workExperience: string;
}

interface EnrollmentFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnrollmentFlow: React.FC<EnrollmentFlowProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    fullName: '',
    cpf: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    selectedCourse: null,
    education: '',
    workExperience: ''
  });

  const updateEnrollmentData = (data: Partial<EnrollmentData>) => {
    setEnrollmentData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setEnrollmentData({
      fullName: '',
      cpf: '',
      birthDate: '',
      gender: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      selectedCourse: null,
      education: '',
      workExperience: ''
    });
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informações Pessoais';
      case 2: return 'Escolha seu Curso';
      case 3: return 'Dados de Contato';
      case 4: return 'Confirmação';
      default: return '';
    }
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={enrollmentData}
            onUpdate={updateEnrollmentData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <CourseSelectionStep
            data={enrollmentData}
            onUpdate={updateEnrollmentData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ContactInfoStep
            data={enrollmentData}
            onUpdate={updateEnrollmentData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            data={enrollmentData}
            onPrev={prevStep}
            onComplete={handleClose}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Matrícula Online
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Etapa {currentStep} de {totalSteps}: {getStepTitle()}
              </DialogDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {getStepComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentFlow;