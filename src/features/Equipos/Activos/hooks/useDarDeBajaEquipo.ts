import clienteAxios from '../../../../hooks';

export const useDarDeBajaEquipo = () => {
    const darDeBajaEquipo = async (equipoId: string, tipo: string) => {
        try {
            const response = await clienteAxios.put(`/equipos/darDeBajaEquipo/${equipoId}`, {tipo});
            return response.data;
        } catch (error) {
            console.error('Error al dar de baja el equipo', error);
            throw error;
        }
    };

    return { darDeBajaEquipo };
};
