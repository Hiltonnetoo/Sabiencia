// ============================================
// GERENCIAR LIVES PAGE - Página para professor/gestor gerenciar aulas ao vivo
// ============================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      toast.error(t('professor.gerenciarLives.toasts.selectSubject'));
      return;
    }
    if (!formData.titulo.trim()) {
      toast.error(t('professor.gerenciarLives.toasts.enterTitle'));
      return;
    }
    if (!formData.data_inicio || !formData.hora_inicio) {
      toast.error(t('professor.gerenciarLives.toasts.defineDateTime'));
      return;
    }
    if (!formData.link_sala.trim()) {
      toast.error(t('professor.gerenciarLives.toasts.enterRoomLink'));
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
    if (confirm(t('professor.gerenciarLives.toasts.confirmDelete'))) {
      deletarAulaAoVivo(aulaId);
    }
  };

  const handleNotificar = (aulaId: string) => {
    toast.success(t('professor.gerenciarLives.toasts.notificationsSent'));
    editarAulaAoVivo(aulaId, { notificacao_enviada: true });
  };

  const getDisciplinaNome = (disciplinaId: string) => {
    return disciplinas.find(d => d.id === disciplinaId)?.nome || t('professor.gerenciarLives.fallbackSubject');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('professor.gerenciarLives.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('professor.gerenciarLives.subtitle')}
          </p>
        </div>
        <Button onClick={() => handleAbrirDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('professor.gerenciarLives.newLive')}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="agendadas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agendadas" className="gap-2">
            <Calendar className="w-4 h-4" />
            {t('professor.gerenciarLives.tabs.scheduled', { count: aulasAgendadas.length })}
          </TabsTrigger>
          <TabsTrigger value="ao-vivo" className="gap-2">
            <Video className="w-4 h-4" />
            {t('professor.gerenciarLives.tabs.live', { count: aulasAoVivoAtivas.length })}
          </TabsTrigger>
          <TabsTrigger value="finalizadas" className="gap-2">
            <Clock className="w-4 h-4" />
            {t('professor.gerenciarLives.tabs.finished', { count: aulasFinalizadas.length })}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Agendadas */}
        <TabsContent value="agendadas">
          {aulasAgendadas.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('professor.gerenciarLives.empty.scheduledTitle')}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {t('professor.gerenciarLives.empty.scheduledDesc')}
                </p>
                <Button onClick={() => handleAbrirDialog()} className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t('professor.gerenciarLives.empty.createLive')}
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
                  {t('professor.gerenciarLives.empty.liveTitle')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('professor.gerenciarLives.empty.liveDesc')}
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
                  {t('professor.gerenciarLives.empty.finishedTitle')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('professor.gerenciarLives.empty.finishedDesc')}
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
              {aulaEditando ? t('professor.gerenciarLives.dialog.editTitle') : t('professor.gerenciarLives.dialog.newTitle')}
            </DialogTitle>
            <DialogDescription>
              {aulaEditando
                ? t('professor.gerenciarLives.dialog.editDescription')
                : t('professor.gerenciarLives.dialog.newDescription')
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Disciplina */}
            <div>
              <Label htmlFor="disciplina">{t('professor.gerenciarLives.dialog.subjectLabel')}</Label>
              <Select
                value={formData.disciplina_id}
                onValueChange={(value: string) => setFormData({ ...formData, disciplina_id: value })}
              >
                <SelectTrigger id="disciplina">
                  <SelectValue placeholder={t('professor.gerenciarLives.dialog.subjectPlaceholder')} />
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
              <Label htmlFor="turma">{t('professor.gerenciarLives.dialog.classLabel')}</Label>
              <Select
                value={formData.turma_id}
                onValueChange={(value: string) => setFormData({ ...formData, turma_id: value })}
              >
                <SelectTrigger id="turma">
                  <SelectValue placeholder={t('professor.gerenciarLives.dialog.allClasses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('professor.gerenciarLives.dialog.allClasses')}</SelectItem>
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
              <Label htmlFor="titulo">{t('professor.gerenciarLives.dialog.titleLabel')}</Label>
              <Input
                id="titulo"
                placeholder={t('professor.gerenciarLives.dialog.titlePlaceholder')}
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              />
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="descricao">{t('professor.gerenciarLives.dialog.descriptionLabel')}</Label>
              <Textarea
                id="descricao"
                placeholder={t('professor.gerenciarLives.dialog.descriptionPlaceholder')}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
              />
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data_inicio">{t('professor.gerenciarLives.dialog.dateLabel')}</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hora_inicio">{t('professor.gerenciarLives.dialog.timeLabel')}</Label>
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
              <Label htmlFor="duracao">{t('professor.gerenciarLives.dialog.durationLabel')}</Label>
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
              <Label htmlFor="plataforma">{t('professor.gerenciarLives.dialog.platformLabel')}</Label>
              <Select
                value={formData.plataforma}
                onValueChange={(value: any) => setFormData({ ...formData, plataforma: value })}
              >
                <SelectTrigger id="plataforma">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google_meet">{t('professor.gerenciarLives.platforms.google_meet')}</SelectItem>
                  <SelectItem value="zoom">{t('professor.gerenciarLives.platforms.zoom')}</SelectItem>
                  <SelectItem value="teams">{t('professor.gerenciarLives.platforms.teams')}</SelectItem>
                  <SelectItem value="jitsi">{t('professor.gerenciarLives.platforms.jitsi')}</SelectItem>
                  <SelectItem value="outro">{t('professor.gerenciarLives.platforms.outro')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Link da Sala */}
            <div>
              <Label htmlFor="link_sala">{t('professor.gerenciarLives.dialog.roomLinkLabel')}</Label>
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
              <Label htmlFor="senha_sala">{t('professor.gerenciarLives.dialog.roomPasswordLabel')}</Label>
              <Input
                id="senha_sala"
                placeholder={t('professor.gerenciarLives.dialog.roomPasswordPlaceholder')}
                value={formData.senha_sala}
                onChange={(e) => setFormData({ ...formData, senha_sala: e.target.value })}
              />
            </div>

            {/* Configurações */}
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 mb-3">{t('professor.gerenciarLives.dialog.settings')}</h4>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permite_chat"
                  checked={formData.permite_chat}
                  onChange={(e) => setFormData({ ...formData, permite_chat: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="permite_chat" className="cursor-pointer text-sm">
                  {t('professor.gerenciarLives.dialog.allowChat')}
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
                  {t('professor.gerenciarLives.dialog.allowMicrophone')}
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
                  {t('professor.gerenciarLives.dialog.allowCamera')}
                </Label>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSalvar} className="flex-1">
                {aulaEditando ? t('professor.gerenciarLives.dialog.update') : t('professor.gerenciarLives.dialog.create')}
              </Button>
              <Button variant="outline" onClick={handleFecharDialog}>
                {t('common.actions.cancel')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarLivesPage;
