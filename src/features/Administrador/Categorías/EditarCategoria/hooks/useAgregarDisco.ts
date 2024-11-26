import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarDisco = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarDisco = async (discoData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/disco", discoData);
      
      setMessage(data.mensaje);  
      return data.id_disco; 
    } catch (err) {
      setError("Error al agregar el disco: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarDisco, loading, error, message };
};
