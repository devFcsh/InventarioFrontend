import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarVersionOffice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarVersionOffice = async (id_versionoffice: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/versionesOffice/${id_versionoffice}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar version office: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarVersionOffice, loading, error, message };
};
