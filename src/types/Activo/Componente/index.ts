import { Marca, Modelo, Serie, Periferico } from "../../";

export type Componente = {
    id_componente?: string
    periferico: Periferico;
    marca: Marca;
    modelo: Modelo;
    serie: Serie;
    inventario: string;
  };

export type ComponenteData = {
    equipoId: number;
    componentes: {
      inventario: string;
      serieId: number;
    }[];
    aulaId: number;
    usuarioId: number;
    imagenRuta: string;
  };