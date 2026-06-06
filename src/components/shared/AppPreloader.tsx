// ============================================
// APP PRELOADER - Componente de carregamento inicial otimizado
// ============================================

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AppPreloaderProps {
  message?: string;
}

export const AppPreloader: React.FC<AppPreloaderProps> = ({ 
  message = 'Carregando aplicação...' 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* Logo ou Ícone */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
          </div>
          
          {/* Spinner animado */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h2 className="text-xl text-gray-900">Sabiencia</h2>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* Barra de progresso */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full animate-pulse"
              style={{
                width: '100%',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
