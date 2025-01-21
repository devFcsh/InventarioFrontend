import { useState, useEffect } from "react";
import { Filtros } from "../../../../types";
import { Equipo } from "../../../../types/Equipo";

import clienteAxios from "../../../../hooks";

export const useEquiposRedFiltrados = (
  filtros: Filtros,
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean
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
        const { data } = await clienteAxios.get('/equipos/red', {
          params: {
            ...filtros,
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
        setEquipos(data.equipos);
        setTotalCount(data.total); 
      } catch (err) {
        setError("Error al cargar los equipos: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [filtros, currentPage, rowsPerPage, shouldFetch]);

  return { equipos, loading, error, totalCount };
};
