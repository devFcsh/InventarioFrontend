import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarUsuario = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarUsuario = async (usuarioData: { nombre: string, usoId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/usuarios/agregar", usuarioData);
      
      setMessage(data.mensaje);  
      return data.id_usuario; 
    } catch (err) {
      setError("Error al agregar el usuario: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarUsuario, loading, error, message };
};
