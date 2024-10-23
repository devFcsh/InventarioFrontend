import { useState } from "react";
import clienteAxios from "../../../../hooks";

export const useEliminarComputadoraActivo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const eliminarEquipo = async (idEquipo: string | null) => {
    if (idEquipo === null) {
      setError("ID del equipo es requerido");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await clienteAxios.delete(`/equipos/computadora/${idEquipo}`)
      setSuccess(true);
    } catch (err) {
      setError("Error al eliminar el equipo" + err);
    } finally {
      setLoading(false);
    }
  };

  return { eliminarEquipo, loading, error, success };
};
