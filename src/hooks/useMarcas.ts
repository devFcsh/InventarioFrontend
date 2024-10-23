import { useState, useEffect } from 'react';
import { Marca } from '../types';
import clienteAxios from '.';

const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await clienteAxios.get('/marcas/')        
        setMarcas(response.data);
      } catch (err) {
        setError("Error al obtener marcas "+ err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  return { marcas, loading, error };
};

export default useMarcas;
