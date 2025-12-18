import { Marca, Modelo, Periferico } from "../../index";

export type ComponenteBodega = {
    id_componente?: string
    periferico: Periferico;
    marca: Marca;
    modelo: Modelo;
    serie: string;
    inventario: string;
  };

export type ComponenteDataBodega = {
    tipo: string;
    equipoId: number;
    componentes: {
      inventario: string;
      perifericoId: number;
      serie: string;
      modeloId: number;
    }[];
    editor?: string;
    autor?: string;
};