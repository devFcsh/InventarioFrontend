import React from "react";
import { TextField, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const Step1DatosInventario = () => {
  return (
    <Box>
      <TextField label="Nombre del Activo" fullWidth margin="normal" />
      <TextField label="Código de Inventario" fullWidth margin="normal" />
    </Box>
  );
};

export default Step1DatosInventario;
