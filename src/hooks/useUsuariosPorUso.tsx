import { useState, useEffect } from 'react';
import axios from 'axios';
import { Usuario } from '../types';

const useUsuariosPorUso = (idUso: string) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    if (!idUso) {
      setUsuarios([]);
      return;
    }

    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/usuarios/usuariosPorUso/${idUso}`);
        setUsuarios(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [idUso]);

  return { usuarios, loading, error };
};

export default useUsuariosPorUso;
