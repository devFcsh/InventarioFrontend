import { useState, useEffect } from "react";
import clienteAxios from "../../../../../hooks";

export interface MantenimientoItem {
  id_mantenimiento: number;
  fecha: string;
  id_equipo: number;
  inventario: string | null;
  periferico: string | null;
  serie: string | null;
}

export interface ListaMantenimientosResponse {
  total: number;
  mantenimientos: MantenimientoItem[];
}

export const useMantenimientosFiltrados = (
  filtros: { inventario?: string; serie?: string },
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean,
  sortBy?: string,
  sortDir?: "asc" | "desc"
) => {
  const [mantenimientos, setMantenimientos] = useState<MantenimientoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchMantenimientos = async () => {
      if (!shouldFetch) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await clienteAxios.get<ListaMantenimientosResponse>(
          "/mantenimientos/lista",
          {
            params: {
              ...filtros,
              limit: rowsPerPage,
              offset: (currentPage - 1) * rowsPerPage,
              sortBy: sortBy || undefined,
              sortDir: sortDir || undefined,
            },
          }
        );

        setMantenimientos(data.mantenimientos || []);
        setTotalCount(data.total || 0);
      } catch (err: any) {
        setError("Error al cargar mantenimientos: " + (err?.message || err));
      } finally {
        setLoading(false);
      }
    };

    fetchMantenimientos();
  }, [filtros, currentPage, rowsPerPage, shouldFetch, sortBy, sortDir]);

  return { mantenimientos, loading, error, totalCount };
};

export default useMantenimientosFiltrados;
