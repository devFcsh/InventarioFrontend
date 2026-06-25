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
    equiposAgregados: number;
    seInsertaronNuevos: boolean;
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

export const useImportarEquipoBodega = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ImportarEquiposResultado | null>(null);

  const importarEquiposBodega = async (equiposData: ActivoComputadoraImport[], autor?: string) => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const payload = { equipos: equiposData, autor: autor ?? "" };
      const { data } = await clienteAxios.post<ImportarEquiposResultado>("/equipos/importarEquiposActivos", payload);
      setResultado(data);
      return data;
    } catch (err) {
      setError("Error al importar los equipos: " + (err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { importarEquiposBodega, loading, error, resultado };
};
