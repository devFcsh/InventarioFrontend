import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarSerie = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarSerie = async (id_serie: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/series/${id_serie}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el serie: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarSerie, loading, error, message };
};
