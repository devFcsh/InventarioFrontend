import { useState, useEffect } from "react";
import clienteAxios from "../../../../../hooks";

export const useMantenimientoDetalle = (id_mantenimiento: number | null | undefined) => {
  const [detalle, setDetalle] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(!!id_mantenimiento);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id_mantenimiento) {
      setDetalle(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await clienteAxios.get(`/mantenimientos/detalle/${id_mantenimiento}`);
        setDetalle(res.data || null);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || String(err));
        setDetalle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [id_mantenimiento]);

  return { detalle, loading, error };
};

export default useMantenimientoDetalle;
