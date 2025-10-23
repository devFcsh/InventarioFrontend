import { useState, useEffect } from "react";
import clienteAxios from "../../../../../hooks";
import { Mantenimiento } from "../../../../../types/Activo/Mantenimiento";

export const useMantenimientos = (id_equipo: string | null | undefined) => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_equipo) {
      setMantenimientos([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const obtenerMantenimientos = async () => {
      try {
        const response = await clienteAxios.get(`/mantenimientos/${id_equipo}`);
        setMantenimientos(response.data.mantenimientos || []);
        setError(null);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setMantenimientos([]);
          setError("Equipo no encontrado");
        } else {
          setError("Error al obtener mantenimientos: " + (err?.message || err));
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerMantenimientos();
  }, [id_equipo]);

  return { mantenimientos, loading, error };
};