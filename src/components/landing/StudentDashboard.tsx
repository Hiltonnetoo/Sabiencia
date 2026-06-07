import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Calendar, 
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  studentName?: string;
  onLogout?: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  studentName = "João Silva", 
  onLogout 
}) => {
  const currentCourse = {
    title: "Técnico em Enfermagem",
    progress: 68,
    nextClass: "Anatomia Humana - Módulo 3",
    nextClassDate: "Hoje, 19:30",
    totalHours: 1200,
    completedHours: 816,
    remainingDays: 156
  };

  const recentActivities = [
    { type: "video", title: "Aula: Procedimentos de Enfermagem", time: "2 dias atrás", completed: true },
    { type: "assignment", title: "Exercício: Anatomia do Sistema Circulatório", time: "3 dias atrás", completed: true },
    { type: "quiz", title: "Quiz: Administração de Medicamentos", time: "5 dias atrás", completed: false },
    { type: "certificate", title: "Certificado Módulo 2 disponível", time: "1 semana atrás", completed: false }
  ];

  const quickActions = [
    { icon: Play, label: "Próxima Aula", action: "Assistir", variant: "default" as const },
    { icon: FileText, label: "Material de Apoio", action: "Baixar", variant: "outline" as const },
    { icon: MessageSquare, label: "Fórum", action: "Participar", variant: "outline" as const },
    { icon: Calendar, label: "Calendário", action: "Ver Agenda", variant: "outline" as const }
  ];

  const stats = [
    { icon: BookOpen, label: "Módulos Concluídos", value: "2 de 6", color: "text-blue-600" },
    { icon: Clock, label: "Horas Estudadas", value: `${currentCourse.completedHours}h`, color: "text-green-600" },
    { icon: Award, label: "Certificados", value: "2", color: "text-orange-600" },
    { icon: TrendingUp, label: "Desempenho", value: "87%", color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Sa</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Área do Estudante</p>
                <p className="font-semibold text-gray-900">Sabiencia</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{studentName}</p>
                <p className="text-xs text-gray-500">Estudante</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onLogout}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {studentName}! 👋
          </h1>
          <p className="text-gray-600">
            Continue seus estudos e acompanhe seu progresso no curso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Course Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span>Seu Progresso Atual</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentCourse.title}</h3>
                    <p className="text-sm text-gray-600">
                      {currentCourse.completedHours}h de {currentCourse.totalHours}h concluídas
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-white">
                    {currentCourse.progress}% Completo
                  </Badge>
                </div>
                
                <Progress value={currentCourse.progress} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Play className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Próxima Aula</span>
                    </div>
                    <p className="text-sm text-blue-700">{currentCourse.nextClass}</p>
                    <p className="text-xs text-blue-600 mt-1">{currentCourse.nextClassDate}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Tempo Restante</span>
                    </div>
                    <p className="text-sm text-green-700">{currentCourse.remainingDays} dias</p>
                    <p className="text-xs text-green-600 mt-1">Para conclusão</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <action.icon className="w-5 h-5" />
                      <div className="text-center">
                        <p className="text-xs font-medium">{action.label}</p>
                        <p className="text-xs opacity-75">{action.action}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.completed ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {activity.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      {!activity.completed && (
                        <Button size="sm" variant="outline">
                          Completar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat de Suporte
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Base de Conhecimento
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Fórum da Turma
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Prova Presencial</span>
                  </div>
                  <p className="text-xs text-blue-700">15 de Março, 2025</p>
                  <p className="text-xs text-blue-600">Local: Sede Balsas/MA</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Webinar</span>
                  </div>
                  <p className="text-xs text-green-700">20 de Fevereiro, 2025</p>
                  <p className="text-xs text-green-600">Mercado de Trabalho em Saúde</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;