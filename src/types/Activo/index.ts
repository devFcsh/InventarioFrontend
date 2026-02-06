export type ActivoComputadoraEdit = {
    id_equipo: string;
    id_periferico: string;
    inventario: string;
    anio_compra: string;
    id_usuario: string;
    id_uso: string;
    imagenRuta: string;
    id_marca: string;
    id_modelo: string;
    id_sistemaoperativo: string;
    id_versionso: string;
    id_ram: string;
    id_disco: string;
    id_procesador: string;
    id_dominio: string;
    id_edificio: string;
    id_ubicacion: string;
    id_versionoffice: string;
    id_antivirus: number;
    nombre_equipo: string;
    direccion_ip: string;
    id_serie: string;
    observacion: string;
    empresa: string;
  };

  export type ActivoComputadoraEditSend = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    id_usuario: string;
    imagenRuta: string | null;
    id_versionso: string;
    id_ram: string;
    id_disco: string;
    id_procesador: string;
    id_dominio: string;
    id_ubicacion: string;
    id_versionoffice: string;
    id_antivirus: string;
    nombre_equipo: string;
    direccion_ip: string;
    perifericoId: string;
    modeloId: string;
    serie: string;
    observacion: string;
    empresa: string;
    editor?: string;
  };

  export type ActivoSimpleEdit = {
    id_equipo: string;
    id_periferico: string;
    inventario: string;
    anio_compra: string;
    id_usuario: string;
    id_uso: string;
    imagenRuta: string;
    id_marca: string;
    id_modelo: string;
    id_edificio: string;
    id_ubicacion: string;
    id_serie: string;
    observacion: string;
    id_lampara: string;
    empresa: string;
    isComponente?: boolean;
    id_computadora?: string | number;
    id_serie_computadora?: string | number;
    id_periferico_computadora?: string | number;
  };

export type ActivoRedEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  anio_compra: string;
  id_usuario: string;
  id_uso: string;
  imagenRuta: string;
  id_marca: string;
  id_modelo: string;
  id_edificio: string;
  id_ubicacion: string;
  id_serie: string;
  observacion: string;
  mac: string;
  puertos: string;
  puerto_ftp: string;
  nombre_equipo: string;
  empresa: string;
};

  export type ActivoSimpleEditSend = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    id_usuario: string;
    imagenRuta: string | null;
    id_ubicacion: string;
    serie: string;
    perifericoId: string;
    modeloId: string;
    id_lampara: string;
    id_computadora?: string;
    observacion: string;
    empresa: string;
    editor?: string;
  };

  export type ActivoRedEditSend = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    id_usuario: string;
    imagenRuta: string | null;
    id_ubicacion: string;
    perifericoId: string;
    modeloId: string;
    serie: string;
    observacion: string;
    mac: string;
    puertos: string;
    puerto_ftp: string;
    nombre_equipo: string;
    empresa: string;
    editor?: string;
  };

export type ActivoComputadoraData = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    perifericoId: number;
    serie: string;
    modeloId: number;     
    nombreEquipo?: string; 
    direccionIp?: string; 
    versionso?: number;    
    versionoffice?: number; 
    ram?: number;          
    disco?: number;
    procesador?: number;     
    antivirus?: number;   
    dominio?: number;      
    idUbicacion: number;
    idUsuario: number;
    imagenRuta: string;
    observacion: string;
    empresa: string;
    autor?: string;
  };
  
  export type ActivoSimpleData = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    perifericoId: number;
    serie: string;
    modeloId: number;     
    idLampara: number;
    idUbicacion: number;
    idUsuario: number;
    imagenRuta: string;
    observacion: string;
    empresa: string;
    autor?: string;
  };

  export type ActivoRedData = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    perifericoId: number;
    serie: string;
    modeloId: number;          
    idUbicacion: number;
    idUsuario: number;
    imagenRuta: string;
    observacion: string;
    mac: string;
    puertos: string;
    puerto_ftp: string;
    nombreEquipo: string;
    empresa: string;
    autor?: string;
  };

export type ActivoComputadoraImport = {
  tipo: string;
  inventario: string;
  anio_compra: number | string;
  serie: string;
  modelo: string;
  usuario: string;
  ubicacion: string;
  nombreEquipo: string;
  direccionIp?: string;
  versionso?: string;
  versionoffice?: string;
  ram?: string;
  disco?: string;
  procesador?: string;
  antivirus?: string;
  dominio?: string;
  imagenRuta?: string;
  observacion?: string;
  componentes?: Array<{
    inventario: string;
    serie: string;
    tipo?: string;
    anio_compra?: number | string;
    modelo?: string;
    imagenRuta?: string;
    observacion?: string;
    idLampara?: number;
  }>;
};

export type ActividadRealizada = {
  id_actividad: number;
  nombre: string;
  realizada: boolean;
};

export type Mantenimiento = {
  id_mantenimiento: number;
  id_equipo: string;
  fecha: string;
  tipo: "preventivo" | "correctivo";
  actividades: ActividadRealizada[];
  hallazgos: string;
  recomendaciones: string;
};