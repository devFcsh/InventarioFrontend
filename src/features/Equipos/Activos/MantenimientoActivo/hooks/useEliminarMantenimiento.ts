import clienteAxios from "@hooks/index";
import { useState } from "react";

export const useEliminarMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const eliminarMantenimiento = async (
    id: number | string
  ): Promise<{ success: boolean; message: string }> => {
    if (!id) return { success: false, message: "ID inválido" };
    setLoading(true);
    try {
      await clienteAxios.delete(`/mantenimientos/${id}`);
      return { success: true, message: "Mantenimiento eliminado" };
    } catch (err) {
      const message = (err as any)?.response?.data?.error || (err as any)?.message || String(err);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return { eliminarMantenimiento, loading };
};

export default useEliminarMantenimiento;
