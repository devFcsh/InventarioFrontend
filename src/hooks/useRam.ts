import { useState, useEffect } from 'react';
import { RAM } from '../types';

const useRam = () => {
    const [ram, setRam] = useState<RAM[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchRam = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/ram/');
        const data = await response.json();
        setRam(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRam();
  }, []);

  return { ram, loading, error };
};

export default useRam;
