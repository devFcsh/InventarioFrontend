export type BajaComputadoraData = {
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
  
  export type BajaSimpleData = {
    tipo: string;
    inventario: string;
    serie: number;
  };
  