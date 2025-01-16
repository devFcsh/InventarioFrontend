import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarDisco = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarDisco = async (id_disco: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/discos/${id_disco}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el disco: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarDisco, loading, error, message };
};
