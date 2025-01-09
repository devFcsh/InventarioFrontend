import { useState, useEffect } from 'react';
import { Ubicacion } from '../types';
import clienteAxios from '.';

const useUbicacionesCompletas = () => {
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
      const fetchUbicaciones = async () => {
        setLoading(true);
        try {
          const response = await clienteAxios.get('/ubicaciones/');
          setUbicaciones(response.data);
        } catch (err) {
          setError("Error al obtener ubicaciones" + err);
        } finally {
          setLoading(false);
        }
      };

      fetchUbicaciones();
    }, []); 

    return { ubicaciones, loading, error };
};

export default useUbicacionesCompletas;
