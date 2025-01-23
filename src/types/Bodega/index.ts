export type BodegaComputadoraEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
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
  id_versionso: string;
  id_ram: string;
  id_disco: string;
  id_dominio: string;
  id_versionoffice: string;
  id_antivirus: number;
  nombre_equipo: string;
  direccion_ip: string;
  id_serie: string;
  id_procesador: string
  observacion: string;
};

export type BodegaSimpleEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  id_marca: string;
  id_modelo: string;
  id_serie: string;
  id_lampara: string;
  observacion: string;
};

export type BodegaRedEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  id_marca: string;
  id_modelo: string;
  id_serie: string;
  observacion: string;
  mac: string;
  puertos: string;
  puerto_ftp: string;
};

export type BodegaSimpleEditSend = {
  tipo: string;
  inventario: string;
  id_serie: string;
  id_lampara: string;
  observacion: string;
};

export type BodegaRedEditSend = {
  tipo: string;
  inventario: string;
  id_serie: string;
  observacion: string;
  mac: string;
  puertos: string;
  puerto_ftp: string;
};

export type BodegaComputadoraData = {
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
    procesador?: number;
    observacion: string;
  };
  
  export type BodegaSimpleData = {
    tipo: string;
    inventario: string;
    serie: number;
    idLampara: number;
    observacion: string;
  };

  export type BodegarRedData = {
    tipo: string;
    inventario: string;
    serie: number;
    observacion: string;
    mac: string;
    puertos: string;
    puerto_ftp: string;
  };
  