// ModalAgregar.tsx
import { FC, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useAgregarUso } from "../hooks/useAgregarUso";
import { useAgregarDominio } from "../hooks/useAgregarDominio";
import { useAgregarPeriferico } from "../hooks/useAgregarPeriferico";
import { useAgregarEdificio } from "../hooks/useAgregarEdificio";
import { useAgregarSistemaOperativo } from "../hooks/useAgregarSIstemaOperativo";
import { useAgregarVersionOffice } from "../hooks/useAgregarVersionOffice";
import { useAgregarDisco } from "../hooks/useAgregarDisco";
import { useAgregarRAM } from "../hooks/useAgregarRAM";

interface ModalAgregarCategoriaProps {
  open: boolean;
  onClose: () => void;
  selectedCategoria: string | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ModalAgregarCategoria: FC<ModalAgregarCategoriaProps> = ({
  open,
  onClose,
  selectedCategoria,
  error,
  setError
}) => {

  const [ramTipo, setRamTipo] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [newOption, setNewOption] = useState<string>("");

  const { agregarUso } = useAgregarUso();
  const { agregarDominio } = useAgregarDominio();
  const { agregarPeriferico } = useAgregarPeriferico();
  const { agregarEdificio } = useAgregarEdificio();
  const { agregarSistemaOperativo } = useAgregarSistemaOperativo();
  const { agregarVersionOffice } = useAgregarVersionOffice();
  const { agregarDisco } = useAgregarDisco();
  const { agregarRam } = useAgregarRAM();

  const getAgregarFunction = (categoria: string) => {
    switch (categoria) {
      case "Uso":
        return agregarUso;
      case "Dominio":
        return agregarDominio;
      case "Edificio":
        return agregarEdificio;
      case "Periférico":
        return agregarPeriferico;
      case "Sistema Operativo":
        return agregarSistemaOperativo;
      case "Versión Office":
        return agregarVersionOffice;
      case "RAM":
        return agregarRam;
      case "Disco":
        return agregarDisco;
      case "Marca":
        return null;
      case "Modelo":
        return null;
      case "Serie":
        return null;
      case "Aula":
        return null;
      case "Versión SO":
        return null;
      case "Antivirus":
        return null;
      case "Version Office":
        return null;
      default:
        return null;
    }
  };

  const handleAgregarOption = async () => {
    if (
      !newOption.trim() &&
      selectedCategoria !== "RAM" &&
      selectedCategoria !== "Disco"
    ) {
      setError("Por favor, ingrese una opción válida.");
      return;
    }

    const agregarFunc = getAgregarFunction(selectedCategoria || "");
    if (!agregarFunc) {
      setError("Función no definida para esta categoría.");
      return;
    }
    try {
      let result;
      if (selectedCategoria === "RAM") {
        result = await agregarFunc({
          tipo: ramTipo,
          capacidad: capacidad,
          nombre: "",
        });
      } else if (selectedCategoria === "Disco") {
        result = await agregarFunc({
          capacidad: capacidad,
          nombre: "",
          tipo: "",
        });
      } else {
        result = await agregarFunc({
          nombre: newOption,
          tipo: "",
          capacidad: "",
        });
      }
      console.log("Nueva opción agregada:", result);
      onClose();
    } catch (err) {
      setError("Error al agregar la opción.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar {selectedCategoria || "Elemento"}</DialogTitle>
      <DialogContent>
        {selectedCategoria === "RAM" ? (
          <>
            <TextField
              label="Tipo de RAM"
              variant="outlined"
              fullWidth
              value={ramTipo}
              onChange={(e) => setRamTipo(e.target.value)}
            />
            <TextField
              label="Capacidad"
              variant="outlined"
              fullWidth
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
            />
          </>
        ) : selectedCategoria === "Disco" ? (
          <TextField
            label="Capacidad"
            variant="outlined"
            fullWidth
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
          />
        ) : (
          <TextField
            label={`Nuevo ${selectedCategoria || "Elemento"}`}
            variant="outlined"
            fullWidth
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAgregarOption} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalAgregarCategoria;
