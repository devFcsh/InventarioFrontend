import { useState, useEffect } from 'react';
import { VersionOffice } from '../types';

const useVersionesOffice = () => {
    const [versionesOffice, setVersionesOffice] = useState<VersionOffice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);  

  useEffect(() => {
    const fetchVersionesOffice = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/versionesOffice/');
        const data = await response.json();
        setVersionesOffice(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVersionesOffice();
  }, []);

  return { versionesOffice, loading, error };
};

export default useVersionesOffice;
