import { useState, useEffect } from 'react';
import { ComponenteBodega } from '../../../../../types/Bodega/Componente';
import { BodegaComputadoraEdit } from '../../../../../types/Bodega';

import clienteAxios from '../../../../../hooks';


export const useObtenerComputadoraBodega = (id: string) => {
  const [equipoBodega, setEquipoBodega] = useState<BodegaComputadoraEdit | null>(null);
  const [componentesBodega, setComponentesBodega] = useState<ComponenteBodega[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerComputadoraBodega = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/computadoraBodega/${id}`);
        const equipoData = response.data.computadora;
        
        // Mapear p_id_periferico a id_periferico si existe
        const equipoMapeado: BodegaComputadoraEdit = {
          ...equipoData,
          id_periferico: equipoData.p_id_periferico || equipoData.id_periferico,
        };
        
        setEquipoBodega(equipoMapeado);
        setComponentesBodega(response.data.componentes.map((comp: ComponenteBodega) => ({
          periferico: { nombre: comp.periferico },
          marca: { nombre: comp.marca },
          modelo: { nombre: comp.modelo },
          serie: { nombre: comp.serie },
          inventario: comp.inventario,
          id_componente: comp.id_componente || null,
        })));
      } catch (err) {
        setError("Error al obtener computadora" + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerComputadoraBodega();
  }, [id]);

  return { equipoBodega, componentesBodega, loading, error };
};
