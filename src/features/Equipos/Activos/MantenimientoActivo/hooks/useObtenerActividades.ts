import { useState, useEffect } from "react";
import clienteAxios from "../../../../../hooks";

export interface Actividad {
  id_actividad_periferico_tipo?: number;
  id_actividad_mantenimiento?: number;
  nombre: string;
  tipo_mantenimiento?: string;
  realizada?: boolean;
}

export const useObtenerActividadesEquipo = (
  id: string | null | undefined,
  tipo: string = "all" // 'preventivo' | 'correctivo' | 'all'
) => {
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
        const url =
          tipo && tipo !== "all"
            ? `/mantenimientos/actividades/${id}?tipo=${encodeURIComponent(tipo)}`
            : `/mantenimientos/actividades/${id}?tipo=all`;

        const response = await clienteAxios.get(url);
        const raw = response.data.actividades || [];

        const normalized: Actividad[] = raw.map((r: any) => ({
          id_actividad_periferico_tipo: r.id_actividad_periferico_tipo,
          id_actividad_mantenimiento:
            r.id_actividad_mantenimiento ?? r.id_actividad_mantenimiento,
          nombre: (r.actividad || r.nombre || "").toString(),
          tipo_mantenimiento: r.tipo_mantenimiento,
          realizada: !!r.realizada,
        }));

        setActividades(normalized);
      } catch (err: any) {
        setError(
          "Error al obtener actividades: " +
            (err?.response?.data?.error || err.message)
        );
        setActividades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, [id, tipo]);

  return { actividades, cantidad: actividades.length, loading, error };
};