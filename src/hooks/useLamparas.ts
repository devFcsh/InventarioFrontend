import { useState, useEffect } from 'react';
import { Lampara } from '../types';
import clienteAxios from '.';

const useLamparas = () => {
  const [lamparas, setLamparas] = useState<Lampara[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchLamparas = async () => {
      try {
        const response = await clienteAxios.get('/lamparas/');
        setLamparas(response.data);
      } catch (err) {
        setError("Error al obtener lamparas" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchLamparas();
  }, []);

  return { lamparas, loading, error };
};

export default useLamparas;
