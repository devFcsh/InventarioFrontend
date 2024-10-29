import { useState } from "react";
import { ActivoComputadoraData } from '../../../../../types/Activo';
import clienteAxios from "../../../../../hooks";

export const useAgregarComputadoraActivo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarComputadoraActivo = async (equipoData: ActivoComputadoraData): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/equipos/agregarActivoComputadora", equipoData);
      setMessage(data.message);
      return data.equipoId; 
    } catch (err) {
      setError("Error al agregar el equipo "+err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { agregarComputadoraActivo, loading, error, message };
};
