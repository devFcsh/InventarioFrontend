import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarModelo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarModelo = async (id_modelo: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/modelos/${id_modelo}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el modelo: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarModelo, loading, error, message };
};
