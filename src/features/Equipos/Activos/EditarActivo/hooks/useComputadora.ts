import { useState, useEffect } from 'react';
import { Componente } from '../../../../../types/Activo/Componente';
import { ActivoComputadoraEdit } from '../../../../../types/Activo';
import clienteAxios from '../../../../../hooks';

export const useObtenerComputadora = (id: string | null | undefined) => {
  const [equipo, setEquipo] = useState<ActivoComputadoraEdit | null>(null);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setEquipo(null);
      setComponentes([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const obtenerComputadora = async () => {
      try {
        const response = await clienteAxios.get(`/equipos/computadora/${id}`);
        setEquipo(response.data.equipo);
        setComponentes(response.data.componentes.map((comp: Componente) => ({
          periferico: { nombre: comp.periferico },
          marca: { nombre: comp.marca },
          modelo: { nombre: comp.modelo },
          serie: { nombre: comp.serie },
          inventario: comp.inventario,
          id_componente: comp.id_componente || null,
        })));
      } catch (err) {
        setError("Error al obtener computadora: " + err);
      } finally {
        setLoading(false);
      }
    };

    obtenerComputadora();
  }, [id]);

  return { equipo, componentes, loading, error };
};
