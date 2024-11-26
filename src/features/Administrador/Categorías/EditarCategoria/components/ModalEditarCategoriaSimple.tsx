import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { Autocomplete, Box } from '@mui/material';

interface ModalEditarCategoriaSimpleProps {
  open: boolean;
  onClose: () => void;
  title: string;
  categorias: string[];
  agregarCategoria: (nombreCategoria: string) => void;
}

export const ModalEditarCategoriaSimple: React.FC<ModalEditarCategoriaSimpleProps> = ({
  open,
  onClose,
  title,
  categorias,
  agregarCategoria,
}) => {
  const [categoriaNombre, setCategoriaNombre] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCategoriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoriaNombre(event.target.value);
  };

  const handleConfirm = () => {
    if (!categoriaNombre.trim()) {
      setError("Por favor, ingresa un nombre para la nueva categoría.");
      return;
    }

    setError(null);
    agregarCategoria(categoriaNombre);
    setCategoriaNombre(""); 
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <p className="text-2xl font-semibold">{title}</p>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <Autocomplete
            size="small"
            disablePortal
            options={categorias}
            getOptionLabel={(option) => option || ""}
            renderInput={(params) => (
              <TextField {...params} label="Categorías actuales" variant="outlined" disabled />
            )}
            noOptionsText="No se encontraron categorías"
          />
          <br />
          <TextField
            label="Nueva categoría"
            variant="outlined"
            value={categoriaNombre}
            onChange={handleCategoriaChange}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ mt: '-10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 2, pb: 2 }}>
          <Button onClick={onClose} color="error" variant="contained" size="large">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            size="large"
            disabled={!categoriaNombre.trim()}
          >
            Agregar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
