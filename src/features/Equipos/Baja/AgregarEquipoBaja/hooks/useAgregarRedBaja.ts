import { useState } from "react";
import { BajaRedData } from '../../../../../types/Baja';
import clienteAxios from "../../../../../hooks";

export const useAgregarRedBaja = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarRedBaja = async (equipoData: BajaRedData): Promise<number | undefined> => {
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

  return { agregarRedBaja, loading, error, message };
};
