import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarModelo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarModelo = async (modeloData: { nombre: string, marcaId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/modelos", modeloData);
      
      setMessage(data.mensaje);  
      return data.id_modelo; 
    } catch (err) {
      setError("Error al agregar el modelo: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarModelo, loading, error, message };
};
