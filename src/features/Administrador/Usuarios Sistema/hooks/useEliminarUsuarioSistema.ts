import { useState } from "react";
import clienteAxios from "@hooks/index";

const useEliminarUsuarioSistema = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const eliminarUsuarioSistema = async (id_usuario_sistema: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await clienteAxios.delete(`/usuariosSistema/${id_usuario_sistema}`);

      if (response.status === 200) {
        setSuccess(true);
        return { success: true };
      }
    } catch (err) {
      setError("Error al eliminar el usuario de sistema.");
      return { success: false, error: "Error al eliminar el usuario de sistema" };
    } finally {
      setLoading(false);
    }

    return { success: false };
  };

  return { eliminarUsuarioSistema, loading, error, success };
};

export default useEliminarUsuarioSistema;