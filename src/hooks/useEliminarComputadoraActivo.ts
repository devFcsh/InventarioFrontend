import { useState } from "react";
import axios from "axios";

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
      await axios.delete(`http://localhost:5000/api/equipos/computadora/${idEquipo}`);
      setSuccess(true);
    } catch (err) {
      setError("Error al eliminar el equipo");
    } finally {
      setLoading(false);
    }
  };

  return { eliminarEquipo, loading, error, success };
};
