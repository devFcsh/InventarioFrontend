import { useState, useEffect } from 'react';
import { Componente, EquipoEdit } from '../../../../../types';
import clienteAxios from '../../../../../hooks';


export const useObtenerComputadora = (id: string) => {
  const [equipo, setEquipo] = useState<EquipoEdit | null>(null);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerComputadora = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/computadora/${id}`);
        setEquipo(response.data.equipo);
        setComponentes(response.data.componentes.map((comp: any) => ({
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

    obtenerComputadora();
  }, [id]);

  return { equipo, componentes, loading, error };
};
