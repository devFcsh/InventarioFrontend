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
        const equipo = response.data.equipo || null;
        if (equipo) {
          const merged = {
            ...equipo,
            id_periferico: equipo.p_id_periferico || equipo.id_periferico,
            isComponente: response.data.isComponente ?? equipo.isComponente,
            id_computadora: response.data.id_computadora ?? equipo.id_computadora,
            id_serie_computadora: response.data.id_serie_computadora ?? equipo.id_serie_computadora,
            id_periferico_computadora: response.data.id_periferico_computadora ?? equipo.id_periferico_computadora,
          };
          setEquipoSimpleActivo(merged);
        } else {
          setEquipoSimpleActivo(null);
        }
      } catch (err) {
        setError("Error al obtener equipo" + String(err));
      } finally {
        setLoading(false);
      }
    };

    obtenerEquipoSimpleActivo();
  }, [id]);

  return { equipoSimpleActivo, loadingActivoSimple, errorActivoSimple };
};