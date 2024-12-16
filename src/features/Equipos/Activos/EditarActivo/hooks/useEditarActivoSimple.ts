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
    } catch (err) {
      setError("Error al editar activo" + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarActivoSimple, loading, error };
};

export default useEditarActivoSimple;