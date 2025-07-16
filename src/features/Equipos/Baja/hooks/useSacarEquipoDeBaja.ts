import clienteAxios from '../../../../hooks';

export const useSacarEquipoDeBaja = () => {
    const useSacarEquipoDeBaja = async (equipoId: string) => {
        try {
            const response = await clienteAxios.put(`/equipos/sacarEquipoBaja/${equipoId}`);
            if (response.status === 200) {
                return { success: true, message: 'Equipo sacado de baja correctamente.' };
            } else {
                return { success: false, message: 'Error desconocido al sacar de baja.' };
            }
        } catch (error: any) {
            const message = error.response?.data?.error || 'Error al sacar de baja el equipo.';
            return { success: false, message };
        }
    };

    return { useSacarEquipoDeBaja };
};
