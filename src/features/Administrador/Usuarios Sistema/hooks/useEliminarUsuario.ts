import { useState } from "react";
import clienteAxios from "@hooks/index";

const useEliminarUsuario = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [tieneEquipos, setTieneEquipos] = useState<boolean>(false);

  const eliminarUsuario = async (id_usuario: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setTieneEquipos(false);

    try {
      const response = await clienteAxios.delete(`/usuarios/${id_usuario}`);

      if (response.status === 200) {
        setSuccess(true); 
        return { success: true, tieneEquipos: false };  
      } else {
        if (response.data && response.data.tieneEquipos) {
          setTieneEquipos(true);
          return { success: false, tieneEquipos: true };  
        }
      }
    } catch (err) {
      setError("Error al eliminar el usuario.");
      return { success: false, error: "Error al eliminar el usuario" };  
    } finally {
      setLoading(false);
    }

    return { success: false, tieneEquipos: false };
  };

  return { eliminarUsuario, loading, error, success, tieneEquipos };
};

export default useEliminarUsuario;
