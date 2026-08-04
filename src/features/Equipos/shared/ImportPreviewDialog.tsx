import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import type { ActivoComputadoraImport } from "../../../types/Activo/index.ts";

export type ImportPreviewData = {
  fileName: string;
  sheets: string[];
  equipment: ActivoComputadoraImport[];
  errors: string[];
};

interface ImportPreviewDialogProps {
  open: boolean;
  preview: ImportPreviewData | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ImportPreviewDialog = ({
  open,
  preview,
  loading = false,
  onCancel,
  onConfirm,
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

        {hasErrors ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            El archivo tiene errores de formato. Corrígelos antes de confirmar la importación.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Todavía no se ha guardado ningún registro. Las columnas que no se encuentren en el formato de importación serán ignoradas.
          </Alert>
        )}

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
