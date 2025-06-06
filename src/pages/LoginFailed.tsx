// pages/LoginFailed.tsx
import React from 'react';

const LoginFailed: React.FC = () => {
  const handleRetry = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-600 mb-6">
            <svg 
              className="w-16 h-16 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.19 2.5 1.732 2.5z" 
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Error de Autenticación</h2>
            <p className="text-gray-600 mb-6">
              No se pudo completar el proceso de autenticación con el sistema CAS de ESPOL.
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Intentar Nuevamente
            </button>
            
            <div className="text-sm text-gray-500">
              <p>Si el problema persiste, contacta con el administrador del sistema.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFailed;