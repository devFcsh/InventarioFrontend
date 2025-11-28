/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Loader from "@pages/Loader";
import { useAgregarMantenimiento } from "../hooks/useAgregarMantenimiento";
import { useAgregarActividadMantenimiento } from "../hooks/useAgregarActividadMantenimiento";
import { useSnackbar } from "@context/SnackbarContext";
import {
  ActividadMantenimiento,
  MantenimientoData,
  ActividadMantenimientoRequest,
} from "../../../../../types/Activo/Mantenimiento";
import { useObtenerActividadesEquipo } from "../hooks/useObtenerActividades";
import { useObtenerComputadora } from "../../EditarActivo/hooks/useComputadora";


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

  const { equipo } = useObtenerComputadora(open && id_equipo ? id_equipo : null);
  const { agregarMantenimiento, loading } = useAgregarMantenimiento();
  const { agregarActividad, loading: addingActividad } = useAgregarActividadMantenimiento();
  const [tipoOption, setTipoOption] = useState<{ label: string; value: string } | null>(null);
  const [hallazgos, setHallazgos] = useState<string>("");
  const [recomendaciones, setRecomendaciones] = useState<string>("");
  const [fecha, setFecha] = useState<string>(() => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  });
  const [actividades, setActividades] = useState<ActividadMantenimiento[]>([]);

  const selectedTipoForHook = tipoOption?.value ?? undefined;
  const { actividades: actividadesBackend, loading: actividadesLoading, error: actividadesError } =
    useObtenerActividadesEquipo(id_equipo, selectedTipoForHook);

  const [newActividadNombre, setNewActividadNombre] = useState<string>("");

  useEffect(() => {
    if (actividadesBackend && actividadesBackend.length > 0) {
      setActividades(
        (actividadesBackend as any[])
          .filter((a) => a.id_actividad_mantenimiento || a.id_actividad_periferico_tipo)
          .map((a) => ({
            id_actividad_mantenimiento: a.id_actividad_mantenimiento ? Number(a.id_actividad_mantenimiento) : undefined,
            id_actividad_periferico_tipo: a.id_actividad_periferico_tipo ? Number(a.id_actividad_periferico_tipo) : undefined,
            nombre: a.actividad ?? a.nombre ?? "",
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
        (act.id_actividad_mantenimiento ?? act.id_actividad_periferico_tipo) === id
          ? { ...act, realizada: !act.realizada }
          : act
      )
    );
  };

  const { showMessage } = useSnackbar();

  const handleSubmit = async () => {
    const tipoToSend = tipoOption?.value || "";

    if (!tipoToSend) {
      alert("Seleccione el tipo de mantenimiento (Correctivo o Preventivo)");
      return;
    }

    const actividadesPayload: ActividadMantenimientoRequest[] = (actividades || []).map(
      (a) => ({
        id_actividad_mantenimiento: a.id_actividad_mantenimiento,
        id_actividad_periferico_tipo: a.id_actividad_periferico_tipo,
        realizada: !!a.realizada,
      })
    );

    const formatFechaForServer = (localDatetime: string) => {
      if (!localDatetime) return undefined;
      const d = new Date(localDatetime);
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
        d.getHours()
      )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const payload: MantenimientoData = {
      id_equipo: Number(id_equipo),
      tipo: tipoToSend,
      fecha: fecha ? formatFechaForServer(fecha) : undefined,
      hallazgos: hallazgos || undefined,
      recomendaciones: recomendaciones || undefined,
      actividades: actividadesPayload,
    };

    try {
      const result = await agregarMantenimiento(payload);

      if (result?.ok) {
        showMessage(result.message ?? "Mantenimiento registrado correctamente", "success");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showMessage(result?.error ?? "Error al agregar mantenimiento", "error");
      }
    } catch (e) {
      showMessage("Error al agregar mantenimiento", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Agregar Mantenimiento</DialogTitle>
      <DialogContent>
        {loading && <Loader />}
        <Grid container spacing={2} sx={{ my: 2 }}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha"
              type="datetime-local"
              size="small"
              fullWidth
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Actividades realizadas
            </Typography>
            {tipoOption ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                <TextField
                  size="small"
                  label="Nueva actividad"
                  value={newActividadNombre}
                    onChange={(e) => setNewActividadNombre(e.target.value)}
                    inputProps={{ maxLength: 100 }}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={async () => {
                    const tipoToSend = tipoOption?.value;
                    if (!tipoToSend) {
                      showMessage("Seleccione un tipo de mantenimiento antes de agregar una actividad", "warning");
                      return;
                    }
                      const nombreTrim = newActividadNombre ? newActividadNombre.trim() : "";
                      if (!nombreTrim) {
                        showMessage("Ingrese el nombre de la actividad", "warning");
                        return;
                      }
                      if (nombreTrim.length > 100) {
                        showMessage("La actividad no puede exceder 100 caracteres", "warning");
                        return;
                      }

                      const payload = {
                        nombre: nombreTrim,
                        tipo: tipoToSend,
                        id_periferico: equipo?.id_periferico,
                      };

                    const res = await agregarActividad(payload as any);
                    if (res.ok) {
                      showMessage(res.message || "Actividad agregada", "success");
                      const act = res.actividad
                        ? {
                            id_actividad_mantenimiento: res.actividad.id_actividad_mantenimiento ? Number(res.actividad.id_actividad_mantenimiento) : undefined,
                            id_actividad_periferico_tipo: res.actividad.id_actividad_periferico_tipo ? Number(res.actividad.id_actividad_periferico_tipo) : undefined,
                            nombre: res.actividad.actividad || res.actividad.nombre || payload.nombre,
                            realizada: false,
                          }
                        : {
                            id_actividad_mantenimiento: undefined,
                            id_actividad_periferico_tipo: undefined,
                            nombre: payload.nombre,
                            realizada: false,
                          };

                      setActividades((prev) => [act as ActividadMantenimiento, ...prev]);
                      setNewActividadNombre("");
                    } else {
                      showMessage(res.error || "Error al agregar actividad", "error");
                    }
                  }}
                  disabled={addingActividad}
                >
                  {addingActividad ? "Agregando..." : "Agregar actividad"}
                </Button>
              </Box>
            ) : null}
            <Box sx={{ maxHeight: 360, overflow: "auto", pr: 1, mb: 2 }}>
              {!tipoOption ? (
                <Typography color="textSecondary" sx={{ p: 2 }}>
                  Seleccione un tipo de mantenimiento para ver las actividades.
                </Typography>
              ) : actividadesLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Loader />
                </Box>
              ) : actividades.length === 0 ? (
                <Typography color="textSecondary" sx={{ p: 2 }}>
                  No hay actividades disponibles para el tipo seleccionado.
                </Typography>
              ) : (
                <Grid container spacing={1}>
                  {actividades.map((actividad) => {
                    const key = actividad.id_actividad_mantenimiento ?? actividad.id_actividad_periferico_tipo ?? Math.random();
                    const idKey = actividad.id_actividad_mantenimiento ?? actividad.id_actividad_periferico_tipo ?? 0;
                    return (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!actividad.realizada}
                              onChange={() => handleActividadChange(idKey)}
                            />
                          }
                          label={actividad.nombre}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Hallazgos"
              value={hallazgos}
              onChange={(e) => setHallazgos(e.target.value)}
              inputProps={{ maxLength: 200 }}
              fullWidth
              multiline
              minRows={2}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Recomendaciones"
              value={recomendaciones}
              onChange={(e) => setRecomendaciones(e.target.value)}
              inputProps={{ maxLength: 200 }}
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
            disabled={loading || actividadesLoading || !tipoOption}
          >
            Agregar Mantenimiento
          </Button>
        </Box>
        {actividadesLoading && (
          <Box sx={{ position: 'relative' }}>
            <Loader />
          </Box>
        )}

        {!actividadesLoading && actividadesError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {actividadesError}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};