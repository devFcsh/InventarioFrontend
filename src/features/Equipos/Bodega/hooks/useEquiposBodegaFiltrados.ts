import { useState, useEffect } from "react";
import { Filtros } from "../../../../types";
import { Equipo } from "../../../../types/Equipo";

import clienteAxios from "../../../../hooks";

export const useEquiposBodegaFiltrados = (
  filtros: Filtros,
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean
) => {
  const [equiposBodega, setEquiposBodega] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquiposBodega = async () => {
      if (!shouldFetch) return; 
      setLoading(true);
      setError(null);

      try {
        const { data } = await clienteAxios.get('/equipos/bodega/', {
          params: {
            ...filtros,
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
        setEquiposBodega(data);
      } catch (err) {
        setError("Error al cargar los equipos "+err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquiposBodega();
  }, [filtros, currentPage, rowsPerPage, shouldFetch]);

  return { equiposBodega, loading, error };

};
