export type UsuarioSistema = {
  id_usuario_sistema: number;
  correo: string;
  rol: Rol;
};

export type Rol = {
    id_rol: number;
    nombre: 'administrador' | 'consultor' | 'editor';
};