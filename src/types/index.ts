export type Periferico = {
  id_periferico: string;
  nombre: string;
};

export type Marca = {
  id_marca: string;
  nombre: string;
};

export type Modelo = {
  id_modelo: string;  
  nombre: string;     
};

export type Serie = {
  id_serie: string;
  nombre: string;
};

export type Inventario = {
  inventario: string;
};


export type Equipo = {
  id_equipo: string;
  periferico: string;
  marca: string;
  modelo: string;
  serie: string;
  inventario: string;
  usuario: string;
  uso: string;
  edificio: string;
};