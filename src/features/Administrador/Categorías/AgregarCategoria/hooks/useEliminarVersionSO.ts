import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarVersionSO = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarVersionSO = async (id_versionso: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/versionesSO/${id_versionso}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el version so: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarVersionSO, loading, error, message };
};
