import { useState, useEffect } from "react";
import { Filtros } from "../../../../types";
import { EquipoBodega } from "../../../../types/Equipo";

import clienteAxios from "../../../../hooks";

export const useEquiposBodegaRedFiltrados = (
  filtros: Filtros,
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean
) => {
  const [equiposBodega, setEquiposBodega] = useState<EquipoBodega[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchEquiposBodega = async () => {
      if (!shouldFetch) return; 
      setLoading(true);
      setError(null);

      try {
        const { data } = await clienteAxios.get('/equipos/redbodega/', {
          params: {
            ...filtros,
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
        setEquiposBodega(data.equipos);
        setTotalCount(data.total); 
      } catch (err) {
        setError("Error al cargar los equipos "+err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquiposBodega();
  }, [filtros, currentPage, rowsPerPage, shouldFetch]);

  return { equiposBodega, loading, error, totalCount };

};
