import { useState, useEffect } from "react";
import { Filtros } from "../../../../types";
import { EquipoBaja } from "../../../../types/Equipo";

import clienteAxios from "../../../../hooks";

export const useEquiposBajaFiltrados = (
  filtros: Filtros,
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean
  ,
  sortBy?: string,
  sortDir?: "asc" | "desc"
) => {
  const [equiposBaja, setEquiposBaja] = useState<EquipoBaja[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchEquiposBaja = async () => {
      if (!shouldFetch) return;
      setLoading(true);
      setError(null);

      try {
        const noLimit = rowsPerPage === 0;
        const params: Record<string, unknown> = {
          ...filtros,
          limit: noLimit ? "all" : rowsPerPage,
          ...(noLimit ? {} : { offset: (currentPage - 1) * rowsPerPage }),
          sortBy: sortBy || undefined,
          sortDir: sortDir || undefined,
        };

        const { data } = await clienteAxios.get("/equipos/baja/", { params });

        setEquiposBaja(data.equipos ?? data.items ?? []);
        setTotalCount(data.total ?? data.count ?? 0);
      } catch (err) {
        setError("Error al cargar los equipos: " + String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchEquiposBaja();
  }, [filtros, currentPage, rowsPerPage, shouldFetch, sortBy, sortDir]);

  return { equiposBaja, loading, error, totalCount };
};
