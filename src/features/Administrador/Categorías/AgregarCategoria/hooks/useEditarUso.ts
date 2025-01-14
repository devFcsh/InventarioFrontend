import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarUso = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarUso = async (usoData: { id_uso: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/usos/", usoData);
      setMessage(data.mensaje);  
      return data.id_uso; 
    } catch (err) {
      setError("Error al editar el uso: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarUso, loading, error, message };
};
