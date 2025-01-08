export type ActivoComputadoraEdit = {
    id_equipo: string;
    id_periferico: string;
    inventario: string;
    id_usuario: string;
    id_uso: string;
    imagenRuta: string;
    id_marca: string;
    id_modelo: string;
    id_sistemaoperativo: string;
    id_versionso: string;
    id_ram: string;
    id_disco: string;
    id_dominio: string;
    id_edificio: string;
    id_ubicacion: string;
    id_versionoffice: string;
    id_antivirus: number;
    nombre_equipo: string;
    direccion_ip: string;
    id_serie: string;
  };

  export type ActivoComputadoraEditSend = {
    tipo: string;
    inventario: string;
    id_usuario: string;
    imagenRuta: string | null;
    id_versionso: string;
    id_ram: string;
    id_disco: string;
    id_dominio: string;
    id_ubicacion: string;
    id_versionoffice: string;
    id_antivirus: string;
    nombre_equipo: string;
    direccion_ip: string;
    id_serie: string;
  };

  export type ActivoSimpleEdit = {
    id_equipo: string;
    id_periferico: string;
    inventario: string;
    id_usuario: string;
    id_uso: string;
    imagenRuta: string;
    id_marca: string;
    id_modelo: string;
    id_edificio: string;
    id_ubicacion: string;
    id_serie: string;
  };

  export type ActivoSimpleEditSend = {
    tipo: string;
    inventario: string;
    id_usuario: string;
    imagenRuta: string | null;
    id_ubicacion: string;
    id_serie: string;
  };

export type ActivoComputadoraData = {
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
    idUbicacion: number;
    idUsuario: number;
    imagenRuta: string;
  };
  
  export type ActivoSimpleData = {
    tipo: string;
    inventario: string;
    serie: number;     
    idUbicacion: number;
    idUsuario: number;
    imagenRuta: string;
  };
  