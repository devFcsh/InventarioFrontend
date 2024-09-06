import { useState, useEffect } from 'react';
import { Marca } from "../types";

const useMarcasPorPeriferico = (selectedPeriferico: string) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedPeriferico) {
      setMarcas([]);
      return;
    }

    const fetchMarcas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/marcas/marcasPorPeriferico/${selectedPeriferico}`);
        const data = await response.json();
        setMarcas(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, [selectedPeriferico]);

  return { marcas };
};

export default useMarcasPorPeriferico;
