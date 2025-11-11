import { useState, useEffect } from 'react';
import clienteAxios from '.';

export type ComputadoraSimple = {
  id_equipo: number;
  serie?: string | null;
};

const useComputadorasPorPeriferico = (perifericoId: number | string | null | undefined) => {
  const [computadoras, setComputadoras] = useState<ComputadoraSimple[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (perifericoId === null || perifericoId === undefined || perifericoId === '') {
      setComputadoras([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetch = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/computadorasPorPeriferico/${encodeURIComponent(String(perifericoId))}`);
        setComputadoras(response.data.computadoras || []);
      } catch (err: any) {
        setError("Error al obtener computadoras: " + (err?.response?.data?.error || err.message || String(err)));
        setComputadoras([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [perifericoId]);

  return { computadoras, loading, error };
};

export default useComputadorasPorPeriferico;