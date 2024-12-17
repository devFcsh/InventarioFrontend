import { useState, useEffect } from 'react';
import { ActivoSimpleEdit } from '../../../../../types/Activo';

import clienteAxios from '../../../../../hooks';


export const useObtenerComputadoraActivo = (id: string) => {
  const [equipoSimpleActivo, setEquipoSimpleActivo] = useState<ActivoSimpleEdit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerEquipoSimpleActivo = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/equipoSimpleActivo/${id}`);
        setEquipoSimpleActivo(response.data.equipo);
      } catch (err) {
        setError("Error al obtener equipo" + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipoSimpleActivo();
  }, [id]);

  return { equipoSimpleActivo, loading, error };
};