import { useState, useEffect } from 'react';
import { Marca } from "../types";

const useMarcasPorPeriferico = (selectedPeriferico: string) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);  

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
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, [selectedPeriferico]);

  return { marcas, loading, error };
};

export default useMarcasPorPeriferico;
