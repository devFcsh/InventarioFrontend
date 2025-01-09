import { useState, useEffect } from 'react';
import { VersionSO } from '../types';
import clienteAxios from '.';

const useVersionesCompletasSO = () => {
    const [versionesSO, setVersionesSO] = useState<VersionSO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
      const fetchVersionesSO = async () => {
        setLoading(true);
        try {
          const response = await clienteAxios.get('/versionesSO/');

          setVersionesSO(response.data);
        } catch (err) {
          setError("Error al obtener versiones de SO" + err);
        } finally {
          setLoading(false);
        }
      };

      fetchVersionesSO();
    }, []); 

    return { versionesSO, loading, error };
};

export default useVersionesCompletasSO;
