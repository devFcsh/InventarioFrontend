// Actividad enviada desde el front al backend
export type ActividadMantenimientoRequest = {
  // Preferible: enviar id_actividad_periferico_tipo cuando esté disponible
  id_actividad_periferico_tipo?: number;
  // Alternativa: enviar id_actividad_mantenimiento para que el backend resuelva/creé el mapping
  id_actividad_mantenimiento?: number;
  // nombre opcional (solo para UI/local)
  nombre?: string;
  realizada?: boolean;
};

// Datos enviados para crear mantenimiento
export interface MantenimientoData {
  id_equipo: number;
  tipo: string; // 'preventivo' | 'correctivo' | ...
  hallazgos?: string;
  recomendaciones?: string; // backend espera esta propiedad
  observaciones?: string; // opcional por compatibilidad; se mapeará a recomendaciones si se usa
  actividades: ActividadMantenimientoRequest[];
}

// Tipos de actividad devueltos por el backend (respuesta)
export type ActividadMantenimientoResponse = {
  id_actividad_periferico_tipo: number;
  id_actividad_mantenimiento: number;
  actividad: string;
  tipo_mantenimiento?: string;
  realizada: boolean;
};

// Mantenimiento devuelto por el backend
export type Mantenimiento = {
  id_mantenimiento: number;
  fecha: string;
  hallazgos?: string;
  tipo?: string;
  recomendaciones?: string;
  actividades: ActividadMantenimientoResponse[];
};

export type ActividadMantenimiento = {
  id_actividad_mantenimiento: number;
  nombre?: string;
  realizada: boolean;
}
