import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useAgregarMantenimiento } from "../hooks/useAgregarMantenimiento";
import { ActividadMantenimiento } from "../../../../../types/Activo/Mantenimiento";

const actividadesCatalogo: ActividadMantenimiento[] = [
  { id_actividad_mantenimiento: 1, nombre: "Limpieza interna", realizada: false },
  { id_actividad_mantenimiento: 2, nombre: "Revisión de software", realizada: false },
  { id_actividad_mantenimiento: 3, nombre: "Actualización de antivirus", realizada: false },
];

interface AgregarMantenimientoProps {
  open: boolean;
  onClose: () => void;
  id_equipo: string;
  onSuccess?: () => void;
}

export const AgregarMantenimiento: React.FC<AgregarMantenimientoProps> = ({
  open,
  onClose,
  id_equipo,
  onSuccess,
}) => {
  const { agregarMantenimiento, loading, error, message } = useAgregarMantenimiento();
  const [tipo, setTipo] = useState<string>("");
  const [hallazgos, setHallazgos] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [actividades, setActividades] = useState<ActividadMantenimiento[]>(
    actividadesCatalogo
  );

  const handleActividadChange = (id: number) => {
    setActividades((prev) =>
      prev.map((act) =>
        act.id_actividad_mantenimiento === id
          ? { ...act, realizada: !act.realizada }
          : act
      )
    );
  };

  const handleSubmit = async () => {
    await agregarMantenimiento({
      id_equipo: Number(id_equipo),
      tipo,
      hallazgos,
      observaciones,
      actividades,
    });
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar Mantenimiento</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tipo de mantenimiento"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Actividades realizadas
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              {actividades.map((actividad) => (
                <FormControlLabel
                  key={actividad.id_actividad_mantenimiento}
                  control={
                    <Checkbox
                      checked={!!actividad.realizada}
                      onChange={() => handleActividadChange(actividad.id_actividad_mantenimiento)}
                    />
                  }
                  label={actividad.nombre}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Hallazgos"
              value={hallazgos}
              onChange={(e) => setHallazgos(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Recomendaciones / Observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              size="small"
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            Agregar Mantenimiento
          </Button>
        </Box>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>}
      </DialogContent>
    </Dialog>
  );
};