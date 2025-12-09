import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import Loader from "@pages/Loader";
import { useObtenerComputadora } from "../../EditarActivo/hooks/useComputadora";
import { ActividadMantenimientoResponse } from "../../../../../types/Activo/Mantenimiento";
import useEditarMantenimiento from "../hooks/useEditarMantenimiento";
import { useSnackbar } from "@context/SnackbarContext";
import useMantenimientoDetalle from "../hooks/useMantenimientoDetalle";

interface EditarMantenimientoProps {
  open: boolean;
  onClose: () => void;
  id_mantenimiento: number | null;
}

export const EditarMantenimiento: React.FC<EditarMantenimientoProps> = ({
  open,
  onClose,
  id_mantenimiento,
}) => {
  const { detalle, loading: loadingDetalle, error: errorDetalle } = useMantenimientoDetalle(id_mantenimiento);
  
  const detalleData = detalle?.mantenimiento ? detalle.mantenimiento : detalle ?? null;
  const equipoIdStr = detalleData?.equipo?.id_equipo ? String(detalleData.equipo.id_equipo) : null;
  const { equipo, componentes, loading: loadingEquipo } = useObtenerComputadora(equipoIdStr);

  const dateToInputLocal = (d?: Date | null) => {
    if (!d) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const serverDateStringToInput = useCallback((s?: string | null) => {
    if (!s) return "";
    const pad = (n: number) => String(n).padStart(2, "0");

    const hasTz = /[zZ]$/.test(s) || /[+-]\d{2}:?\d{2}$/.test(s);
    if (hasTz) {
      const d = new Date(s);
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
        d.getUTCHours()
      )}:${pad(d.getUTCMinutes())}`;
    }

    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (m) {
      const [, Y, M, D, hh, mm] = m;
      return `${Y}-${M}-${D}T${hh}:${mm}`;
    }

    return dateToInputLocal(new Date(s));
  }, []);

  const [fechaLocal, setFechaLocal] = useState<string>("");
  const [localActividades, setLocalActividades] = useState<ActividadMantenimientoResponse[]>([]);
  const [hallazgosLocal, setHallazgosLocal] = useState<string>("");
  const [recomendacionesLocal, setRecomendacionesLocal] = useState<string>("");
  const [dateWarning, setDateWarning] = useState<string>("");

  const { editarMantenimiento, error: editError, message: editMessage } = useEditarMantenimiento();
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (!detalleData) return;
    
    const actividades = detalleData.actividades ?? detalleData.actividades_mantenimiento ?? [];
    setLocalActividades(actividades.map((a: ActividadMantenimientoResponse) => ({ ...a })));
    
    if (detalleData.fecha) {
      try {
        const parsed = serverDateStringToInput(detalleData.fecha);
        setFechaLocal(parsed);
      } catch (e) {
        setFechaLocal("");
      }
    } else {
      setFechaLocal("");
    }
    
    setHallazgosLocal(detalleData.hallazgos || "");
    setRecomendacionesLocal(detalleData.recomendaciones || "");
  }, [detalleData, serverDateStringToInput]);

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFechaLocal(value);

    const selectedDate = new Date(value);
    const now = new Date();
    if (selectedDate > now) {
      setDateWarning("⚠️ La fecha seleccionada es futura");
    } else {
      setDateWarning("");
    }
  };

  const handleActividadChange = (index: number, checked: boolean) => {
    setLocalActividades((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], realizada: checked };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!id_mantenimiento || !detalleData) return;

    const actividadesPayload = localActividades.map((a) => {
      if (a.id_actividad_periferico_tipo) {
        return { id_actividad_periferico_tipo: a.id_actividad_periferico_tipo, realizada: !!a.realizada };
      }
      return { id_actividad_mantenimiento: a.id_actividad_mantenimiento, realizada: !!a.realizada };
    });

    const payload = {
      tipo: (detalleData.tipo || "").toString().toLowerCase(),
      hallazgos: hallazgosLocal || undefined,
      recomendaciones: recomendacionesLocal || undefined,
      fecha: fechaLocal ? fechaLocal.replace("T", " ") + ":00" : undefined,
      actividades: actividadesPayload,
    };

    const ok = await editarMantenimiento(id_mantenimiento, payload);
    if (ok) {
      showMessage(editMessage ?? "Mantenimiento actualizado correctamente", "success");
      onClose();
    } else {
      showMessage(editError ?? "Error al actualizar el mantenimiento", "error");
    }
  };

  if (!open) return null;

  if (loadingDetalle || loadingEquipo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Loader />
        </DialogContent>
      </Dialog>
    );
  }

  if (errorDetalle || !detalleData) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Error al cargar los datos del mantenimiento
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const maxDate = new Date().toISOString().slice(0, 16);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Editar Mantenimiento
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Fecha
          </Typography>
          <TextField
            type="datetime-local"
            fullWidth
            value={fechaLocal}
            onChange={handleFechaChange}
            inputProps={{
              max: maxDate,
            }}
            sx={{ mb: 2 }}
          />
          {dateWarning && (
            <Typography color="warning.main" variant="caption" display="block" sx={{ mt: -1.5, mb: 1 }}>
              {dateWarning}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Datos generales
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Tipo
              </Typography>
              <Typography variant="body1">
                {detalleData.tipo ?? ""}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Equipo
              </Typography>
              <Typography variant="body1">
                {detalleData.equipo?.periferico ?? ""}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Inventario
              </Typography>
              <Typography variant="body1">
                {detalleData.equipo?.inventario ?? equipo?.inventario ?? ""}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Serie
              </Typography>
              <Typography variant="body1">
                {detalleData.equipo?.serie ?? (equipo as any)?.serie?.nombre ?? ""}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Actividades
          </Typography>
          <Grid container spacing={1}>
            {localActividades.map((a, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!a.realizada}
                      onChange={(e) => handleActividadChange(i, e.target.checked)}
                    />
                  }
                  label={a.actividad ?? (a as any).nombre ?? ""}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Hallazgos
          </Typography>
          <TextField
            value={hallazgosLocal}
            onChange={(e) => setHallazgosLocal(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            inputProps={{ maxLength: 200 }}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Recomendaciones
          </Typography>
          <TextField
            value={recomendacionesLocal}
            onChange={(e) => setRecomendacionesLocal(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            inputProps={{ maxLength: 200 }}
            sx={{ mb: 2 }}
          />

          {equipo && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Componentes
              </Typography>
              <Box className="overflow-x-auto w-full flex justify-center">
                <table className="min-w-[600px] border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-2 px-4 border">Periférico</th>
                      <th className="py-2 px-4 border">Marca</th>
                      <th className="py-2 px-4 border">Modelo</th>
                      <th className="py-2 px-4 border">Serie</th>
                      <th className="py-2 px-4 border">Inventario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {componentes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 px-4 text-gray-500">
                          No hay componentes disponibles.
                        </td>
                      </tr>
                    ) : (
                      componentes.map((comp, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-4 border">{comp.periferico?.nombre}</td>
                          <td className="py-2 px-4 border">{comp.marca?.nombre}</td>
                          <td className="py-2 px-4 border">{comp.modelo?.nombre}</td>
                          <td className="py-2 px-4 border">
                            {typeof comp.serie === "object" &&
                            comp.serie !== null &&
                            "nombre" in comp.serie
                              ? (comp.serie as { nombre: string }).nombre
                              : comp.serie}
                          </td>
                          <td className="py-2 px-4 border">{comp.inventario}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Box>
            </>
          )}

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Guardar cambios
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
