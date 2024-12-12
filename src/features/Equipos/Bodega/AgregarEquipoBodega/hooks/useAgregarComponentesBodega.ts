import { useState } from "react";
import { ComponenteDataBodega } from '../../../../../types/Bodega/Componente/index';
import clienteAxios from "@hooks/index";


export const useAgregarComponentesBodega = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarComponentesBodega = async (componenteDataBodega: ComponenteDataBodega) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/equipos/agregarComponentes", componenteDataBodega); 
      setMessage(data.message);
    } catch (err) {
      setError("Error al agregar los componentes "+err);
    } finally {
      setLoading(false);
    }
  };

  return { agregarComponentesBodega, loading, error, message };
};
