import clienteAxios from '../../../../hooks';

export const useDarDeBajaEquipo = () => {
    const darDeBajaEquipo = async (equipoId: string, tipo: string) => {
        try {
            const response = await clienteAxios.put(`/equipos/darDeBajaEquipo/${equipoId}`, {tipo});
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al dar de baja el equipo', error);
        }
    };

    return { darDeBajaEquipo };
};
