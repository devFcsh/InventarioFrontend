import { useState, useEffect } from 'react';
import { Modelo } from '../types';
import clienteAxios from '.';

export const useModelosPorMarcaPeriferico = (marcaId: string, perifericoId: string) => {
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);  

    useEffect(() => {
        if (marcaId && perifericoId) {
            const fetchModelos = async () => {
                try {
                    const response = await clienteAxios.get('/modelos/modelosPorMarcaPeriferico', {
                        params: {
                            marcaId,
                            perifericoId
                        }
                    });
                    setModelos(response.data);
                } catch (err) {
                    setError("Error al obtener modelos por marca periferico" + err);
                } finally {
                    setLoading(false);
                }
            };

            fetchModelos();
        }
    }, [marcaId, perifericoId]);

    return { modelos, loading, error };
};
