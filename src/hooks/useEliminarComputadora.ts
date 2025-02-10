import { useState } from "react";
import clienteAxios from ".";

export const useEliminarComputadora = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  
  const eliminarEquipo = async (idEquipo: string | null) => {
    setLoading(true);
    setSuccess(null);
    try {
      const response = await clienteAxios.delete(`/equipos/computadora/${idEquipo}`);
      if (response.status === 200) {
        setSuccess(true);
        return true;
      } else {
        setSuccess(false);
        return false;
      }
    } catch (err) {
      setError("Error al eliminar el equipo");
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { eliminarEquipo, loading, error, success };
};