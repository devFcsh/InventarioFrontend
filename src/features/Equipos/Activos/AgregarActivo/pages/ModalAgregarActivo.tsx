import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';


interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ModalAgregarActivo: React.FC<ModalConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Agregar activo",
  message = "¿Estás seguro?",
}) => {
  const options = [
    {label: "Computadora"},
    {label: "Laptop"},
    {label: "Proyector"},
    {label: "Mouse"},
    {label: "Teclado"},
  ]
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle><p className="text-2xl font-semibold">{title}</p></DialogTitle>
      <DialogContent>
        <br />
        <Autocomplete
          disablePortal
          options={options}
          sx={{ width: 500 , height:200}}
          renderInput={(params) => <TextField {...params} label="Periférico" />}
        />
      </DialogContent>
      <DialogActions className="pb-5">
        <Box sx={{display: "flex",gap:5 }}>
            <Button onClick={onClose} color="error" variant="contained" size="large">
              Cancelar
            </Button>
            <Button onClick={onConfirm} color="primary" variant="contained" size="large">
              Confirmar
            </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
