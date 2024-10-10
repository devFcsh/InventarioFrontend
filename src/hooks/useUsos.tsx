import { useState, useEffect } from 'react';
import axios from 'axios';
import { Uso } from '../types';

const useUsos = () => {
  const [usos, setUsos] = useState<Uso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchUsos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/usos/');
        setUsos(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsos();
  }, []);

  return { usos, loading, error };
};

export default useUsos;
