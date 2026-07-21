import { useState } from "react";
import clienteAxios from ".";

export const useEliminarEquipoSimple = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const eliminarEquipoSimple = async (idEquipo: string | null) => {
    if (idEquipo === null) {
      setError("ID del equipo es requerido");
      setSuccess(false);
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await clienteAxios.delete(`/equipos/equipoSimple/${idEquipo}`);
      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        return true;
      }
      setSuccess(false);
      return false;
    } catch (err) {
      const errorResponse = (err as {
        response?: { status?: number; data?: { error?: string } };
      }).response;

      // Puede haber sido eliminado en cascada junto con su computadora.
      if (
        errorResponse?.status === 400 &&
        errorResponse.data?.error === "El equipo no existe."
      ) {
        setSuccess(true);
        return true;
      }

      setError("Error al eliminar el equipo" + err);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarEquipoSimple, loading, error, success };
};
