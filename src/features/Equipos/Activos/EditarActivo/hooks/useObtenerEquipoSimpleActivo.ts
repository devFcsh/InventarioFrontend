import { useState, useEffect } from 'react';
import { ActivoSimpleEdit } from '../../../../../types/Activo';

import clienteAxios from '../../../../../hooks';


export const useObtenerComputadoraActivo = (id: string) => {
  const [equipoSimpleActivo, setEquipoSimpleActivo] = useState<ActivoSimpleEdit | null>(null);
  const [loadingActivoSimple, setLoading] = useState<boolean>(true);
  const [errorActivoSimple, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerEquipoSimpleActivo = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/equipoSimpleActivo/${id}`);
        console.log(response)
        setEquipoSimpleActivo(response.data.equipo);
      } catch (err) {
        setError("Error al obtener equipo" + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipoSimpleActivo();
  }, [id]);

  return { equipoSimpleActivo, loadingActivoSimple, errorActivoSimple };
};