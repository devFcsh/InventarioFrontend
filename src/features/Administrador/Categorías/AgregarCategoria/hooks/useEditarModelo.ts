import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarModelo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarModelo = async (modeloData: { id_modelo: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/modelos/", modeloData);
      setMessage(data.mensaje);  
      return data.id_modelo; 
    } catch (err) {
      setError("Error al editar el modelo: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarModelo, loading, error, message };
};
