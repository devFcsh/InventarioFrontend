/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import clienteAxios from "@hooks/index";

interface NuevaActividadPayload {
  nombre: string;
  id_periferico?: number | null;
  tipo: string;
}

export const useAgregarActividadMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarActividad = async (payload: NuevaActividadPayload): Promise<{ ok: boolean; message?: string | null; error?: string | null; actividad?: any }> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await clienteAxios.post(`/mantenimientos/actividad`, {
        nombre: payload.nombre,
        id_periferico: payload.id_periferico ?? null,
        tipo: payload.tipo,
      });

      const actividad = response?.data?.actividad || response?.data || null;
      const successMsg = "Actividad agregada correctamente";
      setMessage(successMsg);
      return { ok: true, message: successMsg, actividad };
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || String(err);
      const errMsg = "Error al agregar actividad: " + msg;
      setError(errMsg);
      return { ok: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { agregarActividad, loading, error, message };
};
