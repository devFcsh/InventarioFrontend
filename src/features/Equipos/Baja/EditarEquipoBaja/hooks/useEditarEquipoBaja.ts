import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import { BajaSimpleEditSend } from "../../../../../types/Baja";

const useEditarBajaSimple = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarBajaSimple = async (equipoId: string, payload: BajaSimpleEditSend) => {
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

  return { editarBajaSimple, loading, error };
};

export default useEditarBajaSimple;