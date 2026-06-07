import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  Save,
  ArrowLeft,
  MoreVertical,
  Users,
  Star
} from 'lucide-react';

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  videoUrl: string;
  description: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
  progress: number;
}

interface LessonDashboardProps {
  onBack: () => void;
  studentName?: string;
}

const LessonDashboard: React.FC<LessonDashboardProps> = ({ onBack, studentName = "João Silva" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [activeModuleId, setActiveModuleId] = useState('module-1');
  const [activeLessonId, setActiveLessonId] = useState('lesson-1');
  const [showNotes, setShowNotes] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Dados mock dos módulos e aulas
  const modules: Module[] = [
    {
      id: 'module-1',
      title: 'Princípios Fundamentais',
      progress: 85,
      completed: false,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introdução à Anatomia Humana',
          duration: 2460, // 41 minutos
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          description: 'Conceitos básicos e terminologia anatômica fundamental para o curso'
        },
        {
          id: 'lesson-2',
          title: 'Estrutura Celular',
          duration: 1980, // 33 minutos
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          description: 'Estudo detalhado das células e suas funções'
        },
        {
          id: 'lesson-3',
          title: 'Sistemas do Corpo Humano',
          duration: 3120, // 52 minutos
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          description: 'Visão geral dos principais sistemas corporais'
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Aplicações Práticas',
      progress: 45,
      completed: false,
      lessons: [
        {
          id: 'lesson-4',
          title: 'Procedimentos Básicos',
          duration: 2760, // 46 minutos
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          description: 'Procedimentos fundamentais na prática clínica'
        },
        {
          id: 'lesson-5',
          title: 'Técnicas Avançadas',
          duration: 3360, // 56 minutos
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          description: 'Técnicas especializadas e casos complexos'
        }
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const currentLesson = currentModule.lessons.find(l => l.id === activeLessonId) || currentModule.lessons[0];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    return duration - currentTime;
  };

  const getCourseProgress = () => {
    const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = modules.reduce((acc, module) => 
      acc + module.lessons.filter(lesson => lesson.completed).length, 0
    );
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        timestamp: currentTime,
        content: currentNote.trim(),
        createdAt: new Date()
      };
      setNotes([...notes, newNote]);
      setCurrentNote('');
      toast.success('Anotação salva!', {
        description: `Salva no tempo ${formatTime(currentTime)}`
      });
    }
  };

  const jumpToNote = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
    }
  };

  const selectLesson = (moduleId: string, lessonId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const getNextLesson = () => {
    const currentModuleIndex = modules.findIndex(m => m.id === activeModuleId);
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === activeLessonId);
    
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      return {
        moduleId: activeModuleId,
        lessonId: currentModule.lessons[currentLessonIndex + 1].id
      };
    } else if (currentModuleIndex < modules.length - 1) {
      return {
        moduleId: modules[currentModuleIndex + 1].id,
        lessonId: modules[currentModuleIndex + 1].lessons[0].id
      };
    }
    return null;
  };

  const getPreviousLesson = () => {
    const currentModuleIndex = modules.findIndex(m => m.id === activeModuleId);
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === activeLessonId);
    
    if (currentLessonIndex > 0) {
      return {
        moduleId: activeModuleId,
        lessonId: currentModule.lessons[currentLessonIndex - 1].id
      };
    } else if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      return {
        moduleId: prevModule.id,
        lessonId: prevModule.lessons[prevModule.lessons.length - 1].id
      };
    }
    return null;
  };

  const goToNextLesson = () => {
    const next = getNextLesson();
    if (next) {
      selectLesson(next.moduleId, next.lessonId);
    }
  };

  const goToPreviousLesson = () => {
    const prev = getPreviousLesson();
    if (prev) {
      selectLesson(prev.moduleId, prev.lessonId);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Evitar atalhos quando estiver digitando em campos de texto
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, currentTime - 10);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, currentTime + 10);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(100, volume * 100 + 10)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume * 100 - 10)]);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Slash':
          if (e.shiftKey) {
            e.preventDefault();
            setShowKeyboardShortcuts(true);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTime, duration, volume]);

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onBack} className="hidden lg:flex">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900">{currentLesson.title}</h1>
                <p className="text-sm text-gray-600">{currentModule.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="hidden sm:flex">
                Progresso do Curso: {getCourseProgress()}%
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setShowKeyboardShortcuts(true)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden lg:flex"
                onClick={() => setShowKeyboardShortcuts(true)}
                title="Atalhos de teclado (?)"
              >
                ?
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 lg:pr-6">
            {/* Mobile Lesson Info */}
            <div className="lg:hidden bg-white p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-1">{currentLesson.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{currentModule.title}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Progresso: {Math.round((currentTime / duration) * 100) || 0}%</span>
                <span className="text-gray-500">Restam: {formatTime(getRemainingTime())}</span>
              </div>
              <Progress value={(currentTime / duration) * 100 || 0} className="h-1 mt-2" />
            </div>

            {/* Video Player */}
            <div className="bg-black relative aspect-video">
              <video
                ref={videoRef}
                src={currentLesson.videoUrl}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div 
                    className="w-full bg-white/20 rounded-full h-1 cursor-pointer hover:h-2 transition-all relative group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      handleSeek([percent * 100]);
                    }}
                  >
                    <div 
                      className="bg-blue-500 h-1 group-hover:h-2 rounded-full transition-all relative"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    >
                      <div 
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                        style={{ marginRight: '-6px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>

                    <div className="flex items-center space-x-2">
                      <span className="text-white text-sm">Velocidade:</span>
                      <select
                        value={playbackRate}
                        onChange={(e) => changePlaybackRate(Number(e.target.value))}
                        className="bg-white/20 text-white text-sm rounded px-2 py-1 border-none outline-none"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-white text-sm">
                      Restam: {formatTime(getRemainingTime())}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Lesson Info */}
            <div className="hidden lg:block bg-white p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentLesson.title}</h2>
                  <p className="text-gray-600 text-sm">{currentLesson.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(currentLesson.duration)}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      1,234 estudantes
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                      4.8
                    </span>
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousLesson}
                    disabled={!getPreviousLesson()}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    size="sm"
                    onClick={goToNextLesson}
                    disabled={!getNextLesson()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Lesson Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progresso da Aula</span>
                  <span className="font-medium">{Math.round((currentTime / duration) * 100) || 0}%</span>
                </div>
                <Progress value={(currentTime / duration) * 100 || 0} className="h-2" />
              </div>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="lg:hidden bg-white p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousLesson}
                  disabled={!getPreviousLesson()}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                <div className="text-sm text-gray-600">
                  Aula {currentModule.lessons.findIndex(l => l.id === activeLessonId) + 1} de {currentModule.lessons.length}
                </div>
                <Button
                  size="sm"
                  onClick={goToNextLesson}
                  disabled={!getNextLesson()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 bg-white border-l border-gray-200 lg:border-l-0 lg:border-t border-gray-200">
            <div className="p-4 lg:p-6">
              {/* Tabs for Notes and Modules */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setShowNotes(false)}
                  className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                    !showNotes
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  aria-pressed={!showNotes}
                >
                  Módulos
                </button>
                <button
                  onClick={() => setShowNotes(true)}
                  className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                    showNotes
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  aria-pressed={showNotes}
                >
                  Anotações
                </button>
              </div>

              {/* Content */}
              <ScrollArea className="h-[calc(100vh-280px)] lg:h-[calc(100vh-200px)]">
                {showNotes ? (
                  /* Notes Section */
                  <div className="space-y-4">
                    {/* Add Note */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Anotação
                      </label>
                      <Textarea
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                        placeholder="Digite sua anotação aqui..."
                        className="mb-2"
                        rows={3}
                      />
                      <Button
                        onClick={addNote}
                        disabled={!currentNote.trim()}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar no tempo {formatTime(currentTime)}
                      </Button>
                    </div>

                    <Separator />

                    {/* Notes List */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Suas Anotações ({notes.length})
                      </h4>
                      {notes.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-8">
                          Nenhuma anotação ainda.
                          <br />
                          Adicione anotações durante a aula!
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {notes.map((note) => (
                            <div
                              key={note.id}
                              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => jumpToNote(note.timestamp)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-blue-600">
                                  {formatTime(note.timestamp)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {note.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Modules Section */
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">{module.title}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {module.lessons.filter(l => l.completed).length} de {module.lessons.length} aulas
                            </span>
                            <span className="font-medium">{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-1 mt-2" />
                        </div>
                        
                        <div className="divide-y divide-gray-100">
                          {module.lessons.map((lesson, index) => (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(module.id, lesson.id)}
                              className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                                lesson.id === activeLessonId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {lesson.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : lesson.id === activeLessonId ? (
                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                      <Play className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {index + 1}. {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatTime(lesson.duration)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Modal */}
        {showKeyboardShortcuts && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Atalhos de Teclado</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyboardShortcuts(false)}
                >
                  ×
                </Button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Reproduzir/Pausar</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Espaço</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Retroceder 10s</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Avançar 10s</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Aumentar volume</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Diminuir volume</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↓</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Silenciar/Ativar som</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">M</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Tela cheia</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">F</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Mostrar atalhos</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Shift + ?</kbd>
                </div>
              </div>
              <Button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Entendi
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LessonDashboard;