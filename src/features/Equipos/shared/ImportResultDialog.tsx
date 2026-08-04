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

type ImportResultItem = {
  inventario?: string;
  motivo: string;
  datos?: {
    filaExcel?: number | string;
    hojaExcel?: string;
    serie?: string;
  };
};

type ImportResult = {
  message?: string;
  resumen?: {
    totalProcesados: number;
    registrados: number;
    noRegistrados: number;
    equiposAgregados: number;
    seInsertaronNuevos: boolean;
  };
  noRegistrados?: ImportResultItem[];
  advertencias?: ImportResultItem[];
};

interface ImportResultDialogProps {
  open: boolean;
  onClose: () => void;
  result: ImportResult | null;
  title: string;
}

const ImportResultDialog = ({
  open,
  onClose,
  result,
  title,
}: ImportResultDialogProps) => {
  if (!result) {
    return null;
  }

  const hasErrors = (result.noRegistrados?.length ?? 0) > 0;
  const hasWarnings = (result.advertencias?.length ?? 0) > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {result.message ? (
          <Alert severity={hasErrors || hasWarnings ? "warning" : "success"} sx={{ mb: 2 }}>
            {result.message}
          </Alert>
        ) : null}

        {result.resumen ? (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Resumen
            </Typography>
            <Typography variant="body2">
              Total procesados: {result.resumen.totalProcesados}
            </Typography>
            <Typography variant="body2">
              Registrados: {result.resumen.registrados}
            </Typography>
            <Typography variant="body2">
              No registrados: {result.resumen.noRegistrados}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Equipos agregados: {result.resumen.equiposAgregados}
            </Typography>
          </>
        ) : null}

        {hasErrors ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Registros no importados
            </Typography>
            <List dense sx={{ maxHeight: 320, overflowY: "auto" }}>
              {result.noRegistrados?.map((item, index) => {
                const fila = item.datos?.filaExcel;
                const hoja = item.datos?.hojaExcel;
                const prefix = fila ? `Fila ${fila}` : `Registro ${index + 1}`;
                const inventory = item.inventario ? ` | Inventario: ${item.inventario}` : "";
                const sheet = hoja ? ` | Hoja: ${hoja}` : "";

                return (
                  <ListItem key={`${item.inventario ?? "sin-inventario"}-${index}`} disableGutters>
                    <ListItemText
                      primary={`${prefix}${sheet}${inventory}`}
                      secondary={item.motivo}
                    />
                  </ListItem>
                );
              })}
            </List>
          </>
        ) : null}

        {hasWarnings ? (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Advertencias de asociación
            </Typography>
            <List dense sx={{ maxHeight: 240, overflowY: "auto" }}>
              {result.advertencias?.map((item, index) => (
                <ListItem key={`${item.inventario ?? "sin-inventario"}-warning-${index}`} disableGutters>
                  <ListItemText
                    primary={item.inventario ? `Inventario: ${item.inventario}` : `Registro ${index + 1}`}
                    secondary={item.motivo}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportResultDialog;
