import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarProcesador = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarProcesador = async (id_procesador: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/procesadores/${id_procesador}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el procesador: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarProcesador, loading, error, message };
};
