import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarRAM = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarRAM = async (ramData: { id_ram: number; tipo: string; capacidad: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/ram/", ramData);
      setMessage(data.message);
      return data.ram.id_ram;
    } catch (err) {
      setError("Error al editar la RAM: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarRAM, loading, error, message };
};
