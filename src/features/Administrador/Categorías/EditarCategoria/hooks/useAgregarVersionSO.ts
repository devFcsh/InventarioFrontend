import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarVersionSO = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarVersionSO = async (versionSOData: { nombre: string, sistemaoperativoId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/versionSO", versionSOData);
      
      setMessage(data.mensaje);  
      return data.id_versionSO; 
    } catch (err) {
      setError("Error al agregar la version so: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarVersionSO, loading, error, message };
};
