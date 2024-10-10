import { useState, useEffect } from 'react';
import axios from 'axios';
import { Componente, EquipoEdit } from '../types';


export const useObtenerComputadora = (id: string) => {
  const [equipo, setEquipo] = useState<EquipoEdit | null>(null);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const obtenerComputadora = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/equipos/computadora/${id}`);
        setEquipo(response.data.equipo);
        setComponentes(response.data.componentes.map((comp: any) => ({
          periferico: { nombre: comp.periferico },
          marca: { nombre: comp.marca },
          modelo: { nombre: comp.modelo },
          serie: { nombre: comp.serie },
          inventario: comp.inventario,
          id_componente: comp.id_componente || null,
        })));
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerComputadora();
  }, [id]);

  return { equipo, componentes, loading, error };
};
