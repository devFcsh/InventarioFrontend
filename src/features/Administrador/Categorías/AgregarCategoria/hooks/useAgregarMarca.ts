import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarMarca = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarMarca = async (marcaData: { nombre: string, perifericoId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/marcas", marcaData);
      
      setMessage(data.mensaje);  
      return data.id_marca; 
    } catch (err) {
      setError("Error al agregar la marca: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarMarca, loading, error, message };
};
