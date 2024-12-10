import { useState } from "react";
import { BodegaSimpleData } from '../../../../../types/Bodega';
import clienteAxios from "../../../../../hooks";

export const useAgregarSimpleBodega = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarSimpleBodega = async (equipoData: BodegaSimpleData): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/equipos/agregarEquipoSimple", equipoData);
      setMessage(data.message);
      return data.equipoId; 
    } catch (err) {
      setError("Error al agregar el equipo "+err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { agregarSimpleBodega, loading, error, message };
};
