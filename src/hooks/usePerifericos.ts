import { useState, useEffect } from 'react';
import axios from 'axios';

const usePerifericos = () => {
  const [perifericos, setPerifericos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerifericos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/perifericos');
        setPerifericos(response.data);
      } catch (err) {
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
