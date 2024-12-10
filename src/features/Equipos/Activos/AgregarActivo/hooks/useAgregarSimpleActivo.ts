import { useState } from "react";
import { ActivoSimpleData } from '../../../../../types/Activo';
import clienteAxios from "../../../../../hooks";

export const useAgregarSimpleActivo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarSimpleActivo = async (equipoData: ActivoSimpleData): Promise<number | undefined> => {
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

  return { agregarSimpleActivo, loading, error, message };
};
