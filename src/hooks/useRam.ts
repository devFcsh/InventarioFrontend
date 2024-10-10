import { useState, useEffect } from 'react';
import axios from 'axios';
import { RAM } from '../types';

const useRam = () => {
  const [ram, setRam] = useState<RAM[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchRam = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/ram/');
        setRam(response.data);
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
