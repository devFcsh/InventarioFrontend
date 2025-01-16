import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarEdificio = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarEdificio = async (id_edificio: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/edificios/${id_edificio}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el edificio: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarEdificio, loading, error, message };
};
