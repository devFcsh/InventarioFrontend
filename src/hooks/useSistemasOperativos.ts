import { useState, useEffect } from 'react';
import { SistemaOperativo } from '../types';

const useSistemasOperativos = () => {
    const [sistemasOperativos, setSistemasOperativos] = useState<SistemaOperativo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchSistemaOperativo = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/sistemasoperativos/');
        const data = await response.json();
        setSistemasOperativos(data);
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
