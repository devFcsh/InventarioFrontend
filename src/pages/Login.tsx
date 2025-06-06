// pages/Login.tsx
import { useEffect, useState } from "react";

const Login = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔍 Verificando estado de autenticación...');
      
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📊 Estado de auth:', data);

      if (data.authenticated) {
        console.log('✅ Usuario ya autenticado, redirigiendo a activos...');
        window.location.href = '/activos';
      } else {
        console.log('❌ Usuario no autenticado, iniciando login...');
        setStatus('redirecting');
        // Pequeño delay para mostrar el mensaje
        setTimeout(() => {
          window.location.href = `${API_BASE_URL}/auth/cas/login`;
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Error verificando auth:', error);
      setError('Error de conexión con el servidor');
      setStatus('error');
    }
  };

  if (status === 'error') {
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h2 className="text-xl font-bold mb-2">Error de Conexión</h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-10 h-10 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m6 0V7a2 2 0 00-2-2M9 7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sistema de Gestión
            </h1>
            <p className="text-gray-600">
              Autenticación con CAS ESPOL
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            
            <p className="text-gray-600">
              {status === 'loading' 
                ? 'Verificando autenticación...' 
                : 'Redirigiendo al sistema de autenticación de ESPOL...'
              }
            </p>

            {status === 'redirecting' && (
              <div className="text-sm text-gray-500 mt-4">
                <p>Si no eres redirigido automáticamente, 
                   <button 
                     onClick={() => window.location.href = `${API_BASE_URL}/auth/cas/login`}
                     className="text-blue-600 hover:text-blue-800 underline ml-1"
                   >
                     haz clic aquí
                   </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;