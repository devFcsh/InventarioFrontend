import { useState, useEffect } from "react";
import axios from "axios";
import { Equipo } from "../types";

type Filtros = {
  perifericoId?: string;
  marcaId?: string;
  modeloId?: string;
  serieId?: string;
  inventario?: string;
};

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
        console.log("fetching en equipos con filtros:"+filtros.perifericoId+" currentPage: "+currentPage+" rows: "+rowsPerPage+" shouldFetch: "+shouldFetch);
        const { data } = await axios.get("http://localhost:5000/api/equipos", {
          params: {
            ...filtros,
            limit: rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage,
          },
        });
        setEquipos(data);
      } catch (err) {
        setError("Error al cargar los equipos");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [filtros, currentPage, rowsPerPage, shouldFetch]);

  return { equipos, loading, error };
};
