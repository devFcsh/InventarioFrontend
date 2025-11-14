import clienteAxios from "@hooks/index";
import { useState } from "react";
import { MantenimientoData } from "../../../../../types/Activo/Mantenimiento";

const useEditarMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarMantenimiento = async (id_mantenimiento: number | string, mantenimientoData: Partial<MantenimientoData>) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload: any = {
        tipo: mantenimientoData.tipo,
        hallazgos: mantenimientoData.hallazgos ?? null,
        recomendaciones: mantenimientoData.recomendaciones ?? null,
        fecha: mantenimientoData.fecha ?? null,
        actividades: (mantenimientoData.actividades || []).map((a: any) => {
          if (a.id_actividad_periferico_tipo) return { id_actividad_periferico_tipo: a.id_actividad_periferico_tipo, realizada: !!a.realizada };
          return { id_actividad_mantenimiento: a.id_actividad_mantenimiento, realizada: !!a.realizada };
        }),
      };

      await clienteAxios.put(`/mantenimientos/${id_mantenimiento}`, payload);
      setMessage("Mantenimiento actualizado correctamente");
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || String(err);
      setError("Error al actualizar el mantenimiento: " + msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { editarMantenimiento, loading, error, message };
};

export default useEditarMantenimiento;
