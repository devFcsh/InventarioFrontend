import clienteAxios from '../../../../hooks';

export const useDarDeBajaEquipo = () => {
    const darDeBajaEquipo = async (equipoId: string) => {
        try {
            const response = await clienteAxios.put(`/equipos/darDeBajaEquipo/${equipoId}`);
            return response.data;
        } catch (error) {
            console.error('Error al dar de baja el equipo', error);
            throw error;
        }
    };

    return { darDeBajaEquipo };
};
