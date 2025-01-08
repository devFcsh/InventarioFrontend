import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarProcesador = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarProcesador = async (procesadorData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/procesadores", procesadorData);
      
      setMessage(data.mensaje);  
      return data.id_procesador; 
    } catch (err) {
      setError("Error al agregar el procesador: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarProcesador, loading, error, message };
};
