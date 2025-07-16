import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar",
  message = "¿Estás seguro?",
  loading = false
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <p>{message}</p>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button disabled={loading} onClick={onConfirm} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirmation;
