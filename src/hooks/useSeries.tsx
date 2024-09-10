import { useState, useEffect } from 'react';
import axios from 'axios';
import { Serie } from '../types';

const useSeries = () => {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/series');
        setSeries(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  return { series, loading, error };
};

export default useSeries;
