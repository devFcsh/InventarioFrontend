import { useState, useEffect } from 'react';
import { Usuario } from '../types';
import clienteAxios from '.';

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {

    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get(`/usuarios/todos/`);
        setUsuarios(response.data);
      } catch (err) {
        setError("Error al botener usuarios" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  return { usuarios, loading, error };
};

export default useUsuarios;