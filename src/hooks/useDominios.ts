import { useState, useEffect } from 'react';
import { Dominio } from '../types';
import clienteAxios from '.';
const useDominios = () => {
  const [dominios, setDominios] = useState<Dominio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDominios = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/dominios/');
        setDominios(response.data);
      } catch (err) {
        setError("Error al obtener dominios" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchDominios();
  }, []);

  return { dominios, loading, error };
};

export default useDominios;
