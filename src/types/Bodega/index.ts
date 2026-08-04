export type BodegaComputadoraEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  anio_compra: string;
  id_marca: string;
  id_modelo: string;
  id_sistemaoperativo: string;
  id_versionso: string;
  id_ram: string;
  id_disco: string;
  id_dominio: string;
  id_versionoffice: string;
  id_antivirus: number;
  nombre_equipo: string;
  direccion_ip: string;
  id_serie: string;
  id_procesador: string;
  observacion: string;
};

export type BodegaComputadoraEditSend = {
  tipo: string;
  inventario: string;
  anio_compra: string;
  id_versionso: string;
  id_ram: string;
  id_disco: string;
  id_dominio: string;
  id_versionoffice: string;
  id_antivirus: string;
  nombre_equipo: string;
  direccion_ip: string;
  serie: string;
  perifericoId: string;
  marcaId: string;
  id_procesador: string
  observacion: string;
  editor?: string;
};

export type BodegaSimpleEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  anio_compra: string;
  id_marca: string;
  id_modelo: string;
  id_serie: string;
  id_lampara: string;
  observacion: string;
  isComponente?: boolean;
  id_computadora?: string | number;
  id_serie_computadora?: string | number;
  id_periferico_computadora?: string | number;
};

export type BodegaRedEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  anio_compra: string;
  id_marca: string;
  id_modelo: string;
  id_serie: string;
  observacion: string;
  mac: string;
  puertos: string;
  puerto_ftp: string;
  nombre_equipo:string;
};

export type BodegaSimpleEditSend = {
  tipo: string;
  inventario: string;
  anio_compra: string;
  serie: string;
  perifericoId: string;
  marcaId: string;
  id_lampara: string;
  observacion: string;
  editor?: string;
};

export type BodegaRedEditSend = {
  tipo: string;
  inventario: string;
  anio_compra: string;
  serie: string;
  perifericoId: string;
  marcaId: string;
  observacion: string;
  mac: string;
  puertos: string;
  puerto_ftp: string;
  nombre_equipo:string;
  editor?: string;
};

export type BodegaComputadoraData = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    perifericoId: number;
    serie: string;
    marcaId: number;
    modeloId: number;
    nombreEquipo?: string; 
    direccionIp?: string; 
    versionso?: number;    
    versionoffice?: number; 
    ram?: number;          
    disco?: number;       
    antivirus?: number;   
    dominio?: number;
    procesador?: number;
    observacion: string;
    autor?: string;
  };
  
  export type BodegaSimpleData = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    perifericoId: number;
    serie: string;
    marcaId: number;
    modeloId: number;
    idLampara: number;
    observacion: string;
    autor?: string;
  };

  export type BodegarRedData = {
    tipo: string;
    inventario: string;
    anio_compra: string;
    perifericoId: number;
    serie: string;
    marcaId: number;
    modeloId: number;
    observacion: string;
    mac: string;
    puertos: string;
    puerto_ftp: string;
    idLampara: number;
    nombreEquipo:string;
    autor?: string;
  };
  
