import { useState } from "react";
import { BajaComputadoraData } from '../../../../../types/Baja';
import clienteAxios from "../../../../../hooks";

export const useAgregarComputadoraBaja = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarComputadoraBodega = async (equipoData: BajaComputadoraData): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/equipos/agregarEquipoComputadora", equipoData);
      setMessage(data.message);
      return data.equipoId; 
    } catch (err) {
      setError("Error al agregar el equipo "+err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { agregarComputadoraBodega, loading, error, message };
};
