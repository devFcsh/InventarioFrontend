import { useState } from "react";
import clienteAxios from "@hooks/index";
import { ActivoComputadoraImport } from "../../../../types/Activo";
import type { ImportMode, ImportMatchItem } from "../../shared/importTypes.ts";

export type ImportarEquiposResultado = {
  success: boolean;
  message: string;
  resumen?: {
    totalProcesados: number;
    registrados: number;
    actualizados: number;
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
  actualizados?: ImportMatchItem[];
  advertencias?: Array<{
    inventario?: string;
    motivo: string;
    datos?: ActivoComputadoraImport;
  }>;
  error?: string;
};

const IMPORT_BATCH_SIZE = 50;

export type ImportacionPrevisualizacion = {
  actualizables: ImportMatchItem[];
  nuevos: ActivoComputadoraImport[];
  conflictos: ImportMatchItem[];
};

const consolidarResultados = (
  resultados: ImportarEquiposResultado[],
  totalProcesados: number
): ImportarEquiposResultado => {
  const registrados = resultados.flatMap((resultado) => resultado.registrados ?? []);
  const noRegistrados = resultados.flatMap((resultado) => resultado.noRegistrados ?? []);
  const advertencias = resultados.flatMap((resultado) => resultado.advertencias ?? []);
  const equiposAgregados = resultados.reduce(
    (total, resultado) =>
      total +
      (resultado.resumen?.equiposAgregados ??
        resultado.resumen?.registrados ??
        resultado.registrados?.length ??
        0),
    0
  );

  return {
    success: resultados.every((resultado) => resultado.success),
    message: "Proceso completado",
    resumen: {
      totalProcesados,
      registrados: registrados.length,
      actualizados: resultados.reduce(
        (total, resultado) => total + (resultado.resumen?.actualizados ?? resultado.actualizados?.length ?? 0),
        0
      ),
      noRegistrados: noRegistrados.length,
      equiposAgregados,
      seInsertaronNuevos: resultados.some(
        (resultado) => resultado.resumen?.seInsertaronNuevos === true
      ),
    },
    registrados,
    actualizados: resultados.flatMap((resultado) => resultado.actualizados ?? []),
    noRegistrados,
    advertencias,
  };
};

export const useImportarEquipoBodega = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ImportarEquiposResultado | null>(null);

  const previsualizarImportacion = async (equiposData: ActivoComputadoraImport[]) => {
    const { data } = await clienteAxios.post<ImportacionPrevisualizacion>(
      "/equipos/previsualizarImportacion",
      { equipos: equiposData }
    );
    return data;
  };

  const importarEquiposBodega = async (
    equiposData: ActivoComputadoraImport[],
    autor?: string,
    modoImportacion: ImportMode = "solo_nuevos"
  ) => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const resultados: ImportarEquiposResultado[] = [];

      for (let inicio = 0; inicio < equiposData.length; inicio += IMPORT_BATCH_SIZE) {
        const lote = equiposData.slice(inicio, inicio + IMPORT_BATCH_SIZE);
        const { data } = await clienteAxios.post<ImportarEquiposResultado>(
          "/equipos/importarEquiposActivos",
          { equipos: lote, autor: autor ?? "", modoImportacion }
        );
        resultados.push(data);
      }

      const resultadoConsolidado = consolidarResultados(resultados, equiposData.length);
      setResultado(resultadoConsolidado);
      return resultadoConsolidado;
    } catch (err) {
      setError("Error al importar los equipos: " + (err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { importarEquiposBodega, previsualizarImportacion, loading, error, resultado };
};
