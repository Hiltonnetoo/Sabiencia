import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { EnrollmentData } from '../EnrollmentFlow';
import { User, ArrowRight } from 'lucide-react';

interface PersonalInfoStepProps {
  data: EnrollmentData;
  onUpdate: (data: Partial<EnrollmentData>) => void;
  onNext: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onUpdate, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!data.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data.cpf) && !/^\d{11}$/.test(data.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }

    if (!data.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (!data.gender) {
      newErrors.gender = 'Gênero é obrigatório';
    }

    if (!data.education) {
      newErrors.education = 'Escolaridade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 11) {
      const formattedValue = numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      return formattedValue;
    }
    return data.cpf;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    onUpdate({ cpf: formatted });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Informações Pessoais</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Preencha seus dados pessoais para iniciar o processo de matrícula.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                type="text"
                value={data.fullName}
                onChange={(e) => onUpdate({ fullName: e.target.value })}
                placeholder="Digite seu nome completo"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={data.cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={errors.cpf ? 'border-red-500' : ''}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={data.birthDate}
                  onChange={(e) => onUpdate({ birthDate: e.target.value })}
                  className={errors.birthDate ? 'border-red-500' : ''}
                />
                {errors.birthDate && (
                  <p className="text-sm text-red-500">{errors.birthDate}</p>
                )}
              </div>
            </div>

            {/* Gênero */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gênero *</Label>
              <Select value={data.gender} onValueChange={(value) => onUpdate({ gender: value })}>
                <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="nao-binario">Não-binário</SelectItem>
                  <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>

            {/* Escolaridade */}
            <div className="space-y-2">
              <Label htmlFor="education">Escolaridade *</Label>
              <Select value={data.education} onValueChange={(value) => onUpdate({ education: value })}>
                <SelectTrigger className={errors.education ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione sua escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fundamental-incompleto">Ensino Fundamental Incompleto</SelectItem>
                  <SelectItem value="fundamental-completo">Ensino Fundamental Completo</SelectItem>
                  <SelectItem value="medio-incompleto">Ensino Médio Incompleto</SelectItem>
                  <SelectItem value="medio-completo">Ensino Médio Completo</SelectItem>
                  <SelectItem value="superior-incompleto">Ensino Superior Incompleto</SelectItem>
                  <SelectItem value="superior-completo">Ensino Superior Completo</SelectItem>
                  <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
                </SelectContent>
              </Select>
              {errors.education && (
                <p className="text-sm text-red-500">{errors.education}</p>
              )}
            </div>

            {/* Experiência Profissional */}
            <div className="space-y-2">
              <Label htmlFor="workExperience">Experiência Profissional</Label>
              <Select value={data.workExperience} onValueChange={(value) => onUpdate({ workExperience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua experiência profissional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem-experiencia">Sem experiência</SelectItem>
                  <SelectItem value="ate-1-ano">Até 1 ano</SelectItem>
                  <SelectItem value="1-3-anos">1 a 3 anos</SelectItem>
                  <SelectItem value="3-5-anos">3 a 5 anos</SelectItem>
                  <SelectItem value="5-10-anos">5 a 10 anos</SelectItem>
                  <SelectItem value="mais-10-anos">Mais de 10 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Próxima Etapa
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoStep;