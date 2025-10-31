import { useState, useEffect } from "react";
import clienteAxios from "../../../../../hooks";
import { Mantenimiento } from "../../../../../types/Activo/Mantenimiento";

export const useMantenimientos = (id_equipo: string | null | undefined) => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_equipo) {
      setMantenimientos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const obtenerMantenimientos = async () => {
      try {
        const response = await clienteAxios.get(`/mantenimientos/${id_equipo}`);
        const raw: any[] = response.data.mantenimientos || [];

        const normalized: Mantenimiento[] = raw.map((m: any) => ({
          id_mantenimiento: m.id_mantenimiento,
          fecha: m.fecha,
          hallazgos: m.hallazgos ?? null,
          recomendaciones: m.recomendaciones ?? null,
          actividades: (m.actividades || []).map((a: any) => ({
            id_actividad_periferico_tipo: a.id_actividad_periferico_tipo,
            id_actividad_mantenimiento: a.id_actividad_mantenimiento,
            actividad: a.actividad ?? a.nombre ?? "",
            tipo_mantenimiento: a.tipo_mantenimiento ?? undefined,
            realizada: !!a.realizada,
          })),
        }));

        setMantenimientos(normalized);
        setError(null);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setMantenimientos([]);
          setError("Equipo no encontrado");
        } else {
          setError("Error al obtener mantenimientos: " + (err?.response?.data?.error || err.message || String(err)));
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerMantenimientos();
  }, [id_equipo]);

  return { mantenimientos, loading, error };
};