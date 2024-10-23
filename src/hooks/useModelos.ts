import { useState, useEffect } from 'react';
import { Modelo } from '../types';
import clienteAxios from '.';

const useModelos = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await clienteAxios.get('/modelos/');        
        setModelos(response.data);
      } catch (err) {
        setError("Error al obtener modelos" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchModelos();
  }, []);

  return { modelos, loading, error };
};

export default useModelos;
