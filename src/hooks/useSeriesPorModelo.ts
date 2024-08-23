import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSeriesPorModelo = (perifericoId, marcaId, modeloId) => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/series/seriesPorModelo', {
          params: { perifericoId, marcaId, modeloId },
        });
        console.log(response.data)
        setSeries(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (perifericoId && marcaId && modeloId) {
      fetchSeries();
    } else {
      setSeries([]);
      setLoading(false);
    }
  }, [perifericoId, marcaId, modeloId]);

  return { series, loading, error };
};
