import { useState, useEffect } from "react";
import { Equipo, Filtros } from "../../../../types";
import clienteAxios from "../../../../hooks";

export const useEquiposFiltrados = (
  filtros: Filtros,
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean
) => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!shouldFetch) return; 
      setLoading(true);
      setError(null);

      try {
        const { data } = await clienteAxios.get('/equipos/', {
          params: {
            ...filtros,
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
        setEquipos(data);
      } catch (err) {
        setError("Error al cargar los equipos "+err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [filtros, currentPage, rowsPerPage, shouldFetch]);

  return { equipos, loading, error };
};
