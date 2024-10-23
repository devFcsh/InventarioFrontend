import { useState, useEffect } from 'react';
import { RAM } from '../types';
import clienteAxios from '.';
const useRam = () => {
  const [ram, setRam] = useState<RAM[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchRam = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/ram/');
        setRam(response.data);
      } catch (err) {
        setError("Error al obtener RAM" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchRam();
  }, []);

  return { ram, loading, error };
};

export default useRam;
