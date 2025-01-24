import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarLampara = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarLampara = async (lamparaData: { nombre: string, modeloId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/lamparas", lamparaData);
      
      setMessage(data.mensaje);  
      return data.id_lampara; 
    } catch (err) {
      setError("Error al agregar la lampara: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarLampara, loading, error, message };
};
