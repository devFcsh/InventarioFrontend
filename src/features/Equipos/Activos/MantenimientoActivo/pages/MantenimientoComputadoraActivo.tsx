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
} from "@mui/material";
import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import Loader from "@pages/Loader";
import { useObtenerComputadora } from "../../EditarActivo/hooks/useComputadora";
import { ActividadMantenimiento } from "../../../../../types/Activo/Mantenimiento";
import { Mantenimiento } from "../../../../../types/Activo/Mantenimiento";

interface MantenimientosComputadoraActivoProps {
  open: boolean;
  onClose: () => void;
  id_equipo: string;
  mantenimientos: Mantenimiento[];
}

export const MantenimientosComputadoraActivo: React.FC<MantenimientosComputadoraActivoProps> = ({
  open,
  onClose,
  id_equipo,
  mantenimientos
}) => {
  const { equipo, componentes, loading: loadingEquipo, error: errorEquipo } =
    useObtenerComputadora(open && id_equipo ? id_equipo : null);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [open, mantenimientos.length]);

  if (!open) return null;

  if (loadingEquipo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Cargando...</DialogTitle>
        <DialogContent>
          <Loader />
        </DialogContent>
      </Dialog>
    );
  }

  if (errorEquipo || !equipo) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>
            Error al cargar los datos del equipo o mantenimientos
            <br />
            {errorEquipo && <span>Equipo: {JSON.stringify(errorEquipo)}</span>}
            {!equipo && <span>Equipo: {JSON.stringify(equipo)}</span>}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!mantenimientos.length) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography align="center" variant="h6">
            Mantenimientos para el equipo {equipo?.inventario || ""}
          </Typography>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <Icon icon="ic:round-close" width={24} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>No hay mantenimientos registrados para este equipo.</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const handlePrev = () =>
    setIndex((prev) =>
      prev === 0 ? mantenimientos.length - 1 : prev - 1
    );
  const handleNext = () =>
    setIndex((prev) =>
      prev === mantenimientos.length - 1 ? 0 : prev + 1
    );

  const mantenimiento = mantenimientos[index];

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
              label="Usuario/Área/Bloque"
              value={equipo?.id_usuario || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Marca / Modelo"
              value={`${equipo?.id_marca || ""} / ${equipo?.id_modelo || ""}`}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Número de Serie"
              value={equipo?.id_serie || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
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
              label="Nombre del Equipo/Dominio"
              value={equipo?.nombre_equipo || equipo?.id_dominio || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Usuarios que tiene el Equipo"
              value={equipo?.id_usuario || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ip/Mask/Gw"
              value={equipo?.direccion_ip || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ram"
              value={equipo?.id_ram || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Procesador/Generación"
              value={equipo?.id_procesador || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Disco Duro/Capacidad/Temperatura/#Horas/Estado"
              value={equipo?.id_disco || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Sistema Operativo/Versión"
              value={equipo?.id_sistemaoperativo || equipo?.id_versionso || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Versión del Office/Activado"
              value={equipo?.id_versionoffice || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Versión Antivirus/Activado"
              value={equipo?.id_antivirus || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha del Mantenimiento"
              value={mantenimiento?.fecha || ""}
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
          {mantenimiento.actividades?.map((actividad: ActividadMantenimiento) => (
            <FormControlLabel
              key={actividad.id_actividad_mantenimiento}
              control={
                <Checkbox
                  checked={!!actividad.realizada}
                  readOnly
                />
              }
              label={actividad.nombre}
            />
          ))}
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
                      {typeof comp.serie === "object" && comp.serie !== null && "nombre" in comp.serie
                        ? comp.serie.nombre
                        : comp.serie}
                    </td>
                    <td className="py-2 px-4 border">{comp.inventario}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
      </DialogContent>
    </Dialog>
  );
};