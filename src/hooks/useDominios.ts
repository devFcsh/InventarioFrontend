import { useState, useEffect } from 'react';
import { Dominio } from '../types';

const useDominios = () => {
    const [dominios, setDominios] = useState<Dominio[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchDominios = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/dominios/');
        const data = await response.json();
        setDominios(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDominios();
  }, []);

  return { dominios, loading, error };
};

export default useDominios;
