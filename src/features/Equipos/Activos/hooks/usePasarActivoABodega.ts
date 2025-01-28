import clienteAxios from '../../../../hooks';

export const usePasarActivoABodega = () => {
    const pasarActivoABodega = async (equipoId: string) => {
        try {
            const response = await clienteAxios.put(`/equipos/activoabodega/${equipoId}`);
            return response.data;
        } catch (error) {
            console.error('Error al transferir el equipo a bodega', error);
            throw error;
        }
    };

    return { pasarActivoABodega };
};
