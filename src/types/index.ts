export type Periferico = {
  id_periferico: string;
  nombre: string;
} | null;

export type Marca = {
  id_marca: string;
  nombre: string;
} | null;

export type Modelo = {
  id_modelo: string;
  nombre: string;
} | null;

export type Serie = {
  id_serie: string;
  nombre: string;
} | null;

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

export type Uso = {
  id_uso: string;
  nombre: string;
};

export type Usuario = {
  id_usuario: string;
  nombre: string;
};

export type Componente = {
  periferico: Periferico;
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  inventario: string;
};