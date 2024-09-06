import { useState, useEffect } from "react";
import axios from "axios";

type Filtros = {
  perifericoId?: string;
  marcaId?: string;
  modeloId?: string;
  serieId?: string;
  inventario?: string;
};

export const useTotalEquipos = (
  filtros: Filtros,
  shouldFetch: boolean
) => {
  const [totalEquipos, setTotalEquipos] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!shouldFetch) return; 
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get("http://localhost:5000/api/equipos/totalEquipos", {
          params: {
            ...filtros,
          },
        });
        setTotalEquipos(data[0].total);
      } catch (err) {
        setError("Error al cargar los equipos");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [filtros, shouldFetch]);

  return { totalEquipos };
};
