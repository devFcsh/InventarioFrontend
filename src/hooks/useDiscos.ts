import { useState, useEffect } from 'react';
import { Disco } from '../types';
import clienteAxios from './index';

const useDiscos = () => {
  const [discos, setDiscos] = useState<Disco[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDiscos = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/discos/');
        setDiscos(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscos();
  }, []);

  return { discos, loading, error };
};

export default useDiscos;
