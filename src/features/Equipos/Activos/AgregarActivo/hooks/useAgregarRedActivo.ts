import { useState } from "react";
import { ActivoRedData } from '../../../../../types/Activo';
import clienteAxios from "../../../../../hooks";

export const useAgregarRedActivo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarRedActivo = async (equipoData: ActivoRedData): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/equipos/agregarEquipoRed", equipoData);
      setMessage(data.message);
      return data.equipoId; 
    } catch (err) {
      setError("Error al agregar el equipo "+err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { agregarRedActivo, loading, error, message };
};
