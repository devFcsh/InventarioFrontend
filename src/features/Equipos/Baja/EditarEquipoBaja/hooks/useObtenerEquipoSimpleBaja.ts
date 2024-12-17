import { useState, useEffect } from 'react';
import { BajaSimpleEdit } from '../../../../../types/Baja';

import clienteAxios from '../../../../../hooks';


export const useObtenerComputadoraBaja = (id: string) => {
  const [equipoSimpleBaja, setEquipoSimpleBaja] = useState<BajaSimpleEdit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerEquipoSimpleBaja = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/equipoSimple/${id}`);
        setEquipoSimpleBaja(response.data.equipo);
      } catch (err) {
        setError("Error al obtener equipo" + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipoSimpleBaja();
  }, [id]);

  return { equipoSimpleBaja, loading, error };
};