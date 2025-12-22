import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import { ActivoSimpleEditSend } from "../../../../../types/Activo";

const useEditarActivoSimple = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarActivoSimple = async (equipoId: string, payload: ActivoSimpleEditSend) => {
    setLoading(true);
    try {
      const response = await clienteAxios.put(`/equipos/editarEquipoSimple/${equipoId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || "Error al editar activo";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { editarActivoSimple, loading, error };
};

export default useEditarActivoSimple;