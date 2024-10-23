import { useState, useEffect } from 'react';
import { Usuario } from '../types';
import clienteAxios from '.';

const useUsuariosPorUso = (idUso: string) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    if (!idUso) {
      setUsuarios([]);
      return;
    }

    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get(`/usuarios/usuariosPorUso/${idUso}`);
        setUsuarios(response.data);
      } catch (err) {
        setError("Error al botener usuarios por uso" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [idUso]);

  return { usuarios, loading, error };
};

export default useUsuariosPorUso;
