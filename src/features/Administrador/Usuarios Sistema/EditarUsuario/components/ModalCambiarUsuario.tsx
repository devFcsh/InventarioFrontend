import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Autocomplete, TextField } from "@mui/material";
import useUsos from "@hooks/useUsos";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import { Uso, Usuario } from "../../../../../types"; 
import { useSnackbar } from "@context/SnackbarContext";

interface ModalCambiarUsuarioProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (usuarioId: string) => void;
}

const ModalCambiarUsuario: React.FC<ModalCambiarUsuarioProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedUso, setSelectedUso] = useState<string | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<string | null>(null); 

  const { usos } = useUsos(); 
  const { usuarios } = useUsuariosPorUso(selectedUso || ""); 
  const { showMessage } = useSnackbar();

  useEffect(() => {
    if (!open) {
      setSelectedUso(null);
      setSelectedUsuario(null);
    }
  }, [open]);

  const handleUsoChange = (_: React.SyntheticEvent<Element, Event>, newValue: Uso | null) => {
    setSelectedUso(newValue ? newValue.id_uso : null);
    setSelectedUsuario(null); 
  };

  const handleUsuarioChange = (_: React.SyntheticEvent<Element, Event>, newValue: Usuario | null) => {
    setSelectedUsuario(newValue ? newValue.id_usuario : null);
  };

  const handleConfirmar = () => {
    if (selectedUso && selectedUsuario) {
      onConfirm(selectedUsuario); 
    } else {
      showMessage("Por favor, selecciona un Uso y un Usuario.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Seleccione el nuevo usuario:</DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <Autocomplete
            size="small"
            options={usos}
            getOptionLabel={(option) => option?.nombre || ""}
            value={usos.find((uso) => uso?.id_uso === selectedUso) || null}
            onChange={handleUsoChange}
            renderInput={(params) => (
              <TextField {...params} label="Uso" variant="outlined" fullWidth />
            )}
          />
        </div>
        <div className="mb-4">
          <Autocomplete
            size="small"
            options={usuarios}
            getOptionLabel={(option) => option?.nombre || ""}
            value={usuarios.find((usuario) => usuario?.id_usuario === selectedUsuario) || null}
            onChange={handleUsuarioChange}
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" fullWidth />
            )}
            disabled={!selectedUso} 
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleConfirmar} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCambiarUsuario;
