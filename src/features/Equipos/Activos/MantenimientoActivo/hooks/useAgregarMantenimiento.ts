import clienteAxios from "@hooks/index";
import { MantenimientoData } from "../../../../../types/Activo/Mantenimiento";
import { useState } from "react";

export const useAgregarMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarMantenimiento = async (mantenimientoData: MantenimientoData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        id_equipo: mantenimientoData.id_equipo,
        tipo: mantenimientoData.tipo,
        hallazgos: mantenimientoData.hallazgos ?? null,
        recomendaciones: mantenimientoData.recomendaciones ?? null,
        actividades: (mantenimientoData.actividades || []).map((a) => {
          // Si ya tiene id_actividad_periferico_tipo preferirlo
          if ((a as any).id_actividad_periferico_tipo) {
            return {
              id_actividad_periferico_tipo: (a as any).id_actividad_periferico_tipo,
              realizada: !!a.realizada,
            };
          }
          return {
            id_actividad_mantenimiento: a.id_actividad_mantenimiento,
            realizada: !!a.realizada,
          };
        }),
      };

      await clienteAxios.post("/mantenimientos/", payload);
      setMessage("Mantenimiento registrado correctamente");
    } catch (err: any) {
      setError("Error al registrar el mantenimiento: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return { agregarMantenimiento, loading, error, message };
};