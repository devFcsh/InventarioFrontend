import { Marca, Modelo, Periferico, Serie } from "../../index";

export type ComponenteBodega = {
    id_componente?: string
    periferico: Periferico;
    marca: Marca;
    modelo: Modelo;
    serie: Serie;
    inventario: string;
  };

export type ComponenteDataBodega = {
    tipo: string;
    equipoId: number;
    componentes: {
      inventario: string;
      serieId: number;
    }[];
};