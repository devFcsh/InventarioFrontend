import { useState } from "react";
import clienteAxios from "../../../../../hooks";

const useEditarActivo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarActivo = async (equipoId: number, payload: any) => {
    setLoading(true);
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
