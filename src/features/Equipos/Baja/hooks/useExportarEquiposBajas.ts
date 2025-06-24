import { useState } from "react";
import { ExportarEquiposBaja } from "../../../../types/Equipo";
import clienteAxios from "../../../../hooks";


export const useExportarEquiposBajas = () => {
  const [equipos, setEquipos] = useState<ExportarEquiposBaja[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodosEquipos = async (): Promise<ExportarEquiposBaja[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.get("/equipos/exportarEquiposBaja");
      console.log(data)
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