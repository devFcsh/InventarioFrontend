export type ImportMode =
  | "solo_nuevos"
  | "solo_actualizar"
  | "nuevos_y_actualizar";

export type ImportMatchItem = {
  inventario?: string;
  serie?: string;
  equipoId?: number | string;
  motivo: string;
  datos?: Record<string, unknown>;
};
