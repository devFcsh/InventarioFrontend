import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import {BodegaComputadoraEditSend} from "../../../../../types/Bodega";

export const useEditarBodega = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarBodega = async (equipoId: string, payload: BodegaComputadoraEditSend) => {
    setLoading(true);
    try {
      const response = await clienteAxios.put(`/equipos/editarEquipo/${equipoId}`, payload, {
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


  return { editarBodega, loading, error };
};

