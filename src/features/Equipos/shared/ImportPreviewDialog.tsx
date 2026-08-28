import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { ActivoComputadoraImport } from "../../../types/Activo/index.ts";
import type { ImportMatchItem, ImportMode } from "./importTypes.ts";

export type ImportPreviewData = {
  fileName: string;
  sheets: string[];
  equipment: ActivoComputadoraImport[];
  errors: string[];
  mode: ImportMode;
  actualizables: ImportMatchItem[];
  nuevos: ActivoComputadoraImport[];
  conflictos: ImportMatchItem[];
};

interface ImportPreviewDialogProps {
  open: boolean;
  preview: ImportPreviewData | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onModeChange: (mode: ImportMode) => void;
}

const ImportPreviewDialog = ({
  open,
  preview,
  loading = false,
  onCancel,
  onConfirm,
  onModeChange,
}: ImportPreviewDialogProps) => {
  if (!preview) return null;

  const typeCounts = preview.equipment.reduce<Record<string, number>>(
    (counts, equipment) => {
      const type = String(equipment.tipo || "Sin tipo");
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    },
    {},
  );

  const hasErrors = preview.errors.length > 0;
  const modeLabel =
    preview.mode === "solo_nuevos"
      ? "Solo insertar nuevos"
      : preview.mode === "solo_actualizar"
      ? "Solo actualizar existentes"
      : "Insertar nuevos y actualizar existentes";

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Vista previa de importación</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Archivo: <strong>{preview.fileName}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Hojas detectadas: {preview.sheets.join(", ")}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Registros listos para importar: <strong>{preview.equipment.length}</strong>
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="import-mode-label">Modo de importación</InputLabel>
          <Select
            labelId="import-mode-label"
            value={preview.mode}
            label="Modo de importación"
            onChange={(event) => onModeChange(event.target.value as ImportMode)}
            disabled={loading}
          >
            <MenuItem value="solo_nuevos">Solo insertar nuevos</MenuItem>
            <MenuItem value="solo_actualizar">Solo actualizar existentes</MenuItem>
            <MenuItem value="nuevos_y_actualizar">
              Insertar nuevos y actualizar existentes
            </MenuItem>
          </Select>
        </FormControl>

        <Alert severity="info" sx={{ mb: 2 }}>
          Modo seleccionado: <strong>{modeLabel}</strong>
        </Alert>

        {preview.actualizables.length > 0 ? (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Equipos que coinciden y podrían actualizarse: {preview.actualizables.length}
            </Typography>
            <List dense sx={{ maxHeight: 180, overflowY: "auto" }}>
              {preview.actualizables.map((item, index) => (
                <ListItem key={`${item.equipoId ?? item.inventario}-${index}`} disableGutters>
                  <ListItemText
                    primary={`Inventario: ${item.inventario || "S/N"} | Serie: ${item.serie || "S/N"}`}
                    secondary={`ID actual: ${item.equipoId ?? "desconocido"}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : null}

        {preview.nuevos.length > 0 ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Sin coincidencia en la base de datos: <strong>{preview.nuevos.length}</strong>
            {preview.mode === "solo_actualizar"
              ? " (no se actualizarán en este modo)."
              : " (se pueden insertar como nuevos)."}
          </Typography>
        ) : null}

        {preview.conflictos.length > 0 ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Hay {preview.conflictos.length} conflicto(s) de inventario/serie. No se actualizarán
            automáticamente.
          </Alert>
        ) : null}

        {hasErrors ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            El archivo tiene errores de formato. Corrígelos antes de confirmar la importación.
          </Alert>
        ) : null}

        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Resumen por tipo
        </Typography>
        <List dense>
          {Object.entries(typeCounts).map(([type, count]) => (
            <ListItem key={type} disableGutters>
              <ListItemText primary={`${type}: ${count} registro(s)`} />
            </ListItem>
          ))}
        </List>

        {hasErrors ? (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Errores encontrados
            </Typography>
            <List dense sx={{ maxHeight: 180, overflowY: "auto" }}>
              {preview.errors.map((error, index) => (
                <ListItem key={`${error}-${index}`} disableGutters>
                  <ListItemText primary={error} />
                </ListItem>
              ))}
            </List>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading} color="inherit">
          Cancelar importación
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading || hasErrors || preview.equipment.length === 0}
          variant="contained"
        >
          Confirmar importación
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportPreviewDialog;
