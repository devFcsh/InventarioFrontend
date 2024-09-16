import { useState } from "react";
import axios from "axios";

type EquipoData = {
  tipo: string; // 'activo', 'bodega', 'baja'
  inventario: string;
  serie: number;
  nombreEquipo?: string; // Opcional para cuando no sea computadora o laptop
  direccionIp?: string;  // Opcional para cuando no sea computadora o laptop
  versionso?: number;    // Opcional para cuando no sea computadora o laptop
  versionoffice?: number; // Opcional para cuando no sea computadora o laptop
  ram?: number;          // Opcional para cuando no sea computadora o laptop
  disco?: number;        // Opcional para cuando no sea computadora o laptop
  antivirus?: number;    // Opcional para cuando no sea computadora o laptop
  dominio?: number;      // Opcional para cuando no sea computadora o laptop
  idAula: number;
  idUsuario: number;
  imagenRuta: string;
};

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
      return data.equipoId; // Retornar el id del equipo
    } catch (err) {
      setError("Error al agregar el equipo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { agregarComputadoraActivo, loading, error, message };
};
