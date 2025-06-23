import { useState } from "react";
import clienteAxios from "@hooks/index";

const useEditarUsuarioSistema = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const editarUsuarioSistema = async (
    id_usuario_sistema: string,
    nuevoCorreo: string,
    nuevoRolId: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await clienteAxios.put(`/usuariosSistema/${id_usuario_sistema}`, {
        nuevoCorreo,
        nuevoRolId,
      });

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError("Error al actualizar el usuario de sistema");
    } finally {
      setLoading(false);
    }
  };

  return { editarUsuarioSistema, loading, error, success };
};

export default useEditarUsuarioSistema;