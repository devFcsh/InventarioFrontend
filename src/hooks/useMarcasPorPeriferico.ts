import { useState, useEffect } from 'react';

const useMarcasPorPeriferico = (selectedPeriferico: number) => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedPeriferico) {
      setMarcas([]);
      return;
    }

    const fetchMarcas = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/marcas/marcasPorPeriferico/${selectedPeriferico}`);
        const data = await response.json();
        console.log(data)
        console.log("AQUIII")
        setMarcas(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, [selectedPeriferico]);

  return { marcas };
};

export default useMarcasPorPeriferico;
