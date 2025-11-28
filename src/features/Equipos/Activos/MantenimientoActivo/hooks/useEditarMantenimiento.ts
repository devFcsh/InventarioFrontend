import clienteAxios from "@hooks/index";
import { useState } from "react";
import { MantenimientoData } from "../../../../../types/Activo/Mantenimiento";
import { useUser } from "@context/userContext";

const useEditarMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useUser();

  const editarMantenimiento = async (id_mantenimiento: number | string, mantenimientoData: Partial<MantenimientoData>) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload: Record<string, unknown> = {
        tipo: mantenimientoData.tipo,
        hallazgos: mantenimientoData.hallazgos ?? null,
        recomendaciones: mantenimientoData.recomendaciones ?? null,
        editor: user?.email ?? null,
        fecha: mantenimientoData.fecha ?? null,
        actividades: (mantenimientoData.actividades || []).map((a: unknown) => {
          const aa = a as Record<string, unknown>;
          if (aa && Object.prototype.hasOwnProperty.call(aa, 'id_actividad_periferico_tipo')) return { id_actividad_periferico_tipo: aa['id_actividad_periferico_tipo'], realizada: !!aa['realizada'] };
          return { id_actividad_mantenimiento: aa['id_actividad_mantenimiento'], realizada: !!aa['realizada'] };
        }),
      };

      await clienteAxios.put(`/mantenimientos/${id_mantenimiento}`, payload);
      setMessage("Mantenimiento actualizado correctamente");
      return true;
    } catch (err) {
      let msg = String(err);
      try {
        const json = String(JSON.stringify(err, Object.getOwnPropertyNames(err)));
        if (json && json !== "{}") msg = json;
      } catch (e) {
        msg = String(err);
      }
      setError("Error al actualizar el mantenimiento: " + msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { editarMantenimiento, loading, error, message };
};

export default useEditarMantenimiento;
