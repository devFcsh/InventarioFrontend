export type BajaSimpleEdit = {
  id_equipo: string;
  id_periferico: string;
  inventario: string;
  id_marca: string;
  id_modelo: string;
  id_serie: string;
  id_lampara: string;
  observacion: string;
};

export type BajaSimpleEditSend = {
  tipo: string;
  inventario: string;
  id_serie: string;
  id_lampara: string;
  observacion: string;
};

export type BajaComputadoraData = {
    tipo: string;
    inventario: string;
    perifericoId: number;
    serie: string;
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
};
  
export type BajaSimpleData = {
    tipo: string;
    inventario: string;
    perifericoId: number;
    serie: string;
    modeloId: number;
    idLampara: number;
    observacion: string;
  };
  
  export type BajaRedData = {
    tipo: string;
    inventario: string;
    perifericoId: number;
    serie: string;
    modeloId: number;
    observacion: string;
    mac: string;
    puertos: string;
    puerto_ftp: string;
    idLampara: number;
    nombreEquipo:string;
  };