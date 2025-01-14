import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarDisco = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarDisco = async (discoData: { id_disco: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/discos/", discoData);
      setMessage(data.mensaje);  
      return data.id_disco; 
    } catch (err) {
      setError("Error al editar el disco: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarDisco, loading, error, message };
};
