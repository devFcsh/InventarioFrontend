import { useState, useEffect } from 'react';
import { VersionSO } from '../types';
import clienteAxios from '.';

const useVersionesSO = (id_sistemaoperativo: string) => {
    const [versionesSO, setVersionesSO] = useState<VersionSO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
      if (!id_sistemaoperativo) return; 

      const fetchVersionesSO = async () => {
        setLoading(true);
        try {
          const response = await clienteAxios.get(`/versionesSO/${id_sistemaoperativo}`);

          setVersionesSO(response.data);
        } catch (err) {
          setError("Error al obtener versiones de SO" + err);
        } finally {
          setLoading(false);
        }
      };

      fetchVersionesSO();
    }, [id_sistemaoperativo]); 

    return { versionesSO, loading, error };
};

export default useVersionesSO;
