import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";
import {Autocomplete, TextField, Box} from '@mui/material';
import { Periferico } from "../../../../../types/index";

interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  perifericos: Periferico[];
}

export const ModalAgregarActivo: React.FC<ModalConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Agregar activo",
  perifericos = []
}) => {
  const [perifericoId, setPerifericoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const hasPerifericos = Array.isArray(perifericos) && perifericos.length > 0;
  
  const selectedPeriferico = perifericoId 
    ? perifericos.find(p => p?.id_periferico === perifericoId)
    : null;

  const handleConfirm = () => {
    if (!selectedPeriferico) {
      setError("Por favor, selecciona un periférico antes de continuar");
      return;
    }
    setError(null);
    onConfirm();
  };


  return (
    <Dialog 
      open={open} 
      onClose={onClose}
    >
      <DialogTitle>
        <p className="text-2xl font-semibold">{title}</p>
      </DialogTitle>
      <DialogContent>
        <br />
        {!hasPerifericos ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No hay periféricos disponibles en este momento. Por favor, intenta más tarde.
          </Alert>
        ) : (
          <>
            <Autocomplete
              size="small"
              disablePortal
              sx={{ width: 500 , height:200}}
              options={perifericos}
              value={selectedPeriferico}
              onChange={(event, newValue) => {
                setPerifericoId(newValue ? newValue.id_periferico : null);
                setError(null); // Limpiar error cuando se selecciona algo
              }}
              getOptionLabel={(option) => option?.nombre || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periférico"
                  variant="outlined"
                  fullWidth
                  error={!!error}
                  helperText={error}
                />
              )}
              isOptionEqualToValue={(option, value) => 
                option?.id_periferico === value?.id_periferico
              }
              noOptionsText="No se encontraron periféricos"
              loadingText="Cargando periféricos..."
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ mt: '-10px' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          width: '100%',
          gap: 2,
          pb: 2
        }}>
          <Button 
            onClick={onClose} 
            color="error" 
            variant="contained" 
            size="large"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            color="primary" 
            variant="contained" 
            size="large"
            disabled={!hasPerifericos || !selectedPeriferico}
          >
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}