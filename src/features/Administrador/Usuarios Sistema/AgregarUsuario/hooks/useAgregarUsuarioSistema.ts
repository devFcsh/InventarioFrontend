import { useState } from "react";
import clienteAxios from "@hooks/index";

export const useAgregarUsuarioSistema = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const agregarUsuarioSistema = async (usuarioData: { correo: string, rolId: number }): Promise<number | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await clienteAxios.post("/usuariosSistema/agregar", usuarioData);
      setMessage(data.mensaje);
      return data.id_usuario_sistema;
    } catch (err) {
      setError("Error al agregar el usuario de sistema: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { agregarUsuarioSistema, loading, error, message };
};