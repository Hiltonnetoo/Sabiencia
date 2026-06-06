// ============================================
// CERTIFICADOS PAGE - Visualizar e Baixar Certificados
// ============================================

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Award,
  Download,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Share2
} from 'lucide-react';
import { PageBreadcrumb } from '../../components/shared/PageBreadcrumb';
import { toast } from 'sonner';
import type { Certificado } from '../../types';

export const CertificadosPage: React.FC = () => {
  // Certificados mockados
  const certificados: Certificado[] = [
    {
      id: '1',
      aluno_id: 'aluno1',
      tipo: 'conclusao_curso',
      referencia_id: 'curso1',
      titulo: 'Certificado de Conclusão - Técnico em Enfermagem',
      descricao: 'Certifica que concluiu com aproveitamento o curso Técnico em Enfermagem',
      carga_horaria: 1200,
      data_emissao: new Date('2024-06-15'),
      codigo_validacao: 'CERT-2024-ENF-001234',
      url_pdf: 'https://example.com/certificados/cert001234.pdf',
      created_at: new Date('2024-06-15')
    },
    {
      id: '2',
      aluno_id: 'aluno1',
      tipo: 'participacao_evento',
      referencia_id: 'evento1',
      titulo: 'Certificado de Participação - Workshop de Primeiros Socorros',
      descricao: 'Certifica a participação no Workshop de Técnicas de Primeiros Socorros',
      carga_horaria: 8,
      data_emissao: new Date('2024-10-20'),
      codigo_validacao: 'CERT-2024-EVT-005678',
      url_pdf: 'https://example.com/certificados/cert005678.pdf',
      created_at: new Date('2024-10-20')
    },
    {
      id: '3',
      aluno_id: 'aluno1',
      tipo: 'horas_complementares',
      referencia_id: 'ativ1',
      titulo: 'Certificado de Horas Complementares',
      descricao: 'Certifica o cumprimento de 80 horas de atividades complementares',
      carga_horaria: 80,
      data_emissao: new Date('2024-11-01'),
      codigo_validacao: 'CERT-2024-HC-009012',
      created_at: new Date('2024-11-01')
    }
  ];

  const handleBaixarCertificado = (certificado: Certificado) => {
    if (certificado.url_pdf) {
      toast.success('Download iniciado!', {
        description: 'Seu certificado está sendo baixado.',
      });
      // Simular download
      window.open(certificado.url_pdf, '_blank');
    } else {
      toast.info('Gerando certificado...', {
        description: 'Seu certificado será gerado em instantes.',
      });
    }
  };

  const handleVisualizarCertificado = (certificado: Certificado) => {
    toast.info('Abrindo visualização...');
  };

  const handleCompartilhar = (certificado: Certificado) => {
    navigator.clipboard.writeText(certificado.codigo_validacao);
    toast.success('Código de validação copiado!', {
      description: 'Compartilhe este código para validar seu certificado.',
    });
  };

  const getTipoLabel = (tipo: Certificado['tipo']) => {
    switch (tipo) {
      case 'conclusao_curso': return 'Conclusão de Curso';
      case 'participacao_evento': return 'Participação em Evento';
      case 'aprovacao_disciplina': return 'Aprovação em Disciplina';
      case 'horas_complementares': return 'Horas Complementares';
    }
  };

  const getTipoColor = (tipo: Certificado['tipo']) => {
    switch (tipo) {
      case 'conclusao_curso': return 'bg-purple-100 text-purple-700';
      case 'participacao_evento': return 'bg-blue-100 text-blue-700';
      case 'aprovacao_disciplina': return 'bg-green-100 text-green-700';
      case 'horas_complementares': return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meus Certificados</h1>
        <p className="text-gray-600 mt-1">
          Visualize, baixe e compartilhe seus certificados
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Certificados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificados.length}</p>
                <p className="text-xs text-gray-500">emitidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Cursos Concluídos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-gray-500">curso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Horas Certificadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {certificados.reduce((sum, cert) => sum + (cert.carga_horaria || 0), 0)}
                </p>
                <p className="text-xs text-gray-500">horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-gray-500">participação</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Certificados */}
      <div className="space-y-4">
        {certificados.map((certificado) => (
          <Card key={certificado.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-600">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* Ícone */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="flex-1">
                    {/* Título e Badges */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {certificado.titulo}
                      </h3>
                      <Badge className={getTipoColor(certificado.tipo)}>
                        {getTipoLabel(certificado.tipo)}
                      </Badge>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-600 mb-4">{certificado.descricao}</p>

                    {/* Detalhes */}
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 mb-1">Data de Emissão</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {certificado.data_emissao.toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      {certificado.carga_horaria && (
                        <div>
                          <p className="text-gray-500 mb-1">Carga Horária</p>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {certificado.carga_horaria} horas
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-gray-500 mb-1">Código de Validação</p>
                        <p className="font-mono text-xs font-medium text-blue-600">
                          {certificado.codigo_validacao}
                        </p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleBaixarCertificado(certificado)}
                        className="gap-2"
                        size="sm"
                      >
                        <Download className="h-4 w-4" />
                        Baixar PDF
                      </Button>
                      <Button
                        onClick={() => handleVisualizarCertificado(certificado)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button
                        onClick={() => handleCompartilhar(certificado)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações sobre Validação */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Como validar meu certificado?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Todos os certificados emitidos possuem um código de validação único. Para validar a autenticidade
                de um certificado:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 ml-4">
                <li>1. Acesse o site da instituição na página de validação de certificados</li>
                <li>2. Insira o código de validação do certificado</li>
                <li>3. O sistema confirmará os dados e a autenticidade do documento</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificadosPage;
