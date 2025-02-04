import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import {BodegaRedEditSend } from "../../../../../types/Bodega";

const useEditarBodegaRed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarBodegaRed = async (equipoId: string, payload: BodegaRedEditSend) => {
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

  return { editarBodegaRed, loading, error };
};

export default useEditarBodegaRed;