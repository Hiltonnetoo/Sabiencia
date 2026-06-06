// ============================================
// ATIVIDADES RECENTES - Lista de atividades do usuário
// ============================================

import { Activity, LogIn, Edit, Lock, Camera, FileText } from 'lucide-react';

type AtividadeTipo = 'login' | 'edicao' | 'senha' | 'foto' | 'outro';

interface Atividade {
  id: string;
  tipo: AtividadeTipo;
  descricao: string;
  data: string;
  ip?: string;
}

interface AtividadesRecentesProps {
  atividades?: Atividade[];
}

export function AtividadesRecentes({ atividades = [] }: AtividadesRecentesProps) {
  const getIconByType = (tipo: AtividadeTipo) => {
    const icons = {
      login: <LogIn className="w-4 h-4" />,
      edicao: <Edit className="w-4 h-4" />,
      senha: <Lock className="w-4 h-4" />,
      foto: <Camera className="w-4 h-4" />,
      outro: <FileText className="w-4 h-4" />,
    };
    return icons[tipo] || icons.outro;
  };

  const getColorByType = (tipo: AtividadeTipo) => {
    const colors = {
      login: 'bg-green-100 text-green-600',
      edicao: 'bg-blue-100 text-blue-600',
      senha: 'bg-yellow-100 text-yellow-600',
      foto: 'bg-purple-100 text-purple-600',
      outro: 'bg-gray-100 text-gray-600',
    };
    return colors[tipo] || colors.outro;
  };

  // Atividades mockadas se não forem fornecidas
  const atividadesMock: Atividade[] = [
    {
      id: '1',
      tipo: 'login',
      descricao: 'Login realizado com sucesso',
      data: new Date().toISOString(),
      ip: '192.168.1.100',
    },
    {
      id: '2',
      tipo: 'edicao',
      descricao: 'Perfil atualizado',
      data: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '3',
      tipo: 'senha',
      descricao: 'Senha alterada',
      data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      id: '4',
      tipo: 'foto',
      descricao: 'Foto de perfil atualizada',
      data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    },
    {
      id: '5',
      tipo: 'login',
      descricao: 'Login realizado',
      data: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      ip: '192.168.1.101',
    },
  ];

  const atividadesExibir = atividades.length > 0 ? atividades : atividadesMock;

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();

    const minutos = Math.floor(diff / (1000 * 60));
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return minutos === 0 ? 'Agora mesmo' : `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    } else if (horas < 24) {
      return `Há ${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (dias < 30) {
      return `Há ${dias} dia${dias > 1 ? 's' : ''}`;
    } else {
      return data.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Activity className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl text-gray-900">Atividades Recentes</h2>
          <p className="text-sm text-gray-600">Histórico de ações na sua conta</p>
        </div>
      </div>

      <div className="space-y-3">
        {atividadesExibir.map((atividade) => (
          <div
            key={atividade.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 rounded-lg ${getColorByType(atividade.tipo)}`}>
              {getIconByType(atividade.tipo)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{atividade.descricao}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">{formatarData(atividade.data)}</p>
                {atividade.ip && (
                  <>
                    <span className="text-xs text-gray-600">•</span>
                    <p className="text-xs text-gray-500">IP: {atividade.ip}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {atividadesExibir.length === 0 && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhuma atividade recente</p>
        </div>
      )}
    </div>
  );
}
