import { useState, useEffect } from "react";
import clienteAxios from ".";

interface Actividad {
  id: number;
  actividad: string;
  tipo: string;
}

export const useObtenerTodasActividadesMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const obtenerActividades = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.get("mantenimientos/actividades/todas");
      setActividades(data.actividades || []);
    } catch (err) {
      setError("Error al obtener las actividades: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerActividades();
  }, []);

  return { actividades, loading, error, refetch: obtenerActividades };
};
