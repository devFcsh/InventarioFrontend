import clienteAxios from '../../../../hooks';

export const usePasarActivoABodega = () => {
    const pasarActivoABodega = async (equipoId: string) => {
        try {
            const response = await clienteAxios.put(`/equipos/activoabodega/${equipoId}`);
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al transferir el equipo a bodega', error);
        }
    };

    return { pasarActivoABodega };
};
