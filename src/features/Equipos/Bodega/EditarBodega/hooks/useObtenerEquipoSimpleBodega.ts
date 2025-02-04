import { useState, useEffect } from 'react';
import { BodegaSimpleEdit } from '../../../../../types/Bodega';

import clienteAxios from '../../../../../hooks';


export const useObtenerEquipoSimpleBodega = (id: string) => {
  const [equipoSimpleBodega, setEquipoSimpleBodega] = useState<BodegaSimpleEdit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerEquipoSimpleBodega = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/equipoSimple/${id}`);
        setEquipoSimpleBodega(response.data.equipo);
      } catch (err) {
        setError("Error al obtener equipo" + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipoSimpleBodega();
  }, [id]);

  return { equipoSimpleBodega, loading, error };
};
