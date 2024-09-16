import { useState } from "react";
import axios from "axios";

type ComponenteData = {
  equipoId: number;
  componentes: {
    inventario: string;
    serieId: number;
  }[];
  aulaId: number;
  usuarioId: number;
  imagenRuta: string;
};

export const useAgregarComponentes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarComponentes = async (componenteData: ComponenteData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:5000/api/equipos/agregarComponentes", componenteData);
      setMessage(data.message);
    } catch (err) {
      setError("Error al agregar los componentes");
    } finally {
      setLoading(false);
    }
  };

  return { agregarComponentes, loading, error, message };
};
