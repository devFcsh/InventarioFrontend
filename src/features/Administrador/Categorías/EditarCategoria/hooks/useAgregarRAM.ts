import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarRAM = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarRam = async (ramData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/ram", ramData);
      
      setMessage(data.mensaje);  
      return data.id_ram; 
    } catch (err) {
      setError("Error al agregar la ram: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarRam, loading, error, message };
};
