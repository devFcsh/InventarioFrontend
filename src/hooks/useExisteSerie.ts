import { useState } from 'react';
import clienteAxios from '.';

export const useExisteSerie = () => {
  const [existe, setExiste] = useState(false);
  const [serie, setSerie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultarSerie = async (nombre: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clienteAxios.get('/series/existeSerie', {
        params: { nombre }
      });
      setExiste(response.data.existe);
      setSerie(response.data.serie || null);
    } catch (err) {
      setError("Error al consultar serie: " + err);
      setExiste(false);
      setSerie(null);
    } finally {
      setLoading(false);
    }
  };

  return { existe, serie, loading, error, consultarSerie };
};