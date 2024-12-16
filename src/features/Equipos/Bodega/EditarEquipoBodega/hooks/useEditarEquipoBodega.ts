import { useState } from "react";
import clienteAxios from "../../../../../hooks";
import { BodegaComputadoraEditSend } from "../../../../../types/Bodega";

const useEditarEquipoBodega = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarEquipoBodega = async (equipoId: string, payload: BodegaComputadoraEditSend) => {
    setLoading(true);
    try {
      const response = await clienteAxios.put(`/equipos/editarEquipo/${equipoId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      setError("Error al editar equipo bodega" + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarEquipoBodega, loading, error };
};

export default useEditarEquipoBodega;