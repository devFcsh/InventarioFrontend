import { useState, useEffect } from 'react';
import { Periferico } from '../types';
import clienteAxios from '.';

const usePerifericos = () => {
  const [perifericos, setPerifericos] = useState<Periferico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchPerifericos = async () => {
      try {
        const response = await clienteAxios.get('/perifericos/');
        setPerifericos(response.data);
      } catch (err) {
        setError("Error al obtener perifericos " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerifericos();
  }, []);

  return { perifericos, loading, error };
};

export default usePerifericos;
