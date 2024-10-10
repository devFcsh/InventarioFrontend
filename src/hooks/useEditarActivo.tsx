import { useState } from "react";
import axios from "axios";

const useEditarActivo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const editarActivo = async (equipoId: number, payload: any) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/equipos/editarEquipo/${equipoId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarActivo, loading, error };
};

export default useEditarActivo;
