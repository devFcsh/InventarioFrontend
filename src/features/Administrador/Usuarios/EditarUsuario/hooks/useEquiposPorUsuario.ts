import clienteAxios from '@hooks/index';
import { useState, useEffect, useCallback } from 'react';
import { EquipoUsuario } from '../../../../../types/Usuario';

const useEquiposPorUsuario = (id_usuario: string) => {
  const [equipos, setEquipos] = useState<EquipoUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipos = useCallback(async () => {
    if (!id_usuario) return;

    setLoading(true);
    try {
      const response = await clienteAxios.get(`/equipos/porUsuario/${id_usuario}`);
      setEquipos(response.data.equipos);
    } catch (err) {
      setError("Error al obtener los equipos del usuario");
    } finally {
      setLoading(false);
    }
  }, [id_usuario]);

  useEffect(() => {
    fetchEquipos();
  }, [fetchEquipos]);

  return { equipos, loading, error, refetch: fetchEquipos };
};

export default useEquiposPorUsuario;
