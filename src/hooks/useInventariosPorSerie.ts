import { useState, useEffect } from 'react';
import axios from 'axios';

export const useInventariosPorSerie = (perifericoId, marcaId, modeloId, serieId) => {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventarios/inventariosPorSerie', {
          params: { perifericoId, marcaId, modeloId, serieId },
        });
        setInventarios(response.data);
      } catch (err) {
        setError(err);
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
