import { useState } from 'react';
import clienteAxios from '@hooks/index';

const useCambiarUsuarioEquipo = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const cambiarUsuario = async (equipoId: string, usuarioId: string) => {
        setLoading(true);
        setError(null); 
        setSuccess(false); 

        try {
            const response = await clienteAxios.put(`/equipos/cambiarUsuario/${equipoId}`, {
                usuarioId,  
            });

            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (err) {
            setError("Error al cambiar el usuario del equipo");
        } finally {
            setLoading(false);
        }
    };

    return { cambiarUsuario, loading, error, success };
};

export default useCambiarUsuarioEquipo;
