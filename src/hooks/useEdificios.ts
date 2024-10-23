import { useState, useEffect } from 'react';
import { Edificio } from '../types';
import clienteAxios from '.';
const useEdificios = () => {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEdificios = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/edificios/');
        setEdificios(response.data);
      } catch (err) {
        setError("Error al obtener edificios" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchEdificios();
  }, []);

  return { edificios, loading, error };
};

export default useEdificios;
