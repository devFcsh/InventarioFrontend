/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import clienteAxios from "../../../../../hooks";
import { Mantenimiento } from "../../../../../types/Activo/Mantenimiento";

export const useMantenimientos = (id_equipo: string | null | undefined) => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(!!id_equipo);
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

        const capitalize = (s: any) => (typeof s === "string" && s.length ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : undefined);

        const normalized: Mantenimiento[] = raw.map((m: any) => ({
          id_mantenimiento: m.id_mantenimiento,
          fecha: m.fecha,
          hallazgos: m.hallazgos ?? null,
          recomendaciones: m.recomendaciones ?? null,
          editor: m.editor ?? "No editado",
          autor: m.autor ?? "",
          id_tipo_mantenimiento: m.id_tipo_mantenimiento ?? undefined,
          tipo: capitalize(m.tipo_mantenimiento ?? m.tipo ?? (m.id_tipo_mantenimiento === 1 ? 'preventivo' : m.id_tipo_mantenimiento === 2 ? 'correctivo' : undefined)),
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