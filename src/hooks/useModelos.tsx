import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modelo } from '../types';

const useModelos = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/modelos');
        setModelos(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModelos();
  }, []);

  return { modelos, loading, error };
};

export default useModelos;
