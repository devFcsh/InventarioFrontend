import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useState } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (observation: string) => void; // Modificamos para pasar la observación directamente
  title?: string;
  message?: string;
}

export const ModalObservation: React.FC<ModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Agregar observación",
  message,
}) => {
  const [newObservation, setNewObservation] = useState<string>("");
  const [addObservation, setAddObservation] = useState<boolean>(false);
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<string | null>(null);

  const handleAddObservationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === "yes";
    setAddObservation(value);
    if (!value) {
      setNewObservation("");
    }
  };

  const handleConfirm = () => {
    if (addObservation && newObservation.length <= 200) {
      onConfirm(newObservation); // Pasamos la observación directamente
    } else if (!addObservation) {
      onConfirm(""); // Si no hay observación, pasamos string vacío
    } else {
      setErrorMensajeComponente("La observación no puede tener más de 200 caracteres.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <div className="flex-1 space-y-4 m-4">
            <RadioGroup row value={addObservation ? "yes" : "no"} onChange={handleAddObservationChange}>
              <FormControlLabel value="yes" control={<Radio />} label="Sí" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>

            {addObservation && (
              <TextField
                label="Observación"
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                error={!!errorMensajeComponente}
                helperText={errorMensajeComponente}
              />
            )}
          </div>
        </Box>
      </DialogContent>

      <DialogActions sx={{ mt: '-10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 2, pb: 2 }}>
          <Button onClick={onClose} color="error" variant="contained" size="large">Cancelar</Button>
          <Button onClick={handleConfirm} fullWidth variant="contained" sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#45a049" } }}>
            Agregar Activo
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
