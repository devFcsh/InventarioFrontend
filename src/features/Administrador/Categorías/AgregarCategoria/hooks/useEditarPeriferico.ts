import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarPeriferico = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarPeriferico = async (perifericoData: { id_periferico: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/perifericos/", perifericoData);
      setMessage(data.mensaje);  
      return data.id_periferico; 
    } catch (err) {
      setError("Error al editar el periferico: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarPeriferico, loading, error, message };
};
