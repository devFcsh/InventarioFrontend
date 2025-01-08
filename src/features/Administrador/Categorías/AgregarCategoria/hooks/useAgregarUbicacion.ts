import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarUbicacion  = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarUbicacion = async (ubicacionData: { nombre: string, edificioId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/ubicaciones", ubicacionData);
      
      setMessage(data.mensaje);  
      return data.id_ubicacion; 
    } catch (err) {
      setError("Error al agregar el ubicacion: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarUbicacion, loading, error, message };
};
