import { useState, useEffect } from "react";
import { Filtros } from "../../../../types";
import { Equipo } from "../../../../types/Equipo";

import clienteAxios from "../../../../hooks";

export const useEquiposFiltrados = (
  filtros: Filtros,
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean,
  sortBy?: string,
  sortDir?: "asc" | "desc"
) => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!shouldFetch) return;
      setLoading(true);
      setError(null);

      try {
        const noLimit = rowsPerPage === 0;
        const params: any = {
          ...filtros,
          limit: noLimit ? "all" : rowsPerPage,
          ...(noLimit ? {} : { offset: (currentPage - 1) * rowsPerPage }),
          sortBy: sortBy || undefined,
          sortDir: sortDir || undefined,
        };

        const endpoint = "/equipos/";
        const { data } = await clienteAxios.get(endpoint, { params });

        setEquipos(data.equipos ?? data.items ?? []);
        setTotalCount(data.total ?? data.count ?? 0);
      } catch (err) {
        setError("Error al cargar los equipos: " + (String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [filtros, currentPage, rowsPerPage, shouldFetch, sortBy, sortDir]);

  return { equipos, loading, error, totalCount };
};
