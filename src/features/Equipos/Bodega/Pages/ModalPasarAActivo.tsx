import React, { useState, useRef } from "react";
import { Modal, Box, TextField, Button, Autocomplete, Typography } from "@mui/material";
import useSubirImagen from "@hooks/useSubirImagen";
import { usePasarBodegaAActivo } from "../hooks/usePasarBodegaAActivo";
import { Edificio, Ubicacion } from "../../../../types";
import useEdificios from "@hooks/useEdificios";
import useUbicaciones from "@hooks/useUbicaciones";
import useUsos from "@hooks/useUsos";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import { useSnackbar } from "@context/SnackbarContext";

interface ModalPasarAActivoProps {
  equipoId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModalPasarAActivo: React.FC<ModalPasarAActivoProps> = ({ equipoId, open, onClose, onSuccess }) => {
  const { pasarBodegaAActivo } = usePasarBodegaAActivo();
  const { uploadImage } = useSubirImagen();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null);
  const [selectedUsoId, setSelectedUsoId] = useState<string | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");
  const { usos } = useUsos();
  const { usuarios } = useUsuariosPorUso(selectedUsoId ?? "");

  const { showMessage } = useSnackbar();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCambiarActivo = async () => {
    if (!selectedEdificio || !selectedUbicacion || !selectedUsoId || !selectedUsuarioId) {
      showMessage("Por favor, complete todos los campos.", "error");
      return;
    }

    let imagePath = "";
    if (image) {
      try {
        imagePath = await uploadImage(image);
      } catch (error) {
        showMessage("Error al subir la imagen. Por favor, inténtelo de nuevo.", "error");
        return;
      }
    }

    try {
      await pasarBodegaAActivo(equipoId ? equipoId : "", selectedUsuarioId, selectedUbicacion.id_ubicacion, imagePath);
      showMessage("Equipo activado exitosamente", "success");
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      showMessage("Error: No se puede pasar a activo un componente ligado a una computadora", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
        <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 24,
          padding: 4,
          width: 400,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ marginBottom: 3 }}>
          Pasar Equipo a Activos
        </Typography>

        <Autocomplete
          size="small"
          options={edificios}
          getOptionLabel={(option) => option?.nombre || ""}
          value={selectedEdificio}
          onChange={(_, newValue) => setSelectedEdificio(newValue)}
          renderInput={(params) => <TextField {...params} label="Edificio" variant="outlined" />}
          sx={{ marginBottom: 2 }}
        />

        <Autocomplete
          size="small"
          options={ubicaciones}
          getOptionLabel={(option) => option?.nombre || ""}
          value={selectedUbicacion}
          onChange={(_, newValue) => setSelectedUbicacion(newValue)}
          renderInput={(params) => <TextField {...params} label="Ubicación" variant="outlined" />}
          disabled={!selectedEdificio}
          sx={{ marginBottom: 2 }}
        />

        <Autocomplete
          size="small"
          options={usos}
          getOptionLabel={(option) => option?.nombre || ""}
          value={selectedUsoId ? usos.find((ul) => ul?.id_uso === selectedUsoId) : null}
          onChange={(_, newValue) => setSelectedUsoId(newValue ? newValue.id_uso : null)}
          renderInput={(params) => <TextField {...params} label="Uso" variant="outlined" />}
          sx={{ marginBottom: 2 }}
        />

        <Autocomplete
          size="small"
          options={usuarios}
          getOptionLabel={(option) => option?.nombre || ""}
          value={selectedUsuarioId ? usuarios.find((ul) => ul?.id_usuario === selectedUsuarioId) : null}
          onChange={(_, newValue) => setSelectedUsuarioId(newValue ? newValue.id_usuario : null)}
          renderInput={(params) => <TextField {...params} label="Usuario" variant="outlined" />}
          sx={{ marginBottom: 2 }}
        />

        <div className="mb-4">
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Imagen
          </Typography>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <div
              onClick={handleImageClick}
              className="w-full max-w-sm h-48 border border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-500">Haz clic para cargar una imagen</p>
              )}
            </div>
          </div>
        </div>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
          <Button variant="outlined" onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCambiarActivo}
            color="primary"
          >
            Cambiar a Activo
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalPasarAActivo;
