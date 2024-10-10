import axios from 'axios';

export const useDarDeBajaEquipo = () => {
    const darDeBajaEquipo = async (equipoId: string) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/equipos/darDeBajaEquipo/${equipoId}`);
            return response.data;
        } catch (error) {
            console.error('Error al dar de baja el equipo', error);
            throw error;
        }
    };

    return { darDeBajaEquipo };
};
