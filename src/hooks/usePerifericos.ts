import { useState, useEffect } from 'react';

const usePerifericos = () => {
  const [perifericos, setPerifericos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerifericos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/perifericos');
        const data = await response.json();
        setPerifericos(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerifericos();
  }, []);

  return { perifericos };
};

export default usePerifericos;
