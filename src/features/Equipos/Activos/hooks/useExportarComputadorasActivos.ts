import { useState } from "react";
import { ExportarComputadora } from "../../../../types/Equipo";
import clienteAxios from "../../../../hooks";

export const useExportarComputadorasActivos = () => {
  const [equipos, setEquipos] = useState<ExportarComputadora[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodosEquipos = async (): Promise<ExportarComputadora[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.get("/equipos/exportarComputadorasActivos");
      setEquipos(data);
      return data; 
    } catch (err) {
      setError("Error al cargar los equipos: " + err);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { equipos, fetchTodosEquipos, loading, error };
};
