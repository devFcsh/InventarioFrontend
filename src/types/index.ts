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

export type Uso = {
  id_uso: string;
  nombre: string;
} | null;

export type Usuario = {
  id_usuario: string;
  nombre: string;
} | null;

export type SistemaOperativo = {
  id_sistemaoperativo: string;
  nombre: string;
}| null;

export type VersionSO = {
  id_versionso: string;
  nombre: string;
}| null;

export type VersionOffice = {
  id_versionoffice: string;
  nombre: string;
}| null;

export type RAM = {
  id_ram: string;
  tipo: string;
  capacidad: string;
}| null;

export type Disco = {
  id_disco: string;
  capacidad: string;
}| null;

export type Antivirus = {
  id_antivirus: string;
  nombre: string;
}| null;

export type Dominio = {
  id_dominio: string;
  nombre: string;
}| null;

export type Clasificacion = {
  id_clasificacion: string;
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
}| null;

export type Ubicacion = {
  id_ubicacion: string;
  nombre: string;
}| null;

export type Filtros = {
  perifericoId?: string;
  marcaId?: string;
  modeloId?: string;
  serieId?: string;
  inventario?: string;
};

export type FiltrosUsuario = {
  usoId?: string | null;
  usuarioId?: string | null;
};

