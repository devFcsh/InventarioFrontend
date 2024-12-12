import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarEdificio = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarEdificio = async (edificioData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/edificios", edificioData);
      
      setMessage(data.mensaje);  
      return data.id_edificio; 
    } catch (err) {
      setError("Error al agregar el edificio: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarEdificio, loading, error, message };
};
