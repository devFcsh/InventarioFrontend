import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarVersionOffice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarVersionOffice = async (versionOfficeData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/versionesoffice", versionOfficeData);
      
      setMessage(data.mensaje);  
      return data.id_versionoffie; 
    } catch (err) {
      setError("Error al agregar version de office: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarVersionOffice, loading, error, message };
};
