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
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAgregarMantenimiento } from "../hooks/useAgregarMantenimiento";
import { ActividadMantenimiento } from "../../../../../types/Activo/Mantenimiento";
import { useObtenerActividadesEquipo } from "../hooks/useObtenerActividades";


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
  // tipo will be selected from the Autocomplete as an object { label, value }
  const [tipoOption, setTipoOption] = useState<{ label: string; value: string } | null>(null);
  const [hallazgos, setHallazgos] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [actividades, setActividades] = useState<ActividadMantenimiento[]>([]);

  // Hook to fetch actividades desde el backend
  const { actividades: actividadesBackend, loading: actividadesLoading, error: actividadesError } = useObtenerActividadesEquipo(id_equipo);

  // Map backend activities to local structure with 'realizada' flag
  useEffect(() => {
    if (actividadesBackend && actividadesBackend.length > 0) {
      setActividades(
        actividadesBackend.map((a) => ({
          id_actividad_mantenimiento: a.id_actividad_mantenimiento,
          nombre: a.nombre,
          realizada: false,
        }))
      );
    } else {
      setActividades([]);
    }
  }, [actividadesBackend]);

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
    const tipoToSend = tipoOption?.value || "";

    await agregarMantenimiento({
      id_equipo: Number(id_equipo),
      tipo: tipoToSend,
      hallazgos,
      observaciones,
      actividades,
    });
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Agregar Mantenimiento</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              size="small"
              options={[
                { label: "Correctivo", value: "correctivo" },
                { label: "Preventivo", value: "preventivo" },
              ]}
              getOptionLabel={(option) => option.label}
              value={tipoOption}
              onChange={(_e, newValue) => setTipoOption(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Tipo de mantenimiento" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Actividades realizadas
            </Typography>
            {/* Scrollable grid to better display many activities in columns */}
            <Box sx={{ maxHeight: 360, overflow: "auto", pr: 1, mb: 2 }}>
              <Grid container spacing={1}>
                {actividades.map((actividad) => (
                  <Grid
                    item
                    key={actividad.id_actividad_mantenimiento}
                    xs={12}
                    sm={6}
                    md={4}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!actividad.realizada}
                          onChange={() => handleActividadChange(actividad.id_actividad_mantenimiento)}
                          size="small"
                        />
                      }
                      label={actividad.nombre}
                    />
                  </Grid>
                ))}
              </Grid>
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
            disabled={loading || actividadesLoading}
          >
            Agregar Mantenimiento
          </Button>
        </Box>
        {actividadesLoading && (
          <Typography color="textSecondary" sx={{ mt: 2 }}>
            Cargando actividades...
          </Typography>
        )}
        {actividadesError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {actividadesError}
          </Typography>
        )}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {message && <Typography color="primary" sx={{ mt: 2 }}>{message}</Typography>}
      </DialogContent>
    </Dialog>
  );
};