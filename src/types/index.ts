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

export type SistemaOperativo = {
  id_sistemaoperativo: string;
  nombre: string;
};

export type VersionSO = {
  id_versionso: string;
  nombre: string;
};

export type VersionOffice = {
  id_versionoffice: string;
  nombre: string;
};

export type RAM = {
  id_ram: string;
  tipo: string;
  capacidad: string;
};

export type Disco = {
  id_disco: string;
  capacidad: string;
};

export type Antivirus = {
  id_antivirus: string;
  estado: 'Activado' | 'Desactivado';
};

export type Dominio = {
  id_dominio: string;
  nombre: string;
};

export type Clasificacion = {
  id_clasificacion: string;
};

export type EquipoActivo = {
  id_activo: string;
  edificio: string;
  aula: string;
  id_usuario: string;
};

export type EquipoBodega = {
  id_eqbodega: string;
};

export type EquipoBaja = {
  id_eqbaja: string;
};

export type Imagen = {
  id_imagen: string;
  ruta: string;
};

export type EquipoImagen = {
  id_equipo: string;
  id_imagen: string;
};
