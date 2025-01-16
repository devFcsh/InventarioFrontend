import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarUso = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarUso = async (id_uso: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/usos/${id_uso}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el uso: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarUso, loading, error, message };
};
