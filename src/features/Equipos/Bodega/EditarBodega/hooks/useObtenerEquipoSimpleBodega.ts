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
        const equipoData = response.data.equipo;
        
        // Mapear p_id_periferico a id_periferico si existe
        const equipoMapeado: BodegaSimpleEdit = {
          ...equipoData,
          id_periferico: equipoData.p_id_periferico || equipoData.id_periferico,
          isComponente: response.data.isComponente ?? equipoData.isComponente,
          id_computadora: response.data.id_computadora ?? equipoData.id_computadora,
          id_serie_computadora: response.data.id_serie_computadora ?? equipoData.id_serie_computadora,
          id_periferico_computadora: response.data.id_periferico_computadora ?? equipoData.id_periferico_computadora,
        };
        
        setEquipoSimpleBodega(equipoMapeado);
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
