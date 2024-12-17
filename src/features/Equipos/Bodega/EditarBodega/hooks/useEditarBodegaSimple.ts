import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import { BodegaSimpleEditSend } from "../../../../../types/Bodega";

const useEditarBodegaSimple = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarBodegaSimple = async (equipoId: string, payload: BodegaSimpleEditSend) => {
    setLoading(true);
    try {
      const response = await clienteAxios.put(`/equipos/editarEquipoSimple/${equipoId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      setError("Error al editar bodega" + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarBodegaSimple, loading, error };
};

export default useEditarBodegaSimple;