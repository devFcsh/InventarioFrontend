import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { Mantenimiento, ActividadMantenimientoResponse } from "../../../../../types/Activo/Mantenimiento";
import Loader from "@pages/Loader";


interface MantenimientosRedActivoProps {
  open: boolean;
  onClose: () => void;
  id_equipo: string;
  onOpenAgregar?: () => void;
}

export const MantenimientosRedActivo: React.FC<MantenimientosRedActivoProps> = ({
  open,
  onClose,
  onOpenAgregar,
}) => {
  const equipo = { inventario: "SW-001", modelo: "Cisco 2960", ubicacion: "Bloque A", direccion_ip: "192.168.1.2" };
  const loading = false;
  const error = null;

  const mantenimientos: Mantenimiento[] = [
    {
      id_mantenimiento: 1,
      fecha: "2024-10-08",
      tipo: "Preventivo",
      id_tipo_mantenimiento: 1,
      hallazgos: "Sin novedades.",
      recomendaciones: "Revisar firmware cada 6 meses.",
      actividades: [
        {
          id_actividad_periferico_tipo: 1,
          id_actividad_mantenimiento: 1,
          actividad: "Revisión de puertos",
          tipo_mantenimiento: "preventivo",
          realizada: false,
        },
      ],
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [open]);

  const formatFecha = (f?: string | null) => {
    if (!f) return "";
    try {
      const parseServerDate = (s: string) => {
        if (!s) return null;
        if (/[zZ]$/.test(s) || /[+-]\d{2}:?\d{2}$/.test(s)) return new Date(s);
        const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
        if (m) {
          const [, Y, M, D, hh, mm, ss] = m;
          return new Date(Number(Y), Number(M) - 1, Number(D), Number(hh), Number(mm), Number(ss ?? '0'));
        }
        return new Date(s);
      };

      const dt = parseServerDate(f);
      if (!dt || isNaN(dt.getTime())) return f as string;
      return dt.toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return f as string;
    }
  };

  const handlePrev = () =>
    setIndex((prev) =>
      prev === 0 ? mantenimientos.length - 1 : prev - 1
    );
  const handleNext = () =>
    setIndex((prev) =>
      prev === mantenimientos.length - 1 ? 0 : prev + 1
    );

  const mantenimiento = mantenimientos[index];

  if (!open) return null;
  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Cargando...</DialogTitle>
        <DialogContent>
          <Loader />
        </DialogContent>
      </Dialog>
    );
  }
  if (error || !equipo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>Error al cargar los datos del equipo</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography align="center" variant="h6" sx={{ flex: 1 }}>
          Mantenimientos para el equipo {equipo?.inventario || ""}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <Icon icon="ic:round-close" width={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <IconButton onClick={handlePrev}>
            <Icon icon="ic:round-chevron-left" width={32} />
          </IconButton>
          <Typography sx={{ mx: 2 }}>
            {mantenimientos.length > 0 ? `${index + 1} / ${mantenimientos.length}` : ""}
          </Typography>
          <IconButton onClick={handleNext}>
            <Icon icon="ic:round-chevron-right" width={32} />
          </IconButton>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Datos generales
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Inventario"
              value={equipo?.inventario || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Modelo"
              value={equipo?.modelo || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ubicación"
              value={equipo?.ubicacion || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Dirección IP"
              value={equipo?.direccion_ip || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha del Mantenimiento"
              value={formatFecha(mantenimiento?.fecha)}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Tipo de mantenimiento
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={mantenimiento?.tipo === "Preventivo"}
                readOnly
              />
            }
            label="Preventivo"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={mantenimiento?.tipo === "Correctivo"}
                readOnly
              />
            }
            label="Correctivo"
          />
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Actividades realizadas
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          {(mantenimiento?.actividades ?? []).map((actividad: ActividadMantenimientoResponse | { id_actividad_mantenimiento?: number; id_actividad_periferico_tipo?: number; nombre?: string; actividad?: string; realizada?: boolean }, idx: number) => {
            const id = actividad.id_actividad_mantenimiento ?? actividad.id_actividad_periferico_tipo;
            const done = actividad.realizada !== undefined ? !!actividad.realizada : false;
            const label = 'actividad' in actividad && actividad.actividad ? actividad.actividad : ('nombre' in actividad && actividad.nombre ? actividad.nombre : "");
            return (
              <FormControlLabel
                key={id ?? `act-${idx}`}
                control={<Checkbox checked={done} readOnly />}
                label={label}
              />
            );
          })}
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Hallazgos
        </Typography>
        <TextField
          value={mantenimiento?.hallazgos || ""}
          fullWidth
          multiline
          minRows={2}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Recomendaciones
        </Typography>
        <TextField
          value={mantenimiento?.recomendaciones || ""}
          fullWidth
          multiline
          minRows={2}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          {onOpenAgregar && (
            <Button variant="contained" onClick={onOpenAgregar}>
              Agregar mantenimiento
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};