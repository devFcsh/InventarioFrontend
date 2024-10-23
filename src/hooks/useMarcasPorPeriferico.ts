import { useState, useEffect } from 'react';
import { Marca } from "../types";
import clienteAxios from '.';

const useMarcasPorPeriferico = (selectedPeriferico: string) => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPeriferico) {
      setMarcas([]);
      return;
    }

    const fetchMarcas = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get(`/marcas/marcasPorPeriferico/${selectedPeriferico}`);        
        setMarcas(response.data);
      } catch (err) {
        setError("Error al obtener marcas por periferico" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, [selectedPeriferico]);

  return { marcas, loading, error };
};

export default useMarcasPorPeriferico;
