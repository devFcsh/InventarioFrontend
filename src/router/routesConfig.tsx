export type Role = 'administrador' | 'editor' | 'consultor';

interface RouteConfig {
  path: string;
  element: JSX.Element;
  allowedRoles: Role[];
}

import Activos from "../features/Equipos/Activos/Homepage/Activos";
import Bajas from "../features/Equipos/Baja/Homepage/Bajas";
import Bodega from "../features/Equipos/Bodega/Homepage/Bodega";
import Usuarios from "../features/Administrador/Usuarios/Homepage/Usuarios";
import Categorias from "../features/Administrador/Categorías/Homepage/Categorias";
import AgregarActivo from "@pages/AgregarActivo";
import { FormLC } from "@pages/Forms/FormLC";
import { FormSAP } from "@pages/Forms/FormSAP";
import { FormPMTM } from "@pages/Forms/FormPMTM";
import EditarActivo from "@pages/EditarActivo";
import { EditarBodega } from "@pages/EditarBodega";
import AgregarUsuario from "../features/Administrador/Usuarios/AgregarUsuario/Homepage/AgregarUsuario";
import EditarUsuario from "../features/Administrador/Usuarios/EditarUsuario/Homepage/EditarUsuario";
import UsuariosSistema from "../features/Administrador/Usuarios Sistema/Homepage/UsuariosSistema";
import EditarUsuarioSistema from "../features/Administrador/Usuarios Sistema/EditarUsuario/Homepage/EditarUsuario";
import AgregarUsuarioSistema from "../features/Administrador/Usuarios Sistema/AgregarUsuario/Homepage/AgregarUsuarioSistema";
import VisualizarActivo from "@pages/VisualizarActivo";

export const routesConfig: RouteConfig[] = [
  {
    path: "/activos",
    element: <Activos />,
    allowedRoles: ["administrador", "consultor", "editor"],
  },
  {
    path: "/bajas",
    element: <Bajas />,
    allowedRoles: ["administrador", "consultor", "editor"],
  },
  {
    path: "/usuarios",
    element: <Usuarios />,
    allowedRoles: ["administrador", "consultor", "editor"],
  },
  {
    path: "/bodega",
    element: <Bodega />,
    allowedRoles: ["administrador", "consultor", "editor"],
  },
  {
    path: "/categorias",
    element: <Categorias />,
    allowedRoles: ["administrador", "consultor", "editor"],
  },
  {
    path: "/agregarActivo",
    element: <AgregarActivo />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/formLC",
    element: <FormLC />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/formSAP",
    element: <FormSAP />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/FormPMTM",
    element: <FormPMTM />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/visualizarActivo",
    element: <VisualizarActivo />,
    allowedRoles: ["administrador", "editor", "consultor"],
  },
  {
    path: "/editarActivo",
    element: <EditarActivo />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/editarBodega",
    element: <EditarBodega />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/agregarUsuario",
    element: <AgregarUsuario />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/editarUsuario",
    element: <EditarUsuario />,
    allowedRoles: ["administrador", "editor"],
  },
  {
    path: "/usuariosSistema",
    element: <UsuariosSistema />,
    allowedRoles: ["administrador"],
  },
  {
    path: "/editarUsuarioSistema",
    element: <EditarUsuarioSistema />,
    allowedRoles: ["administrador"],
  },
   {
    path: "/agregarUsuarioSistema",
    element: <AgregarUsuarioSistema />,
    allowedRoles: ["administrador"],
  },
  
];
