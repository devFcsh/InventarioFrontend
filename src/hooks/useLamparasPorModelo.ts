import { useState, useEffect } from 'react';
import { Lampara } from '../types';
import clienteAxios from '.';

export const useLamparasPorModelo = (perifericoId: string, marcaId:string, modeloId:string) => {
  const [lamparas, setLamparas] = useState<Lampara[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchLamparas = async () => {
      try {
        const response = await clienteAxios.get('/lamparas/lamparasPorModelo', {
          params: { perifericoId, marcaId, modeloId },
        });
        setLamparas(response.data);
      } catch (err) {
        setError("Error al obtener lamparas por modelo " + err);
      } finally {
        setLoading(false);
      }
    };

    if (perifericoId && marcaId && modeloId) {
      fetchLamparas();
    } else {
      setLamparas([]);
      setLoading(false);
    }
  }, [perifericoId, marcaId, modeloId]);

  return { lamparas, loading, error };
};
