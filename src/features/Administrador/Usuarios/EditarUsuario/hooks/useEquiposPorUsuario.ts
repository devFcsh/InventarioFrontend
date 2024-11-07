import clienteAxios from '@hooks/index';
import { useState, useEffect } from 'react';
import { EquipoUsuario } from '../../../../../types/Usuario';

const useEquiposPorUsuario = (id_usuario: string) => {
    const [equipos, setEquipos] = useState<EquipoUsuario[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id_usuario) return;

        const fetchEquipos = async () => {
            setLoading(true); 
            try {
                const response = await clienteAxios.get(`/equipos/porUsuario/${id_usuario}`);
                setEquipos(response.data.equipos);
            } catch (err) {
                setError("Error al obtener los equipos del usuario"); 
            } finally {
                setLoading(false); 
            }
        };

        fetchEquipos();
    }, [id_usuario]); 

    return { equipos, loading, error };
};

export default useEquiposPorUsuario;
