import { useState, useEffect } from 'react';
import axios from 'axios';
import { Marca } from '../types';

const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/marcas');
        setMarcas(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  return { marcas, loading, error };
};

export default useMarcas;
