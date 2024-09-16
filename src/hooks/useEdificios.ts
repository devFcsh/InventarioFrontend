import { useState, useEffect } from 'react';
import { Edificio } from '../types';

const useEdificios = () => {
    const [edificios, setEdificios] = useState<Edificio[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchEdificios = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/edificios/');
        const data = await response.json();
        setEdificios(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEdificios();
  }, []);

  return { edificios, loading, error };
};

export default useEdificios;
