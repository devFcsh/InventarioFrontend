import { useState, useEffect } from 'react';
import { Aula } from '../types';

const useVersionesSO = (id_edificio: string) => {
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);  

    useEffect(() => {
      if (!id_edificio) return; 

      const fetchAulas = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/aulas/${id_edificio}`);
          const data = await response.json();
          setAulas(data);
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchAulas();
    }, [id_edificio]); 

    return { aulas, loading, error };
};

export default useVersionesSO;
