import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarVersionSO = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarVersionSO = async (versionSOData: { id_versionso: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/versionesSO/", versionSOData);
      setMessage(data.mensaje);  
      return data.id_versionso; 
    } catch (err) {
      setError("Error al editar version SO: " + err); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarVersionSO, loading, error, message };
};
