import { useState, useEffect } from 'react';
import clienteAxios from '.';

export const useInventariosPorSerie = (perifericoId: string, marcaId: string, modeloId: string, serieId: string) => {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchInventarios = async () => {
      try {
        const response = await clienteAxios.get('/inventarios/inventariosPorSerie', {
          params: { perifericoId, marcaId, modeloId, serieId },
        });
        setInventarios(response.data);
      } catch (err) {
        setError("Error al obtener inventarios por serie "+ err);
      } finally {
        setLoading(false);
      }
    };

    if (perifericoId && marcaId && modeloId && serieId) {
      fetchInventarios();
    } else {
      setInventarios([]);
      setLoading(false);
    }
  }, [perifericoId, marcaId, modeloId, serieId]);

  return { inventarios, loading, error };
};
