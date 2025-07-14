import clienteAxios from '../../../../hooks';

export const useSacarEquipoDeBaja = () => {
    const useSacarEquipoDeBaja = async (equipoId: string, tipo: string) => {
        try {
            const response = await clienteAxios.put(`/equipos/sacarEquipoBaja/${equipoId}`, {tipo});
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al sacar de baja el equipo', error);
        }
    };

    return { useSacarEquipoDeBaja };
};
