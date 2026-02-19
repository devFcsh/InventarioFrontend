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
        const equipoData = response.data.equipo;
        
        // Mapear p_id_periferico a id_periferico si existe
        const equipoMapeado: ActivoRedEdit = {
          ...equipoData,
          id_periferico: equipoData.p_id_periferico || equipoData.id_periferico,
        };
        
        setEquipoRedActivo(equipoMapeado);
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