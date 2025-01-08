import { useState, useEffect } from 'react';
import { Ubicacion } from '../types';
import clienteAxios from '.';

const useUbicaciones = (id_edificio: string) => {
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
      if (!id_edificio) return; 

      const fetchUbicaciones = async () => {
        setLoading(true);
        try {
          const response = await clienteAxios.get(`/ubicaciones/${id_edificio}`);
          setUbicaciones(response.data);
        } catch (err) {
          setError("Error al obtener aulas" + err);
        } finally {
          setLoading(false);
        }
      };

      fetchUbicaciones();
    }, [id_edificio]); 

    return { ubicaciones, loading, error };
};

export default useUbicaciones;
