import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarSerie = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarSerie = async (serieData: { id_serie: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/series/", serieData);
      setMessage(data.mensaje);  
      return data.id_serie;
    } catch (err) {
      setError("Error al editar serie: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarSerie, loading, error, message };
};
