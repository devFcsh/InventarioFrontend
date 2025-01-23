import { useState, useEffect } from 'react';
import { BodegaRedEdit } from '../../../../../types/Bodega';

import clienteAxios from '../../../../../hooks';


export const useObtenerRedBodega = (id: string) => {
  const [equipoRedBodega, setEquipoRedBodega] = useState<BodegaRedEdit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerEquipoRedBodega = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/equipoRedBodegaBaja/${id}`);
        setEquipoRedBodega(response.data.equipo);
      } catch (err) {
        setError("Error al obtener equipo" + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipoRedBodega();
  }, [id]);

  return { equipoRedBodega, loading, error };
};
