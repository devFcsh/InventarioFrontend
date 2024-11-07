import { useState, useEffect } from "react";
import { FiltrosUsuario } from "../../../../types";
import { Usuario } from "../../../../types/Usuario";
import clienteAxios from "@hooks/index";

export const useUsuariosFiltrados = (
  filtros: FiltrosUsuario,
  currentPage: number,
  rowsPerPage: number,
  shouldFetch: boolean
) => {
  const [usuariosFiltrados, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!shouldFetch) return; 
      setLoading(true);
      setError(null);

      try {
        const { data } = await clienteAxios.get('/usuarios/', {
          params: {
            ...filtros,
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
        setUsuarios(data.usuarios);
        setTotalCount(data.total); 
      } catch (err) {
        setError("Error al cargar los usuarios: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [filtros, currentPage, rowsPerPage, shouldFetch]);

  return { usuariosFiltrados, loading, error, totalCount };
};
