import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarDominio = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarDominio = async (dominioData: { id_dominio: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/dominios/", dominioData);
      setMessage(data.mensaje);  
      return data.id_dominio; 
    } catch (err) {
      setError("Error al editar el dominio: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarDominio, loading, error, message };
};
