import { useState, useEffect } from 'react';
import { SistemaOperativo } from '../types';
import clienteAxios from '.';

const useSistemasOperativos = () => {
  const [sistemasOperativos, setSistemasOperativos] = useState<SistemaOperativo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchSistemaOperativo = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/sistemasoperativos/');
        setSistemasOperativos(response.data);
      } catch (err) {
        setError("Error el obtener sistemas operativos" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchSistemaOperativo();
  }, []);

  return { sistemasOperativos, loading, error };
};

export default useSistemasOperativos;
