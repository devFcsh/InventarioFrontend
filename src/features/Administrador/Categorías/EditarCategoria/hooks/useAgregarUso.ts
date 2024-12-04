import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarUso = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarUso = async (usoData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/usos", usoData);
      
      setMessage(data.mensaje);  
      return data.id_uso; 
    } catch (err) {
      setError("Error al agregar uso: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarUso, loading, error, message };
};
