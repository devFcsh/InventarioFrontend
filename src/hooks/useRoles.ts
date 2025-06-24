import { useState, useEffect } from 'react';
import clienteAxios from '.';
import { Rol } from '../types/UsuarioSistema';


const useRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/roles/');
        setRoles(response.data);
      } catch (err) {
        setError("Error al obtener roles " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  return { roles, loading, error };
};

export default useRoles;