import { useState } from "react";

import clienteAxios from ".";

export const useExisteInventario = () => {
  const [existe, setExiste] = useState(false);

  const [equipo, setEquipo] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const consultarInventario = async (inventario: string) => {
    setLoading(true);

    setError(null);

    try {
      const response = await clienteAxios.get("/inventarios/existeInventario", {
        params: { inventario },
      });

      setExiste(response.data.existe);

      setEquipo(response.data.equipo || null);
    } catch (err) {
      setError("Error al consultar inventario: " + err);

      setExiste(false);

      setEquipo(null);
    } finally {
      setLoading(false);
    }
  };

  return { existe, equipo, loading, error, consultarInventario };
};
