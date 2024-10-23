import { useState, useEffect } from 'react';
import { Serie } from '../types';
import clienteAxios from '.';

export const useSeriesPorModelo = (perifericoId: string, marcaId:string, modeloId:string) => {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await clienteAxios.get('/series/seriesPorModelo', {
          params: { perifericoId, marcaId, modeloId },
        });
        setSeries(response.data);
      } catch (err) {
        setError("Error al obtener series por modelo " + err);
      } finally {
        setLoading(false);
      }
    };

    if (perifericoId && marcaId && modeloId) {
      fetchSeries();
    } else {
      setSeries([]);
      setLoading(false);
    }
  }, [perifericoId, marcaId, modeloId]);

  return { series, loading, error };
};
