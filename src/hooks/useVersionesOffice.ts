import { useState, useEffect } from 'react';
import { VersionOffice } from '../types';
import clienteAxios from '.';

const useVersionesOffice = () => {
  const [versionesOffice, setVersionesOffice] = useState<VersionOffice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  useEffect(() => {
    const fetchVersionesOffice = async () => {
      setLoading(true);
      try {
        const response = await clienteAxios.get('/versionesOffice/');
        setVersionesOffice(response.data);
      } catch (err) {
        setError("Error al obtener versiones de office " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchVersionesOffice();
  }, []);

  return { versionesOffice, loading, error };
};

export default useVersionesOffice;
