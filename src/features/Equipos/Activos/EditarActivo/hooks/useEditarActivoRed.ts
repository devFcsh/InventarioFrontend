import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import { ActivoRedEditSend } from "../../../../../types/Activo";

const useEditarActivoRed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarActivoRed = async (equipoId: string, payload: ActivoRedEditSend) => {
    setLoading(true);
    try {
      const response = await clienteAxios.put(`/equipos/editarEquipoRed/${equipoId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      setError("Error al editar activo" + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarActivoRed, loading, error };
};

export default useEditarActivoRed;