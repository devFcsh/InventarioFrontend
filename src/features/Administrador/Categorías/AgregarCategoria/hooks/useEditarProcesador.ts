import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarProcesador = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarProcesador = async (procesadorData: { id_procesador: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/procesadores/", procesadorData);
      setMessage(data.mensaje);  
      return data.id_procesador; 
    } catch (err) {
      setError("Error al editar procesador: " + err); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarProcesador, loading, error, message };
};
