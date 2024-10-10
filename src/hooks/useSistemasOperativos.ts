import { useState, useEffect } from 'react';
import axios from 'axios';
import { SistemaOperativo } from '../types';

const useSistemasOperativos = () => {
  const [sistemasOperativos, setSistemasOperativos] = useState<SistemaOperativo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchSistemaOperativo = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/sistemasoperativos/');
        setSistemasOperativos(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSistemaOperativo();
  }, []);

  return { sistemasOperativos, loading, error };
};

export default useSistemasOperativos;
