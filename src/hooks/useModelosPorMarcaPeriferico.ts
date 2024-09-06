import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modelo } from '../types';

export const useModelosPorMarcaPeriferico = (marcaId: string, perifericoId: string) => {
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (marcaId && perifericoId) {
            const fetchModelos = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/modelos/modelosPorMarcaPeriferico', {
                        params: {
                            marcaId,
                            perifericoId
                        }
                    });
                    console.log(response.data)
                    setModelos(response.data);
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchModelos();
        }
    }, [marcaId, perifericoId]);

    return { modelos, loading, error };
};
