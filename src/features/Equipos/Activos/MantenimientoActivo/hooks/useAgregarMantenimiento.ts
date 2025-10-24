import clienteAxios from "@hooks/index";
import { MantenimientoData } from "../../../../../types/Activo/Mantenimiento";
import { useState } from "react";

export const useAgregarMantenimiento = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarMantenimiento = async (mantenimientoData: MantenimientoData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await clienteAxios.post(
        "/mantenimientos/",
        mantenimientoData
      );
      setMessage("Mantenimiento registrado correctamente");
    } catch (err: any) {
      setError("Error al registrar el mantenimiento: " + (err?.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return { agregarMantenimiento, loading, error, message };
};