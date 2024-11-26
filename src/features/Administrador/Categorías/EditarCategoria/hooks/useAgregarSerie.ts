import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarSerie = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarSerie = async (serieData: { nombre: string, modeloId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/serie", serieData);
      
      setMessage(data.mensaje);  
      return data.id_serie; 
    } catch (err) {
      setError("Error al agregar la serie: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarSerie, loading, error, message };
};
