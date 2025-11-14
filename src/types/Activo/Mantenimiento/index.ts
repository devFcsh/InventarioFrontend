export type ActividadMantenimientoRequest = {
  id_actividad_periferico_tipo?: number;
  id_actividad_mantenimiento?: number;
  nombre?: string;
  realizada?: boolean;
};

export interface MantenimientoData {
  id_equipo: number;
  tipo: string;
  hallazgos?: string;
  recomendaciones?: string;
  fecha?: string;
  observaciones?: string; 
  actividades: ActividadMantenimientoRequest[];
}

export type ActividadMantenimientoResponse = {
  id_actividad_periferico_tipo: number;
  id_actividad_mantenimiento: number;
  actividad: string;
  tipo_mantenimiento?: string;
  realizada: boolean;
};

export type Mantenimiento = {
  id_mantenimiento: number;
  fecha: string;
  hallazgos?: string;
  tipo?: string;
  id_tipo_mantenimiento?: number;
  recomendaciones?: string;
  actividades: ActividadMantenimientoResponse[];
};

export type ActividadMantenimiento = {
  id_actividad_mantenimiento?: number;
  id_actividad_periferico_tipo?: number;
  nombre?: string;
  realizada: boolean;
}
