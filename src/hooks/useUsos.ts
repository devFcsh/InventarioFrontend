import { useState, useEffect } from 'react';
import { Uso } from '../types';
import clienteAxios from '.';

const useUsos = () => {
  const [usos, setUsos] = useState<Uso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchUsos = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/usos/');
        setUsos(response.data);
      } catch (err) {
        setError("Error al obtener usos " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsos();
  }, []);

  return { usos, loading, error };
};

export default useUsos;
