import { useState } from "react";
import { ComponenteData } from "../types/Activo/Componente";
import clienteAxios from ".";
export const useAgregarComponentes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarComponentes = async (componenteData: ComponenteData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post(
        "/equipos/agregarComponentes",
        componenteData
      );
      setMessage(data.message);
    } catch (err) {
      setError("Error al sagregar los componentes " + err);
    } finally {
      setLoading(false);
    }
  };

  return { agregarComponentes, loading, error, message };
};
