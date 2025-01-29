import clienteAxios from '../../../../hooks';

export const usePasarBodegaAActivo = () => {
    const pasarBodegaAActivo = async (equipoId: string, id_usuario: string, id_ubicacion: string, imagenRuta: string) => {
        try {
            const response = await clienteAxios.put(
                `/equipos/bodegaaactivo/${equipoId}`, 
                { id_usuario, id_ubicacion, imagenRuta }
            );
            return response.data;
        } catch (error) {
            console.error('Error al transferir el equipo de bodega a activo', error);
            throw error;
        }
    };

    return { pasarBodegaAActivo };
};
