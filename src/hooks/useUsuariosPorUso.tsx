import { useState, useEffect } from 'react';
import { Usuario } from '../types';

const useUsuariosPorUso = (idUso: string) => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);  
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idUso) {
      setUsuarios([]);
      return;
    }

    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/usuarios/usuariosPorUso/${idUso}`);
        const data = await response.json();
        console.log(data)
        setUsuarios(data);
      } catch (err) {
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
