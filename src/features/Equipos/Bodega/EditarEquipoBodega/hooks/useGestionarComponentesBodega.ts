import { useState } from "react";
import { ComponenteDataBodega } from "../../../../../types/Bodega/Componente";
import clienteAxios from "../../../../../hooks";

export const useGestionarComponentesBodega = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const gestionarComponentesBodega = async (componenteDataBodega: ComponenteDataBodega) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/equipos/gestionarComponentes", componenteDataBodega);
      setMessage(data.message);
    } catch (err) {
      setError("Error al agregar los componentes");
    } finally {
      setLoading(false);
    }
  };

  return { gestionarComponentesBodega, loading, error, message };
};
