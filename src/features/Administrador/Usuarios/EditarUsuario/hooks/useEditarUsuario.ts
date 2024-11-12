import { useState } from 'react';
import clienteAxios from '@hooks/index';

const useEditarUsuario = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const editarUsuario = async (id_usuario: string, nuevoNombre: string, nuevoUsoId: string) => {
    setLoading(true);
    setError(null); 
    setSuccess(false); 

    try {
      const response = await clienteAxios.put(`/usuarios/${id_usuario}`, {
        nuevoNombre,
        nuevoUsoId,
      });

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError("Error al actualizar el usuario");
    } finally {
      setLoading(false); 
    }
  };

  return { editarUsuario, loading, error, success };
};

export default useEditarUsuario;
