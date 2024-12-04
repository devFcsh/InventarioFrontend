import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarDominio = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarDominio = async (dominioData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/dominios", dominioData);
      
      setMessage(data.mensaje);  
      return data.id_dominio; 
    } catch (err) {
      setError("Error al agregar el dominio: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarDominio, loading, error, message };
};
