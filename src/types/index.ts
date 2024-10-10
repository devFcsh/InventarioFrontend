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

export type EquipoEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  id_usuario: string;
  id_uso: string;
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
  id_componente?: string
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
  nombre: string;
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

export type Edificio = {
  id_edificio: string;
  nombre: string;
};

export type Aula = {
  id_aula: string;
  nombre: string;
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


export type EquipoData = {
  tipo: string;
  inventario: string;
  serie: number;
  nombreEquipo?: string; 
  direccionIp?: string; 
  versionso?: number;    
  versionoffice?: number; 
  ram?: number;          
  disco?: number;       
  antivirus?: number;   
  dominio?: number;      
  idAula: number;
  idUsuario: number;
  imagenRuta: string;
};

export type Filtros = {
  perifericoId?: string;
  marcaId?: string;
  modeloId?: string;
  serieId?: string;
  inventario?: string;
};

