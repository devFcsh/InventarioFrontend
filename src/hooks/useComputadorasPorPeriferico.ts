import { useState, useEffect } from 'react';
import clienteAxios from '.';

export type ComputadoraSimple = {
  id_equipo: number;
  serie?: string | null;
};

const useComputadorasPorPeriferico = (
  perifericoId: number | string | null | undefined,
  tipo?: string
) => {
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
        let url = `/equipos/computadorasPorPeriferico/${encodeURIComponent(String(perifericoId))}`;
        if (tipo) {
          url += `?tipo=${encodeURIComponent(String(tipo))}`;
        }
        const response = await clienteAxios.get(url);
        setComputadoras(response.data.computadoras || []);
      } catch (err: unknown) {
          let message = "";
          try {
            if (err instanceof Error) message = err.message;
            else if (typeof err === 'object' && err !== null) {
              try {
                const serialized = JSON.parse(JSON.stringify(err));
                message = (serialized && (serialized.response?.data?.error || serialized.message)) || JSON.stringify(serialized);
              } catch (e) {
                message = String(err);
              }
            } else {
              message = String(err);
            }
          } catch (e) {
            message = String(err);
          }
          setError("Error al obtener computadoras: " + (message || ""));
        setComputadoras([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
    }, [perifericoId, tipo]);

  return { computadoras, loading, error };
};

export default useComputadorasPorPeriferico;