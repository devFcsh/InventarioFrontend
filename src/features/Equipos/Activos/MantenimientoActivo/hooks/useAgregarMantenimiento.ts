/* eslint-disable @typescript-eslint/no-explicit-any */
import clienteAxios from "@hooks/index";
import { MantenimientoData } from "../../../../../types/Activo/Mantenimiento";
import { useState } from "react";
import { useUser } from "@context/userContext";

export const useAgregarMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useUser();

  const agregarMantenimiento = async (mantenimientoData: MantenimientoData): Promise<{ ok: boolean; message?: string | null; error?: string | null }> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        id_equipo: mantenimientoData.id_equipo,
        tipo: mantenimientoData.tipo,
        fecha: mantenimientoData.fecha ?? null,
        hallazgos: mantenimientoData.hallazgos ?? null,
        recomendaciones: mantenimientoData.recomendaciones ?? null,
        autor: user?.email ?? null,
        actividades: (mantenimientoData.actividades || []).map((a) => {
          if (a.id_actividad_periferico_tipo) {
            return {
              id_actividad_periferico_tipo: a.id_actividad_periferico_tipo,
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
      const successMsg = "Mantenimiento registrado correctamente";
      setMessage(successMsg);
      return { ok: true, message: successMsg };
    } catch (err) {
      const message = (err as any)?.response?.data?.error || (err as any)?.message || String(err);
      const errMsg = "Error al registrar el mantenimiento: " + message;
      setError(errMsg);
      return { ok: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { agregarMantenimiento, loading, error, message };
};