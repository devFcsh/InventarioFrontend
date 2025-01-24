import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEliminarLampara = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const eliminarLampara = async (id_lampara: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.delete(`/lamparas/${id_lampara}`);
      setMessage(data.message);  
    } catch (err) {
      setError("Error al eliminar lampara: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarLampara, loading, error, message };
};
