import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarRAM = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarRAM = async (id_ram: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/ram/${id_ram}`);
      setMessage(data.message);
    } catch (err) {
      setError("Error al eliminar la RAM: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarRAM, loading, error, message };
};
