import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarVersionOffice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarVersionOffice = async (versionOfficeData: { id_versionoffice: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/versionesOffice/", versionOfficeData);
      setMessage(data.mensaje);  
      return data.id_versionoffice; 
    } catch (err) {
      setError("Error al editar version Office: " + err); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarVersionOffice, loading, error, message };
};
