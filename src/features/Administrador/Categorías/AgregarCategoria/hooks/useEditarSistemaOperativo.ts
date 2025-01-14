import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarSistemaOperativo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarSistemaOperativo = async (sistemaOperativoData: { id_sistemaoperativo: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/sistemasoperativos/", sistemaOperativoData);
      setMessage(data.mensaje);  
      return data.id_sistemaoperativo; 
    } catch (err) {
      setError("Error al editar el sistema operativo: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarSistemaOperativo, loading, error, message };
};
