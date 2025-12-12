import { useState, useEffect } from "react";
import clienteAxios from "@hooks/index";

interface ModeloDetalle {
  id_modelo: number;
  nombre: string;
  marcas: number[];
}

export const useObtenerModeloDetalle = (id_modelo: number | null) => {
  const [modeloDetalle, setModeloDetalle] = useState<ModeloDetalle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModeloDetalle = async (idModelo: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.get(`/modelos/${idModelo}/detalle`);
      setModeloDetalle(data);
    } catch (err) {
      setError("Error al obtener detalle de modelo: " + err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_modelo) {
      fetchModeloDetalle(id_modelo);
    }
  }, [id_modelo]);

  const refetch = () => {
    if (id_modelo) {
      fetchModeloDetalle(id_modelo);
    }
  };

  return { modeloDetalle, loading, error, refetch };
};