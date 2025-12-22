/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import clienteAxios from ".";

interface EliminarActividadResponse {
  ok: boolean;
  message?: string | null;
  error?: string | null;
  id_actividad_mantenimiento?: number;
  enUso?: boolean;
  cantidadMantenimientos?: number;
}

export const useEliminarActividadMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarActividad = async (id: number): Promise<EliminarActividadResponse> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await clienteAxios.delete(`/mantenimientos/actividad/${id}`);

      const id_actividad = response?.data?.id_actividad_mantenimiento;
      const successMsg = "Actividad eliminada correctamente";
      setMessage(successMsg);
      return { ok: true, message: successMsg, id_actividad_mantenimiento: id_actividad };
    } catch (err: any) {
      const responseData = err?.response?.data;
      
      if (responseData?.enUso) {
        const errMsg = responseData.error || "No se puede eliminar la actividad porque está en uso";
        setError(errMsg);
        return {
          ok: false,
          error: errMsg,
          enUso: true,
          cantidadMantenimientos: responseData.cantidadMantenimientos
        };
      }

      const msg = responseData?.error || err?.message || String(err);
      const errMsg = "Error al eliminar actividad: " + msg;
      setError(errMsg);
      return { ok: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { eliminarActividad, loading, error, message };
};
