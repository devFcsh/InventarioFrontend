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

export type ExportarComputadora = {
    id_equipo: string;
    empresa: string;
    edificio: string;
    ubicacion: string;
    uso: string;
    usuario: string;
    direccion_ip: string;
    nombre_equipo: string;
    dominio: string;
    sistema_operativo: string;
    version_sistema_operativo: string;
    procesador: string;
    tipo_ram: string;
    capacidad_ram: string;
    capacidad_disco: string;
    marca: string;
    modelo: string;
    serie: string;
    inventario: string;
    anio_compra: string;
    fecha_ultimo_cambio: string;
    observacion: string;
    mouse_marca: string; 
    mouse_modelo: string; 
    mouse_serie: string; 
    mouse_inventario: string; 
    teclado_marca: string;
    teclado_modelo: string; 
    teclado_serie: string; 
    teclado_inventario: string;
    monitor_marca: string;
    monitor_modelo: string;
    monitor_serie: string;
    monitor_inventario: string;
};

export type ExportarAP = {
    empresa: string;
    inventario: string;
    anio_compra: string;
    edificio: string;
    ubicacion: string;
    marca: string;
    modelo: string;
    serie: string;
    mac: string;
    nombre_equipo: string;
    fecha_ultimo_cambio: string;
    observacion: string;
}

export type ExportarSwitch = {
    empresa: string;
    inventario: string;
    anio_compra: string;
    edificio: string;
    ubicacion: string;
    marca: string;
    modelo: string;
    serie: string;
    mac: string;
    puertos: string;
    puerto_ftp: string;
    nombre_equipo: string;
    fecha_ultimo_cambio: string;
    observacion: string;
}

export type ExportarProyector = {
    empresa: string;
    inventario: string;
    anio_compra: string;
    edificio: string;
    ubicacion: string;
    marca: string;
    modelo: string;
    serie: string;
    lampara: string;
    fecha_ultimo_cambio: string;
    observacion: string;
}

export type ExportarSimples = {
    periferico: string;
    empresa: string;
    edificio: string;
    ubicacion: string;
    uso: string;
    usuario: string;
    marca: string;
    modelo: string;
    serie: string;
    inventario: string;
    anio_compra: string;
    fecha_ultimo_cambio: string;
    observacion: string;
}

export type ExportarEquiposBaja = {
    periferico: string;
    empresa: string;
    marca: string;
    modelo: string;
    serie: string;
    inventario: string;
    anio_compra: string;
    fecha_ultimo_cambio: string;
    estado: string;
}

export type EquipoBodega = {
    id_equipo: string;
    periferico: string;
    marca: string;
    modelo: string;
    serie: string;
    inventario: string;
};

export type EquipoBaja = {
    id_equipo: string;
    periferico: string;
    marca: string;
    modelo: string;
    serie: string;
    inventario: string;
    anio_compra: string;
};