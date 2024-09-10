import { useState, useEffect } from 'react';
import axios from 'axios';
import { Periferico } from '../types';

const usePerifericos = () => {
  const [perifericos, setPerifericos] = useState<Periferico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchPerifericos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/perifericos');
        setPerifericos(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerifericos();
  }, []);

  return { perifericos, loading, error };
};

export default usePerifericos;
