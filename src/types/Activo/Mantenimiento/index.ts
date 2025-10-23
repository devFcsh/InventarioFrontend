export type ActividadMantenimiento = {
  id_actividad_mantenimiento: number;
  nombre?: string;
  realizada: boolean;
}

export interface MantenimientoData {
  id_equipo: number;
  tipo: string;
  hallazgos?: string;
  observaciones?: string;
  actividades: ActividadMantenimiento[];
}

export type Mantenimiento = {
  id_mantenimiento: number;
  fecha: string;
  tipo: string;
  hallazgos: string;
  recomendaciones: string;
  actividades: ActividadMantenimiento[];
}
