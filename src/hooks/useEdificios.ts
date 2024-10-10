import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edificio } from '../types';

const useEdificios = () => {
  const [edificios, setEdificios] = useState<Edificio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEdificios = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/edificios/');
        setEdificios(response.data);
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
