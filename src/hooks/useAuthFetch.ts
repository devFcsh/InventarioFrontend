// hooks/useAuthFetch.ts
import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../data';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface UseAuthFetchResult {
  loading: boolean;
  error: string | null;
  authFetch: (url: string, options?: FetchOptions) => Promise<any>;
}

const useAuthFetch = (): UseAuthFetchResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authFetch = useCallback(async (url: string, options: FetchOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Construir URL completa si es relativa
      const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
      
      // Configurar opciones por defecto
      const fetchOptions: RequestInit = {
        ...options,
        credentials: 'include', // IMPORTANTE: Incluir cookies de sesión
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      
      const response = await fetch(fullUrl, fetchOptions);
      
      // Si la respuesta es 401, redirigir al login
      if (response.status === 401) {
        window.location.href = '/login';
        throw new Error('Sesión expirada');
      }

      // Si la respuesta no es ok, lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Parsear respuesta JSON
      const data = await response.json();
      
      setLoading(false);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error en petición autenticada:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [API_BASE_URL]);

  return { loading, error, authFetch };
};

export default useAuthFetch;
