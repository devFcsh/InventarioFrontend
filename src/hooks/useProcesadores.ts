import { useState, useEffect } from 'react';
import { Procesador } from '../types';
import clienteAxios from './index';

const useProcesadores = () => {
  const [procesadores, setProcesador] = useState<Procesador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProcesadores = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/procesadores/');
        setProcesador(response.data);
      } catch (err) {
        setError("Error al obtener procesadores" + err);
            } finally {
        setLoading(false);
      }
    };

    fetchProcesadores();
  }, []);

  return { procesadores, loading, error };
};

export default useProcesadores;
