import { useState } from "react";
import clienteAxios from "@hooks/index";
import { ActivoComputadoraImport } from "../../../../types/Activo";

export type ImportarEquiposResultado = {
  success: boolean;
  message: string;
  resumen?: {
    totalProcesados: number;
    registrados: number;
    noRegistrados: number;
  };
  registrados?: Array<{
    inventario: string;
    equipoId: number | undefined;
    componentesRegistrados: number;
    datos: ActivoComputadoraImport;
  }>;
  noRegistrados?: Array<{
    inventario: string;
    motivo: string;
    datos: ActivoComputadoraImport;
  }>;
  error?: string;
};

export const useImportarEquipoActivo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ImportarEquiposResultado | null>(null);

  const importarEquiposActivos = async (equiposData: ActivoComputadoraImport[]) => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const { data } = await clienteAxios.post<ImportarEquiposResultado>("/equipos/importarEquiposActivos", equiposData);
      setResultado(data);
      return data;
    } catch (err) {
      setError("Error al importar los equipos: " + (err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { importarEquiposActivos, loading, error, resultado };
};