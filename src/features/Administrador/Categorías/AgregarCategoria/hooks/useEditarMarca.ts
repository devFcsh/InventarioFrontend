import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useEditarMarca = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const editarMarca = async (marcaData: { 
    id_marca: number, 
    nuevoNombre?: string,
    perifericosIds?: number[]
  }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.put("/marcas/", marcaData);
      setMessage(data.message);  
      return data.id_marca; 
    } catch (err) {
      setError("Error al editar la marca: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { editarMarca, loading, error, message };
};