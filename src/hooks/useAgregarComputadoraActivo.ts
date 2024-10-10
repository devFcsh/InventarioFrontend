import { useState } from "react";
import axios from "axios";
import { EquipoData } from '../types';

export const useAgregarComputadoraActivo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarComputadoraActivo = async (equipoData: EquipoData): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:5000/api/equipos/agregarActivoComputadora", equipoData);
      setMessage(data.message);
      return data.equipoId; 
    } catch (err) {
      setError("Error al agregar el equipo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { agregarComputadoraActivo, loading, error, message };
};
