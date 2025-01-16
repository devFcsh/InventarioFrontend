import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarSistemaOperativo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarSistemaOperativo = async (id_sistemaoperativo: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/sistemasoperativos/${id_sistemaoperativo}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el sistema operativo: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarSistemaOperativo, loading, error, message };
};
