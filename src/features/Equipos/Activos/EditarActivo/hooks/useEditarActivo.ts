import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import { ActivoComputadoraEditSend } from "../../../../../types/Activo";

const useEditarActivo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarActivo = async (equipoId: string, payload: ActivoComputadoraEditSend) => {
    setLoading(true);
    console.log(payload)
    try {
      const response = await clienteAxios.put(`/equipos/editarEquipo/${equipoId}`, payload, {
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

  return { editarActivo, loading, error };
};

export default useEditarActivo;