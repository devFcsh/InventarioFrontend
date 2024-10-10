import { useState } from "react";
import axios from "axios";
import { ComponenteData } from "../types";



export const useGestionarComponentes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const gestionarComponentes = async (componenteData: ComponenteData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post("http://localhost:5000/api/equipos/gestionarComponentes", componenteData);
      setMessage(data.message);
    } catch (err) {
      setError("Error al agregar los componentes");
    } finally {
      setLoading(false);
    }
  };

  return { gestionarComponentes, loading, error, message };
};
