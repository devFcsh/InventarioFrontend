import { useState, useEffect } from 'react';
import { ActivoRedEdit } from '../../../../../types/Activo';

import clienteAxios from '../../../../../hooks';


export const useObtenerRedActivo = (id: string) => {
  const [equipoRedActivo, setEquipoRedActivo] = useState<ActivoRedEdit | null>(null);
  const [loadingActivoRed, setLoading] = useState<boolean>(true);
  const [errorActivoRed, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerEquipoRedActivo = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/equipoRedActivo/${id}`);
        setEquipoRedActivo(response.data.equipo);
      } catch (err) {
        setError("Error al obtener equipo" + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipoRedActivo();
  }, [id]);

  return { equipoRedActivo, loadingActivoRed, errorActivoRed };
};