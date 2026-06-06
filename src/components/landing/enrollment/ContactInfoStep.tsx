import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { EnrollmentData } from '../EnrollmentFlow';
import { ArrowLeft, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

interface ContactInfoStepProps {
  data: EnrollmentData;
  onUpdate: (data: Partial<EnrollmentData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ 
  data, 
  onUpdate, 
  onNext, 
  onPrev 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brazilianStates = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validação de email
    if (!data.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'E-mail deve ser válido';
    }

    // Validação de telefone/WhatsApp unificado
    if (!data.phone.trim()) {
      newErrors.phone = 'Telefone com WhatsApp é obrigatório';
    }

    // Validação de endereço
    if (!data.address.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }

    if (!data.address.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }

    if (!data.address.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }

    if (!data.address.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!data.address.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!data.address.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
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

  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 11) {
      if (numericValue.length <= 10) {
        return numericValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      }
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    // Atualiza tanto phone quanto whatsapp com o mesmo valor
    onUpdate({ 
      phone: formatted,
      whatsapp: formatted
    });
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    onUpdate({ 
      address: { 
        ...data.address, 
        zipCode: formatted 
      } 
    });
  };

  const handleAddressChange = (field: keyof EnrollmentData['address']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      address: {
        ...data.address,
        [field]: e.target.value
      }
    });
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span>Dados de Contato</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Informe seus dados de contato e endereço para finalizar a matrícula.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contato Section */}
            <div className="space-y-4">
              <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>Informações de Contato</span>
              </h3>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => onUpdate({ email: e.target.value })}
                  placeholder="seu.email@exemplo.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Telefone com WhatsApp */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone com WhatsApp *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-500">
                  Este número será usado para contato via telefone e WhatsApp
                </p>
              </div>
            </div>

            {/* Endereço Section */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Endereço</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rua */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    type="text"
                    value={data.address.street}
                    onChange={handleAddressChange('street')}
                    placeholder="Nome da rua"
                    className={errors.street ? 'border-red-500' : ''}
                  />
                  {errors.street && (
                    <p className="text-sm text-red-500">{errors.street}</p>
                  )}
                </div>

                {/* Número */}
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    type="text"
                    value={data.address.number}
                    onChange={handleAddressChange('number')}
                    placeholder="123"
                    className={errors.number ? 'border-red-500' : ''}
                  />
                  {errors.number && (
                    <p className="text-sm text-red-500">{errors.number}</p>
                  )}
                </div>
              </div>

              {/* Complemento */}
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  type="text"
                  value={data.address.complement}
                  onChange={handleAddressChange('complement')}
                  placeholder="Apartamento, bloco, etc. (opcional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bairro */}
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    type="text"
                    value={data.address.neighborhood}
                    onChange={handleAddressChange('neighborhood')}
                    placeholder="Nome do bairro"
                    className={errors.neighborhood ? 'border-red-500' : ''}
                  />
                  {errors.neighborhood && (
                    <p className="text-sm text-red-500">{errors.neighborhood}</p>
                  )}
                </div>

                {/* CEP */}
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={data.address.zipCode}
                    onChange={handleCEPChange}
                    placeholder="00000-000"
                    maxLength={9}
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-500">{errors.zipCode}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cidade */}
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={data.address.city}
                    onChange={handleAddressChange('city')}
                    placeholder="Nome da cidade"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Select 
                    value={data.address.state} 
                    onValueChange={(value) => onUpdate({ 
                      address: { ...data.address, state: value }
                    })}
                  >
                    <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {brazilianStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={onPrev} type="button">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
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

export default ContactInfoStep;
