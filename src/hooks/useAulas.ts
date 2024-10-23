import { useState, useEffect } from 'react';
import { Aula } from '../types';
import clienteAxios from '.';

const useVersionesSO = (id_edificio: string) => {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
      if (!id_edificio) return; 

      const fetchAulas = async () => {
        setLoading(true);
        try {
          const response = await clienteAxios.get(`/aulas/${id_edificio}`);
          setAulas(response.data);
        } catch (err) {
          setError("Error al obtener aulas" + err);
        } finally {
          setLoading(false);
        }
      };

      fetchAulas();
    }, [id_edificio]); 

    return { aulas, loading, error };
};

export default useVersionesSO;
