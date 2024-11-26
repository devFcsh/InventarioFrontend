import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarPeriferico = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarPeriferico = async (perifericoData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/periferico", perifericoData);
      
      setMessage(data.mensaje);  
      return data.id_periferico; 
    } catch (err) {
      setError("Error al agregar el periferico: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarPeriferico, loading, error, message };
};
