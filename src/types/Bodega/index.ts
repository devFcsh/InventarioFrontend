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
  };
  
  export type BodegaSimpleData = {
    tipo: string;
    inventario: string;
    serie: number;
  };
  