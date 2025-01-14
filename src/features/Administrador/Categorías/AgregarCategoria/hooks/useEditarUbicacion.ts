import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarUbicacion = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarUbicacion = async (ubicacionData: { id_ubicacion: number, nuevoNombre: string }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/ubicaciones/", ubicacionData);
      setMessage(data.mensaje);
      return data.id_ubicacion;
    } catch (err) {
      setError("Error al editar ubicacion: " + err); 
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarUbicacion, loading, error, message };
};
