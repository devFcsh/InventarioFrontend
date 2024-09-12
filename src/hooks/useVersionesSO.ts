import { useState, useEffect } from 'react';
import { VersionSO } from '../types';

const useVersionesSO = (id_sistemaoperativo: string) => {
    const [versionesSO, setVersionesSO] = useState<VersionSO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);  

    useEffect(() => {
      if (!id_sistemaoperativo) return; 

      const fetchVersionesSO = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/versionesSO/${id_sistemaoperativo}`);
          const data = await response.json();
          setVersionesSO(data);
        } catch (err: any) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchVersionesSO();
    }, [id_sistemaoperativo]); 

    return { versionesSO, loading, error };
};

export default useVersionesSO;
