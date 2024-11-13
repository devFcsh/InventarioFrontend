import { useState } from "react";
import clienteAxios from "@hooks/index";
import { AxiosError } from "axios"; 

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
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.data && err.response.data.tieneEquipos) {
          setError(
            "No se puede eliminar el usuario porque tiene equipos asociados."
          );
          setTieneEquipos(true);
        } else {
          setError("Error al eliminar el usuario.");
        }
      } else {
        setError("Error desconocido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { eliminarUsuario, loading, error, success, tieneEquipos };
};

export default useEliminarUsuario;
