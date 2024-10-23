import { useState, useEffect } from 'react';
import { Serie } from '../types';
import clienteAxios from '.';

const useSeries = () => {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await clienteAxios.get('/series/');
        setSeries(response.data);
      } catch (err) {
        setError("Error al obtener series" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  return { series, loading, error };
};

export default useSeries;
