import { useState, useEffect } from "react";
import clienteAxios from "@hooks/index";

interface MarcaDetalle {
  id_marca: number;
  nombre: string;
  perifericos: number[];
}

export const useObtenerMarcaDetalle = (id_marca: number | null) => {
  const [marcaDetalle, setMarcaDetalle] = useState<MarcaDetalle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarcaDetalle = async (idMarca: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.get(`/marcas/${idMarca}/detalle`);
      setMarcaDetalle(data);
    } catch (err) {
      setError("Error al obtener detalle de marca: " + err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_marca) {
      fetchMarcaDetalle(id_marca);
    }
  }, [id_marca]);

  const refetch = () => {
    if (id_marca) {
      fetchMarcaDetalle(id_marca);
    }
  };

  return { marcaDetalle, loading, error, refetch };
};