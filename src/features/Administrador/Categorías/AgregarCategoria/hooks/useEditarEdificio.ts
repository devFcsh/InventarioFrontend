import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarEdificio = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarEdificio = async (edificioData: { id_edificio: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/edificios/", edificioData);
      setMessage(data.mensaje);  
      return data.id_edificio; 
    } catch (err) {
      setError("Error al editar el edificio: " + err); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarEdificio, loading, error, message };
};
