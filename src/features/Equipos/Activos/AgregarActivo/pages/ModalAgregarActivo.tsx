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
import { useNavigate } from "react-router-dom";

interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  perifericos: Periferico[];
}

export const ModalAgregarActivo: React.FC<ModalConfirmationProps> = ({
  open,
  onClose,
  title = "Agregar activo",
  perifericos = []
}) => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const hasPerifericos = Array.isArray(perifericos) && perifericos.length > 0;
  
  const [selectedPeriferico, setSelectedPeriferico] =
    useState<Periferico | null>(null);
  
  const handlePerifericoChange = (
      _event: React.SyntheticEvent<Element, Event>,
      newValue: Periferico | null
    ) => {
      setSelectedPeriferico(newValue);
  };

    const handleConfirm = () => {
      if (!selectedPeriferico) {
        setError("Por favor, selecciona un periférico antes de continuar");
        return;
      }
      setError(null);
      console.log(selectedPeriferico.nombre)
  
      if (selectedPeriferico.nombre === 'Laptop' || selectedPeriferico.nombre === 'Computadora') {
        navigate('/FormActivosLC');
      } else if (['Proyector', 'Teclado', 'Mouse', 'Monitor'].includes(selectedPeriferico.nombre)) {
        navigate('/FormActivosPMTM'); 
      }
      
      onClose();
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
              options={perifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              sx={{ width: 500 , height:200}}
              value={selectedPeriferico}
              onChange={handlePerifericoChange}
              renderInput={(params) => (
                <TextField {...params} label="Periférico" variant="outlined" />
              )}
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