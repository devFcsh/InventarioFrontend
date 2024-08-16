interface Item {
    id: string;
    name: string;
  }
  
  interface Equipo {
    id: string;
    periferico: string;
    marca: string;
    modelo: string;
    serie: string;
    inventario: string;
    usuario: string;
    uso: string;
    ubicacion: string;
  }

export type {
    Item,
    Equipo
}