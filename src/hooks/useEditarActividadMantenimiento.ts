/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import clienteAxios from ".";

interface EditarActividadPayload {
  nombre: string;
}

export const useEditarActividadMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarActividad = async (id: number, payload: EditarActividadPayload): Promise<{ ok: boolean; message?: string | null; error?: string | null; id_actividad_mantenimiento?: number }> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await clienteAxios.put(`/mantenimientos/actividad/${id}`, {
        nombre: payload.nombre,
      });

      const id_actividad = response?.data?.id_actividad_mantenimiento;
      const successMsg = "Actividad editada correctamente";
      setMessage(successMsg);
      return { ok: true, message: successMsg, id_actividad_mantenimiento: id_actividad };
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || String(err);
      const errMsg = "Error al editar actividad: " + msg;
      setError(errMsg);
      return { ok: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { editarActividad, loading, error, message };
};
