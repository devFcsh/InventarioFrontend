import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  TextField,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import Loader from "@pages/Loader";

interface Mantenimiento {
  id_mantenimiento: number;
  id_equipo: number;
  fecha: string;
  tipo: string;
  hallazgos: string;
  recomendaciones: string;
}

interface MantenimientosSimpleActivoProps {
  open: boolean;
  onClose: () => void;
  id_equipo: string;
  onOpenAgregar?: () => void;
}

export const MantenimientosSimpleActivo: React.FC<MantenimientosSimpleActivoProps> = ({
  open,
  onClose,
  onOpenAgregar,
}) => {
  const equipo = { inventario: "GEN-001", modelo: "Genérico", ubicacion: "Depósito" };
  const loading = false;
  const error = null;

  const mantenimientos: Mantenimiento[] = [
    {
      id_mantenimiento: 1,
      id_equipo: 1,
      fecha: "2024-10-08",
      tipo: "General",
      hallazgos: "Sin novedades.",
      recomendaciones: "Revisar periódicamente.",
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
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cargando...</DialogTitle>
        <DialogContent>
          <Loader />
        </DialogContent>
      </Dialog>
    );
  }
  if (error || !equipo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>Error al cargar los datos del equipo</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <TextField
          value={mantenimiento?.tipo || ""}
          fullWidth
          size="small"
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />

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