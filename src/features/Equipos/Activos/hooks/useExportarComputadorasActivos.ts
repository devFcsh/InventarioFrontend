import { useState } from "react";
import { ExportarComputadora, ExportarAP, ExportarSwitch, ExportarProyector, ExportarSimples } from "../../../../types/Equipo";
import clienteAxios from "../../../../hooks";

interface ExportarEquiposResponse {
  Computadoras: ExportarComputadora[];
  AccessPoint: ExportarAP[];
  Switch: ExportarSwitch[];
  Proyector: ExportarProyector[];
  EquiposSimples: ExportarSimples[];
}

export const useExportarEquiposActivos = () => {
  const [equipos, setEquipos] = useState<ExportarEquiposResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodosEquipos = async (): Promise<ExportarEquiposResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.get("/equipos/exportarEquiposActivos");
      setEquipos(data);
      return data;
    } catch (err) {
      setError("Error al cargar los equipos: " + err);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { equipos, fetchTodosEquipos, loading, error };
};
