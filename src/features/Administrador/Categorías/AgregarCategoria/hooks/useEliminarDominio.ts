import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarDominio = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarDominio = async (id_dominio: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/dominios/${id_dominio}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el dominio: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarDominio, loading, error, message };
};
