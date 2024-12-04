import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarSistemaOperativo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarSistemaOperativo = async (soData: { nombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/sistemasoperativo", soData);
      
      setMessage(data.mensaje);  
      return data.id_sistemaoperativo; 
    } catch (err) {
      setError("Error al agregar sistema operativo: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarSistemaOperativo, loading, error, message };
};