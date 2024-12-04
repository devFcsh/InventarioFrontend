import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarAula = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarAula = async (aulaData: { nombre: string, edificioId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/aulas", aulaData);
      
      setMessage(data.mensaje);  
      return data.id_aula; 
    } catch (err) {
      setError("Error al agregar el aula: " + err); 
      throw err;
    } finally {
      setLoading(false);  
    }
  };

  return { agregarAula, loading, error, message };
};
