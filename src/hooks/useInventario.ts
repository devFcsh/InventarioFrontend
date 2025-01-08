import { useState, useEffect } from 'react';
import clienteAxios from '.';

export const useInventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchInventarios = async () => {
      try {
        const response = await clienteAxios.get('/inventarios/');
        setInventarios(response.data);
      } catch (err) {
        setError("Error al obtener inventarios por serie "+ err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventarios();

  }, []);

  return { inventarios, loading, error };
};
