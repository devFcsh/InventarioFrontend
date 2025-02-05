import { useState } from "react";
import { BodegarRedData } from '../../../../../types/Bodega';
import clienteAxios from "../../../../../hooks";

export const useAgregarRedBodega = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarRedBodega = async (equipoData: BodegarRedData): Promise<number | undefined> => {
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

  return { agregarRedBodega, loading, error, message };
};
