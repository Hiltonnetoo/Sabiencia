// ============================================
// GERENCIAR LIVES PAGE - Página para professor/gestor gerenciar aulas ao vivo
// ============================================

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMockData } from '../../contexts/MockDataContext';
import { useVideoaulas } from '../../contexts/VideoaulasContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LiveCard } from '../../components/lives/LiveCard';
import { 
  Plus, 
  Video, 
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import type { AulaAoVivo } from '../../types/videoaulas';

export const GerenciarLivesPage: React.FC = () => {
  const { user } = useAuth();
  const { disciplinas, turmas } = useMockData();
  const {
    aulasAoVivo,
    criarAulaAoVivo,
    editarAulaAoVivo,
    deletarAulaAoVivo
  } = useVideoaulas();

  const [dialogAberto, setDialogAberto] = useState(false);
  const [aulaEditando, setAulaEditando] = useState<AulaAoVivo | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    disciplina_id: '',
    turma_id: '',
    titulo: '',
    descricao: '',
    data_inicio: '',
    hora_inicio: '',
    duracao_minutos: 60,
    link_sala: '',
    plataforma: 'google_meet' as 'zoom' | 'google_meet' | 'teams' | 'jitsi' | 'outro',
    senha_sala: '',
    max_participantes: undefined as number | undefined,
    permite_chat: true,
    permite_camera_alunos: false,
    permite_microfone_alunos: true
  });

  // Minhas aulas ao vivo (se for professor)
  const minhasAulasAoVivo = user?.role === 'professor'
    ? aulasAoVivo.filter(a => a.professor_id === user.id)
    : aulasAoVivo;

  // Filtrar por status
  const agora = new Date();
  const aulasAgendadas = minhasAulasAoVivo.filter(
    a => a.status === 'agendada' && new Date(a.data_inicio) > agora
  );
  const aulasAoVivoAtivas = minhasAulasAoVivo.filter(a => a.status === 'ao_vivo');
  const aulasFinalizadas = minhasAulasAoVivo.filter(a => a.status === 'finalizada');

  const handleAbrirDialog = (aula?: AulaAoVivo) => {
    if (aula) {
      setAulaEditando(aula);
      const dataInicio = new Date(aula.data_inicio);
      setFormData({
        disciplina_id: aula.disciplina_id,
        turma_id: aula.turma_id || '',
        titulo: aula.titulo,
        descricao: aula.descricao,
        data_inicio: dataInicio.toISOString().split('T')[0],
        hora_inicio: dataInicio.toTimeString().slice(0, 5),
        duracao_minutos: aula.duracao_minutos,
        link_sala: aula.link_sala,
        plataforma: aula.plataforma,
        senha_sala: aula.senha_sala || '',
        max_participantes: aula.max_participantes,
        permite_chat: aula.permite_chat,
        permite_camera_alunos: aula.permite_camera_alunos,
        permite_microfone_alunos: aula.permite_microfone_alunos
      });
    } else {
      setAulaEditando(null);
      setFormData({
        disciplina_id: '',
        turma_id: '',
        titulo: '',
        descricao: '',
        data_inicio: '',
        hora_inicio: '',
        duracao_minutos: 60,
        link_sala: '',
        plataforma: 'google_meet',
        senha_sala: '',
        max_participantes: undefined,
        permite_chat: true,
        permite_camera_alunos: false,
        permite_microfone_alunos: true
      });
    }
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setAulaEditando(null);
  };

  const handleSalvar = () => {
    // Validações
    if (!formData.disciplina_id) {
      toast.error('Selecione uma disciplina');
      return;
    }
    if (!formData.titulo.trim()) {
      toast.error('Digite um título para a aula');
      return;
    }
    if (!formData.data_inicio || !formData.hora_inicio) {
      toast.error('Defina a data e hora de início');
      return;
    }
    if (!formData.link_sala.trim()) {
      toast.error('Digite o link da sala');
      return;
    }

    // Combinar data e hora
    const dataHoraInicio = new Date(`${formData.data_inicio}T${formData.hora_inicio}`);

    if (aulaEditando) {
      // Editar
      editarAulaAoVivo(aulaEditando.id, {
        ...formData,
        data_inicio: dataHoraInicio,
        senha_sala: formData.senha_sala || undefined,
        max_participantes: formData.max_participantes || undefined
      });
    } else {
      // Criar
      criarAulaAoVivo({
        ...formData,
        professor_id: user?.id || '',
        data_inicio: dataHoraInicio,
        senha_sala: formData.senha_sala || undefined,
        max_participantes: formData.max_participantes || undefined,
        status: 'agendada',
        notificacao_enviada: false
      } as any);
    }

    handleFecharDialog();
  };

  const handleDeletar = (aulaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta aula ao vivo?')) {
      deletarAulaAoVivo(aulaId);
    }
  };

  const handleNotificar = (aulaId: string) => {
    toast.success('Notificações enviadas para todos os alunos!');
    editarAulaAoVivo(aulaId, { notificacao_enviada: true });
  };

  const getDisciplinaNome = (disciplinaId: string) => {
    return disciplinas.find(d => d.id === disciplinaId)?.nome || 'Disciplina';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Aulas ao Vivo</h1>
          <p className="text-gray-600 mt-1">
            Crie e gerencie suas aulas ao vivo
          </p>
        </div>
        <Button onClick={() => handleAbrirDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Aula ao Vivo
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="agendadas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agendadas" className="gap-2">
            <Calendar className="w-4 h-4" />
            Agendadas ({aulasAgendadas.length})
          </TabsTrigger>
          <TabsTrigger value="ao-vivo" className="gap-2">
            <Video className="w-4 h-4" />
            Ao Vivo ({aulasAoVivoAtivas.length})
          </TabsTrigger>
          <TabsTrigger value="finalizadas" className="gap-2">
            <Clock className="w-4 h-4" />
            Finalizadas ({aulasFinalizadas.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Agendadas */}
        <TabsContent value="agendadas">
          {aulasAgendadas.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma aula agendada
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Crie uma nova aula ao vivo para seus alunos
                </p>
                <Button onClick={() => handleAbrirDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar Aula ao Vivo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aulasAgendadas
                .sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime())
                .map(aula => (
                  <LiveCard
                    key={aula.id}
                    aula={aula}
                    disciplinaNome={getDisciplinaNome(aula.disciplina_id)}
                    professorNome={user?.nome_completo}
                    onEntrarSala={() => window.open(aula.link_sala, '_blank')}
                    onEditar={() => handleAbrirDialog(aula)}
                    onDeletar={() => handleDeletar(aula.id)}
                    onNotificar={() => handleNotificar(aula.id)}
                    showActions={true}
                    userRole={user?.role as any}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Ao Vivo */}
        <TabsContent value="ao-vivo">
          {aulasAoVivoAtivas.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma aula ao vivo agora
                </h3>
                <p className="text-sm text-gray-600">
                  Não há aulas acontecendo neste momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aulasAoVivoAtivas.map(aula => (
                <LiveCard
                  key={aula.id}
                  aula={aula}
                  disciplinaNome={getDisciplinaNome(aula.disciplina_id)}
                  professorNome={user?.nome_completo}
                  participantes={Math.floor(Math.random() * 50) + 10}
                  onEntrarSala={() => window.open(aula.link_sala, '_blank')}
                  onEditar={() => handleAbrirDialog(aula)}
                  onDeletar={() => handleDeletar(aula.id)}
                  showActions={true}
                  userRole={user?.role as any}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Finalizadas */}
        <TabsContent value="finalizadas">
          {aulasFinalizadas.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma aula finalizada
                </h3>
                <p className="text-sm text-gray-600">
                  Aulas finalizadas aparecerão aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aulasFinalizadas
                .sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime())
                .map(aula => (
                  <LiveCard
                    key={aula.id}
                    aula={aula}
                    disciplinaNome={getDisciplinaNome(aula.disciplina_id)}
                    professorNome={user?.nome_completo}
                    onDeletar={() => handleDeletar(aula.id)}
                    showActions={true}
                    userRole={user?.role as any}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog: Criar/Editar Aula ao Vivo */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {aulaEditando ? 'Editar Aula ao Vivo' : 'Nova Aula ao Vivo'}
            </DialogTitle>
            <DialogDescription>
              {aulaEditando 
                ? 'Atualize as informações da aula ao vivo'
                : 'Agende uma nova aula ao vivo para seus alunos'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Disciplina */}
            <div>
              <Label htmlFor="disciplina">Disciplina *</Label>
              <Select
                value={formData.disciplina_id}
                onValueChange={(value: string) => setFormData({ ...formData, disciplina_id: value })}
              >
                <SelectTrigger id="disciplina">
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map(d => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Turma (opcional) */}
            <div>
              <Label htmlFor="turma">Turma (opcional)</Label>
              <Select
                value={formData.turma_id}
                onValueChange={(value: string) => setFormData({ ...formData, turma_id: value })}
              >
                <SelectTrigger id="turma">
                  <SelectValue placeholder="Todas as turmas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as turmas</SelectItem>
                  {turmas.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Revisão para Prova"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o que será abordado na aula..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_inicio">Data *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hora_inicio">Hora *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                />
              </div>
            </div>

            {/* Duração */}
            <div>
              <Label htmlFor="duracao">Duração (minutos) *</Label>
              <Input
                id="duracao"
                type="number"
                min="15"
                step="15"
                value={formData.duracao_minutos}
                onChange={(e) => setFormData({ ...formData, duracao_minutos: parseInt(e.target.value) || 60 })}
              />
            </div>

            {/* Plataforma */}
            <div>
              <Label htmlFor="plataforma">Plataforma *</Label>
              <Select
                value={formData.plataforma}
                onValueChange={(value: any) => setFormData({ ...formData, plataforma: value })}
              >
                <SelectTrigger id="plataforma">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">Google Meet</SelectItem>
                  <SelectItem value="zoom">Zoom</SelectItem>
                  <SelectItem value="teams">Microsoft Teams</SelectItem>
                  <SelectItem value="jitsi">Jitsi</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link da Sala */}
            <div>
              <Label htmlFor="link_sala">Link da Sala *</Label>
              <Input
                id="link_sala"
                type="url"
                placeholder="https://meet.google.com/abc-defg-hij"
                value={formData.link_sala}
                onChange={(e) => setFormData({ ...formData, link_sala: e.target.value })}
              />
            </div>

            {/* Senha (opcional) */}
            <div>
              <Label htmlFor="senha_sala">Senha da Sala (opcional)</Label>
              <Input
                id="senha_sala"
                placeholder="Digite a senha se houver"
                value={formData.senha_sala}
                onChange={(e) => setFormData({ ...formData, senha_sala: e.target.value })}
              />
            </div>

            {/* Configurações */}
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 mb-3">Configurações</h4>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permite_chat"
                  checked={formData.permite_chat}
                  onChange={(e) => setFormData({ ...formData, permite_chat: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="permite_chat" className="cursor-pointer text-sm">
                  Permitir chat durante a aula
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permite_microfone"
                  checked={formData.permite_microfone_alunos}
                  onChange={(e) => setFormData({ ...formData, permite_microfone_alunos: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="permite_microfone" className="cursor-pointer text-sm">
                  Alunos podem usar microfone
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permite_camera"
                  checked={formData.permite_camera_alunos}
                  onChange={(e) => setFormData({ ...formData, permite_camera_alunos: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="permite_camera" className="cursor-pointer text-sm">
                  Alunos podem usar câmera
                </Label>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSalvar} className="flex-1">
                {aulaEditando ? 'Atualizar' : 'Criar'} Aula ao Vivo
              </Button>
              <Button variant="outline" onClick={handleFecharDialog}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarLivesPage;
