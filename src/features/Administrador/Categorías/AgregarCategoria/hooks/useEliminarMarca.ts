import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarMarca = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarMarca = async (id_marca: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/marcas/${id_marca}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar el marca: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarMarca, loading, error, message };
};
