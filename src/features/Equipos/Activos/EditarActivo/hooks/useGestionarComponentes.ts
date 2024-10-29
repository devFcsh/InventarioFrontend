import { useState } from "react";
import { ComponenteData } from "../../../../../types/Activo/Componente";
import clienteAxios from "../../../../../hooks";

export const useGestionarComponentes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const gestionarComponentes = async (componenteData: ComponenteData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/equipos/gestionarComponentes", componenteData);
      setMessage(data.message);
    } catch (err) {
      setError("Error al agregar los componentes");
    } finally {
      setLoading(false);
    }
  };

  return { gestionarComponentes, loading, error, message };
};
