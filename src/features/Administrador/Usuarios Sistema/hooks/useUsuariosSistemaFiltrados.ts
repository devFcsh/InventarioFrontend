import { useState, useEffect } from "react";
import clienteAxios from "@hooks/index";
import { UsuarioSistema } from "../../../../types/UsuarioSistema";

export const useUsuariosSistemaFiltrados = (
  filtros: { rolId?: number; usuarioId?: number },
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean
) => {
  const [usuariosFiltrados, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!shouldFetch) return;
      setLoading(true);
      setError(null);

      try {
        const { data } = await clienteAxios.get("/usuariosSistema/", {
          params: {
            ...filtros,
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
        setUsuarios(data.usuarios);
        setTotalCount(data.total);
      } catch (err) {
        setError("Error al cargar los usuarios de sistema: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [filtros, currentPage, rowsPerPage, shouldFetch]);

  return { usuariosFiltrados, loading, error, totalCount };
};