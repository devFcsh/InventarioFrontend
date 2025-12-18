import { Marca, Modelo, Periferico } from "../../";

export type Componente = {
    id_componente?: string
    periferico: Periferico;
    marca: Marca;
    modelo: Modelo;
    serie: string;
    inventario: string;
  };

export type ComponenteData = {
    tipo: string;
    equipoId: number;
    componentes: {
      inventario: string;
      serie: string;
      perifericoId: number;
      modeloId: number;
    }[];
    ubicacionId: number;
    usuarioId: number;
    imagenRuta: string;
    editor?: string;
    autor?: string;
  };