import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import LessonDashboard from './LessonDashboard';
import { SabienciaSymbol } from '../brand/SabienciaBrand';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  Calendar, 
  Users,
  Download,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  Home,
  GraduationCap,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Star,
  BarChart3,
  PlayCircle,
  Target,
  Trophy,
  Timer,
  BookMarked,
  Headphones,
  Printer,
  Presentation,
  FolderOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface StudentPlatformProps {
  studentName?: string;
  onLogout?: () => void;
}

const StudentPlatform: React.FC<StudentPlatformProps> = ({ 
  studentName = "João Silva", 
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedSubjects, setExpandedSubjects] = useState<number[]>([]);
  const [isWatchingLesson, setIsWatchingLesson] = useState(false);

  // Dados do curso atual
  const currentCourse = {
    id: 1,
    title: "Técnico em Enfermagem",
    instructor: "Prof. Ana Costa",
    progress: 68,
    totalModules: 6,
    completedModules: 4,
    totalHours: 1200,
    completedHours: 816,
    remainingDays: 156,
    nextClass: "Anatomia Humana - Sistema Circulatório",
    nextClassDate: "Hoje, 19:30",
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
    totalStudents: 1243
  };

  // Disciplinas do curso com conteúdos
  const subjects = [
    {
      id: 1,
      name: "Anatomia Humana",
      modules: 8,
      completedModules: 6,
      progress: 75,
      status: "em_andamento",
      nextLesson: "Sistema Respiratório",
      totalHours: 120,
      completedHours: 90,
      grade: 8.5,
      contents: [
        {
          id: 1,
          title: "Introdução à Anatomia Humana",
          description: "Conceitos básicos e terminologia anatômica",
          duration: "45 min",
          completed: true,
          materials: {
            slides: "anatomia-intro-slides.pdf",
            material: "anatomia-intro-apostila.pdf",
            audio: "anatomia-intro-audio.mp3"
          }
        },
        {
          id: 2,
          title: "Sistema Esquelético",
          description: "Estrutura e função dos ossos e articulações",
          duration: "60 min",
          completed: true,
          materials: {
            slides: "sistema-esqueletico-slides.pdf",
            material: "sistema-esqueletico-apostila.pdf",
            audio: "sistema-esqueletico-audio.mp3"
          }
        },
        {
          id: 3,
          title: "Sistema Muscular",
          description: "Tipos de músculos e contração muscular",
          duration: "50 min",
          completed: true,
          materials: {
            slides: "sistema-muscular-slides.pdf",
            material: "sistema-muscular-apostila.pdf",
            audio: "sistema-muscular-audio.mp3"
          }
        },
        {
          id: 4,
          title: "Sistema Circulatório",
          description: "Coração, vasos sanguíneos e circulação",
          duration: "55 min",
          completed: false,
          materials: {
            slides: "sistema-circulatorio-slides.pdf",
            material: "sistema-circulatorio-apostila.pdf",
            audio: "sistema-circulatorio-audio.mp3"
          }
        }
      ]
    },
    {
      id: 2,
      name: "Fisiologia",
      modules: 6,
      completedModules: 4,
      progress: 67,
      status: "em_andamento",
      nextLesson: "Função Cardiovascular",
      totalHours: 80,
      completedHours: 54,
      grade: 9.0,
      contents: [
        {
          id: 1,
          title: "Fundamentos da Fisiologia",
          description: "Homeostase e funções celulares básicas",
          duration: "40 min",
          completed: true,
          materials: {
            slides: "fisiologia-fundamentos-slides.pdf",
            material: "fisiologia-fundamentos-apostila.pdf",
            audio: "fisiologia-fundamentos-audio.mp3"
          }
        },
        {
          id: 2,
          title: "Fisiologia Cardiovascular",
          description: "Funcionamento do coração e pressão arterial",
          duration: "50 min",
          completed: true,
          materials: {
            slides: "fisiologia-cardio-slides.pdf",
            material: "fisiologia-cardio-apostila.pdf",
            audio: "fisiologia-cardio-audio.mp3"
          }
        },
        {
          id: 3,
          title: "Fisiologia Respiratória",
          description: "Mecânica respiratória e trocas gasosas",
          duration: "45 min",
          completed: false,
          materials: {
            slides: "fisiologia-respiratoria-slides.pdf",
            material: "fisiologia-respiratoria-apostila.pdf",
            audio: "fisiologia-respiratoria-audio.mp3"
          }
        }
      ]
    },
    {
      id: 3,
      name: "Procedimentos de Enfermagem",
      modules: 10,
      completedModules: 2,
      progress: 20,
      status: "bloqueado",
      nextLesson: "Administração de Medicamentos",
      totalHours: 150,
      completedHours: 30,
      grade: null,
      contents: [
        {
          id: 1,
          title: "Técnicas Básicas de Enfermagem",
          description: "Procedimentos fundamentais e biossegurança",
          duration: "60 min",
          completed: false,
          materials: {
            slides: "tecnicas-basicas-slides.pdf",
            material: "tecnicas-basicas-apostila.pdf",
            audio: "tecnicas-basicas-audio.mp3"
          }
        },
        {
          id: 2,
          title: "Administração de Medicamentos",
          description: "Vias de administração e cálculos de dosagem",
          duration: "70 min",
          completed: false,
          materials: {
            slides: "admin-medicamentos-slides.pdf",
            material: "admin-medicamentos-apostila.pdf",
            audio: "admin-medicamentos-audio.mp3"
          }
        }
      ]
    },
    {
      id: 4,
      name: "Ética e Legislação",
      modules: 4,
      completedModules: 4,
      progress: 100,
      status: "concluido",
      nextLesson: null,
      totalHours: 60,
      completedHours: 60,
      grade: 9.5,
      contents: [
        {
          id: 1,
          title: "Código de Ética em Enfermagem",
          description: "Princípios éticos e responsabilidades profissionais",
          duration: "30 min",
          completed: true,
          materials: {
            slides: "codigo-etica-slides.pdf",
            material: "codigo-etica-apostila.pdf",
            audio: "codigo-etica-audio.mp3"
          }
        },
        {
          id: 2,
          title: "Lei do Exercício Profissional",
          description: "Regulamentação da profissão de enfermagem",
          duration: "35 min",
          completed: true,
          materials: {
            slides: "lei-exercicio-slides.pdf",
            material: "lei-exercicio-apostila.pdf",
            audio: "lei-exercicio-audio.mp3"
          }
        },
        {
          id: 3,
          title: "Direitos do Paciente",
          description: "Conhecendo os direitos fundamentais do paciente",
          duration: "25 min",
          completed: true,
          materials: {
            slides: "direitos-paciente-slides.pdf",
            material: "direitos-paciente-apostila.pdf",
            audio: "direitos-paciente-audio.mp3"
          }
        }
      ]
    }
  ];

  // Atividades recentes
  const recentActivities = [
    { 
      id: 1, 
      type: "video", 
      title: "Aula: Sistema Circulatório", 
      duration: "45 min",
      time: "2 horas atrás", 
      completed: true,
      subject: "Anatomia Humana"
    },
    { 
      id: 2, 
      type: "quiz", 
      title: "Quiz: Função Cardíaca", 
      questions: 10,
      time: "1 dia atrás", 
      completed: true,
      subject: "Fisiologia",
      score: 90
    },
    { 
      id: 3, 
      type: "assignment", 
      title: "Exercício: Anatomia do Coração", 
      time: "2 dias atrás", 
      completed: false,
      subject: "Anatomia Humana",
      deadline: "Amanhã"
    }
  ];

  // Próximas aulas
  const upcomingClasses = [
    {
      id: 1,
      title: "Sistema Respiratório",
      subject: "Anatomia Humana",
      date: "Hoje",
      time: "19:30",
      duration: "90 min",
      type: "Aula ao vivo"
    },
    {
      id: 2,
      title: "Pressão Arterial",
      subject: "Fisiologia",
      date: "Amanhã",
      time: "20:00",
      duration: "60 min",
      type: "Videoaula"
    },
    {
      id: 3,
      title: "Revisão - Módulo 3",
      subject: "Anatomia Humana",
      date: "Segunda",
      time: "19:00",
      duration: "120 min",
      type: "Revisão"
    }
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "meu-curso", label: "Meu Curso", icon: GraduationCap },
    { id: "disciplinas", label: "Disciplinas", icon: BookOpen },
    { id: "desempenho", label: "Desempenho", icon: BarChart3 },
    { id: "certificados", label: "Certificados", icon: Award },
    { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
    { id: "configuracoes", label: "Configurações", icon: Settings },
    { id: "ajuda", label: "Ajuda", icon: HelpCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido": return "bg-green-100 text-green-800 border-green-200";
      case "em_andamento": return "bg-blue-100 text-blue-800 border-blue-200";
      case "bloqueado": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "concluido": return "Concluído";
      case "em_andamento": return "Em Andamento";
      case "bloqueado": return "Bloqueado";
      default: return "Não Iniciado";
    }
  };

  const toggleSubjectExpansion = (subjectId: number) => {
    setExpandedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleDownload = (
    materialType: 'slides' | 'material' | 'audio',
    _fileName: string,
    contentTitle: string
  ) => {
    // Simulação de download - em produção, isso seria uma chamada para API
    const typeMap = {
      slides: 'Slides',
      material: 'Material Impresso',
      audio: 'Áudio da Aula'
    };
    
    // Feedback visual com toast
    toast.success(`Download iniciado!`, {
      description: `${typeMap[materialType]} - ${contentTitle}`,
      duration: 3000,
    });
    
    // Em um ambiente real, você faria algo como:
    // window.open(`/api/download/${fileName}`, '_blank');
  };

  const startWatchingLesson = () => {
    setIsWatchingLesson(true);
  };

  const stopWatchingLesson = () => {
    setIsWatchingLesson(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Olá, {studentName}! 👋</h2>
            <p className="text-blue-100 mb-4">
              Continue seus estudos e alcance seus objetivos profissionais
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{currentCourse.progress}% do curso concluído</span>
              </div>
              <div className="flex items-center space-x-1">
                <Timer className="w-4 h-4" />
                <span>{currentCourse.remainingDays} dias restantes</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{currentCourse.progress}%</div>
            <p className="text-blue-100 text-sm">Progresso Total</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="w-5 h-5 text-blue-600" />
                <span>Continue Aprendendo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <ImageWithFallback
                    src={currentCourse.thumbnail}
                    alt={currentCourse.title}
                    className="w-24 h-16 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{currentCourse.nextClass}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {currentCourse.title} • {currentCourse.nextClassDate}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={startWatchingLesson}>
                      <Play className="w-4 h-4 mr-1" />
                      Continuar
                    </Button>
                    <Button size="sm" variant="outline">
                      <BookMarked className="w-4 h-4 mr-1" />
                      Salvar
                    </Button>
                  </div>
                </div>
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
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.completed ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {activity.type === 'video' && <PlayCircle className={`w-5 h-5 ${activity.completed ? 'text-green-600' : 'text-orange-600'}`} />}
                      {activity.type === 'quiz' && <Target className={`w-5 h-5 ${activity.completed ? 'text-green-600' : 'text-orange-600'}`} />}
                      {activity.type === 'assignment' && <FileText className={`w-5 h-5 ${activity.completed ? 'text-green-600' : 'text-orange-600'}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        {activity.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-orange-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{activity.subject}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                        {activity.score && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{activity.score}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Módulos</span>
                </div>
                <span className="font-semibold">{currentCourse.completedModules}/{currentCourse.totalModules}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Horas de Estudo</span>
                </div>
                <span className="font-semibold">{currentCourse.completedHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Certificados</span>
                </div>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Nota Média</span>
                </div>
                <span className="font-semibold">8.7</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximas Aulas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.slice(0, 3).map((classItem) => (
                  <div key={classItem.id} className="p-3 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm text-gray-900">{classItem.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {classItem.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{classItem.subject}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{classItem.date} às {classItem.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precisa de Ajuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Falar com Tutor
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Fórum da Turma
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                Central de Ajuda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Minhas Disciplinas</h2>
        <p className="text-gray-600">Acompanhe o progresso de cada disciplina e acesse os materiais de estudo</p>
      </div>

      <div className="space-y-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <Badge className={getStatusColor(subject.status)}>
                      {getStatusText(subject.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {subject.completedModules} de {subject.modules} módulos • {subject.contents.length} conteúdos disponíveis
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSubjectExpansion(subject.id)}
                  className="ml-2"
                >
                  {expandedSubjects.includes(subject.id) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Horas Estudadas</p>
                  <p className="font-medium">{subject.completedHours}h / {subject.totalHours}h</p>
                </div>
                {subject.grade && (
                  <div>
                    <p className="text-gray-600">Nota Atual</p>
                    <p className="font-medium text-green-600">{subject.grade}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Conteúdos</p>
                  <p className="font-medium">{subject.contents.filter(c => c.completed).length}/{subject.contents.length}</p>
                </div>
              </div>

              {subject.nextLesson && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Próxima aula:</p>
                  <p className="font-medium text-sm">{subject.nextLesson}</p>
                </div>
              )}

              <div className="flex space-x-2">
                {subject.status === "em_andamento" && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={startWatchingLesson}>
                    <Play className="w-4 h-4 mr-1" />
                    Continuar
                  </Button>
                )}
                {subject.status === "concluido" && (
                  <Button size="sm" variant="outline">
                    <Award className="w-4 h-4 mr-1" />
                    Ver Certificado
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => toggleSubjectExpansion(subject.id)}
                >
                  <FolderOpen className="w-4 h-4 mr-1" />
                  {expandedSubjects.includes(subject.id) ? 'Ocultar' : 'Ver'} Conteúdos
                </Button>
              </div>

              {/* Conteúdos Expandidos */}
              {expandedSubjects.includes(subject.id) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Conteúdos da Disciplina
                  </h4>
                  <div className="space-y-3">
                    {subject.contents.map((content, index) => (
                      <div 
                        key={content.id} 
                        className={`p-4 rounded-lg border ${
                          content.completed 
                            ? 'border-green-200 bg-green-50' 
                            : subject.status === 'bloqueado' 
                              ? 'border-gray-200 bg-gray-50 opacity-60' 
                              : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-600">Aula {index + 1}</span>
                              {content.completed && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                              {subject.status === 'bloqueado' && (
                                <AlertCircle className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <h5 className="font-medium text-gray-900">{content.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{content.duration}</span>
                            </div>
                          </div>
                        </div>

                        {/* Materiais para Download */}
                        {subject.status !== 'bloqueado' && (
                          <div className="flex items-center space-x-2 mt-3">
                            <span className="text-sm text-gray-600 mr-2">Materiais:</span>
                            
                            {/* Slides */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={() => handleDownload('slides', content.materials.slides, content.title)}
                              title="Download dos Slides"
                            >
                              <Presentation className="w-3 h-3 mr-1" />
                              <Download className="w-3 h-3" />
                            </Button>

                            {/* Material Impresso */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={() => handleDownload('material', content.materials.material, content.title)}
                              title="Download do Material Impresso"
                            >
                              <Printer className="w-3 h-3 mr-1" />
                              <Download className="w-3 h-3" />
                            </Button>

                            {/* Áudio */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={() => handleDownload('audio', content.materials.audio, content.title)}
                              title="Download do Áudio da Aula"
                            >
                              <Headphones className="w-3 h-3 mr-1" />
                              <Download className="w-3 h-3" />
                            </Button>

                            {/* Botão para assistir/continuar */}
                            <div className="ml-auto">
                              {content.completed ? (
                                <Button size="sm" variant="outline" className="h-8" onClick={startWatchingLesson}>
                                  <PlayCircle className="w-3 h-3 mr-1" />
                                  Revisar
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  className="h-8 bg-blue-600 hover:bg-blue-700"
                                  onClick={startWatchingLesson}
                                  disabled={!(index === 0 || subject.contents[index - 1]?.completed)}
                                >
                                  <Play className="w-3 h-3 mr-1" />
                                  {index === 0 || subject.contents[index - 1]?.completed ? 'Assistir' : 'Bloqueado'}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {subject.status === 'bloqueado' && (
                          <div className="mt-3 p-2 bg-gray-100 rounded text-center">
                            <p className="text-xs text-gray-500">
                              Complete as disciplinas anteriores para acessar este conteúdo
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "disciplinas":
        return renderSubjects();
      case "meu-curso":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Meu Curso</h2>
              <p className="text-gray-600">Visão geral completa do seu curso técnico</p>
            </div>

            {/* Informações do Curso */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <ImageWithFallback
                    src={currentCourse.thumbnail}
                    alt={currentCourse.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-xl">{currentCourse.title}</CardTitle>
                    <p className="text-gray-600 mt-1">Instrutor: {currentCourse.instructor}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{currentCourse.totalStudents} estudantes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{currentCourse.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{currentCourse.totalHours}h totais</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{currentCourse.progress}%</div>
                    <p className="text-sm text-gray-600">Concluído</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Resumo das Disciplinas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStatusColor(subject.status)} variant="outline">
                        {getStatusText(subject.status)}
                      </Badge>
                      <span className="text-sm font-medium">{subject.progress}%</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{subject.name}</h3>
                    <Progress value={subject.progress} className="h-2 mb-2" />
                    <div className="text-xs text-gray-600">
                      {subject.contents.filter(c => c.completed).length} de {subject.contents.length} conteúdos
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Todos os Conteúdos por Disciplina */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Todos os Conteúdos</h3>
              {subjects.map((subject) => (
                <Card key={subject.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <span>{subject.name}</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {subject.contents.length} conteúdos • {subject.completedHours}h estudadas
                        </p>
                      </div>
                      <Badge className={getStatusColor(subject.status)}>
                        {getStatusText(subject.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subject.contents.map((content, index) => (
                        <div 
                          key={content.id}
                          className={`p-3 rounded-lg border ${
                            content.completed 
                              ? 'border-green-200 bg-green-50' 
                              : subject.status === 'bloqueado' 
                                ? 'border-gray-200 bg-gray-50 opacity-60' 
                                : 'border-blue-200 bg-blue-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-medium text-gray-600">Aula {index + 1}</span>
                                {content.completed && (
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                )}
                              </div>
                              <h4 className="font-medium text-sm text-gray-900">{content.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">{content.description}</p>
                              <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{content.duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Downloads compactos */}
                          {subject.status !== 'bloqueado' && (
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDownload('slides', content.materials.slides, content.title)}
                                  title="Slides"
                                >
                                  <Presentation className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDownload('material', content.materials.material, content.title)}
                                  title="Material"
                                >
                                  <Printer className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDownload('audio', content.materials.audio, content.title)}
                                  title="Áudio"
                                >
                                  <Headphones className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 text-xs px-2"
                                onClick={startWatchingLesson}
                              >
                                {content.completed ? 'Revisar' : 'Assistir'}
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "desempenho":
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Análise de Desempenho</h3>
            <p className="text-gray-600">Acompanhe seu progresso detalhado e estatísticas</p>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Em Desenvolvimento</h3>
            <p className="text-gray-600">Esta seção estará disponível em breve</p>
          </div>
        );
    }
  };

  // Se estiver assistindo uma aula, mostrar a dashboard de aulas
  if (isWatchingLesson) {
    return (
      <LessonDashboard 
        onBack={stopWatchingLesson}
        studentName={studentName}
      />
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <SabienciaSymbol className="w-10 h-10 object-contain" title="Sabiencia" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Sabiencia</h2>
                <p className="text-sm text-gray-600">Plataforma de Ensino</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" />
                <AvatarFallback>{studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">{studentName}</p>
                <p className="text-xs text-gray-600">Estudante</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Suporte
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentPlatform;
