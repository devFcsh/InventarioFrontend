import { useState, useEffect } from "react";
import clienteAxios from "../../../../../hooks";

export interface Actividad {
  id_actividad_mantenimiento: number;
  nombre: string;
}

export const useObtenerActividadesEquipo = (id: string | null | undefined) => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setActividades([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchActividades = async () => {
      try {
        const response = await clienteAxios.get(`/mantenimientos/actividades/${id}`);
        setActividades(response.data.actividades || []);
      } catch (err: any) {
        setError("Error al obtener actividades: " + (err?.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, [id]);

  return { actividades, cantidad: actividades.length, loading, error };
};