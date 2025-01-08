import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
} from "@mui/material";
import { useAgregarUso } from "../hooks/useAgregarUso";
import { useAgregarDominio } from "../hooks/useAgregarDominio";
import { useAgregarPeriferico } from "../hooks/useAgregarPeriferico";
import { useAgregarEdificio } from "../hooks/useAgregarEdificio";
import { useAgregarSistemaOperativo } from "../hooks/useAgregarSIstemaOperativo";
import { useAgregarVersionOffice } from "../hooks/useAgregarVersionOffice";
import { useAgregarDisco } from "../hooks/useAgregarDisco";
import { useAgregarRAM } from "../hooks/useAgregarRAM";
import { useAgregarVersionSO } from "../hooks/useAgregarVersionSO";
import { useAgregarProcesador } from "../hooks/useAgregarProcesador";
import { useAgregarUbicacion } from "../hooks/useAgregarUbicacion";
import useEdificios from "@hooks/useEdificios";
import { Edificio, Marca, Modelo, Periferico, SistemaOperativo } from "../../../../../types";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
import useMarcas from "@hooks/useMarcas";
import usePerifericos from "@hooks/usePerifericos";
import useModelos from "@hooks/useModelos";
import { useAgregarMarca } from "../hooks/useAgregarMarca";
import { useAgregarModelo } from "../hooks/useAgregarModelo";
import { useAgregarSerie } from "../hooks/useAgregarSerie";

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
  setError,
}) => {
  const [selectedSO, setSeletedSO] = useState<SistemaOperativo | null>(null);
  const [selectedEdificio, setSeletedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [selectedPeriferico, setSelectedPeriferico] = useState<Periferico | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<Modelo | null>(null);

  const [ramTipo, setRamTipo] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [newOption, setNewOption] = useState<string>("");

  const { modelos } = useModelos();
  const { perifericos } = usePerifericos();
  const { marcas } = useMarcas();
  const { edificios } = useEdificios();
  const { sistemasOperativos } = useSistemasOperativos();

  const { agregarUso } = useAgregarUso();
  const { agregarDominio } = useAgregarDominio();
  const { agregarPeriferico } = useAgregarPeriferico();
  const { agregarEdificio } = useAgregarEdificio();
  const { agregarSistemaOperativo } = useAgregarSistemaOperativo();
  const { agregarVersionOffice } = useAgregarVersionOffice();
  const { agregarDisco } = useAgregarDisco();
  const { agregarRam } = useAgregarRAM();
  const { agregarVersionSO } = useAgregarVersionSO();
  const { agregarUbicacion } = useAgregarUbicacion();
  const { agregarProcesador } = useAgregarProcesador();
  const { agregarMarca } = useAgregarMarca();
  const { agregarModelo } = useAgregarModelo();
  const { agregarSerie } = useAgregarSerie();

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
      case "Versión SO":
        return agregarVersionSO;
      case "Ubicacion":
        return agregarUbicacion ;
      case "Procesador":
        return agregarProcesador;
      case "Marca":
        return agregarMarca;
      case "Modelo":
        return agregarModelo;
      case "Serie":
        return agregarSerie;
      default:
        return null;
    }
  };

  const handleAgregarOption = async () => {
    /*
    if (
      !newOption.trim() &&
      selectedCategoria !== "RAM" &&
      selectedCategoria !== "Disco"
    ) {
      setError("Por favor, ingrese una opción válida.");
      return;
    }
    */

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
          sistemaoperativoId: 0,
          edificioId: 0,
          perifericoId: 0,
          marcaId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Disco") {
        result = await agregarFunc({
          capacidad: capacidad,
          nombre: "",
          tipo: "",
          sistemaoperativoId: 0,
          edificioId: 0,
          perifericoId: 0,
          marcaId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Versión SO") {
        console.log(selectedSO)
        result = await agregarFunc({
          nombre: newOption,
          sistemaoperativoId: Number(selectedSO?.id_sistemaoperativo),
          capacidad: "",
          tipo: "",
          edificioId: 0,
          perifericoId: 0,
          marcaId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Ubicacion") {
        result = await agregarFunc({
          nombre: newOption,
          edificioId: Number(selectedEdificio?.id_edificio),
          sistemaoperativoId: 0,
          capacidad: "",
          tipo: "",
          perifericoId: 0,
          marcaId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Marca") {
        result = await agregarFunc({
          nombre: newOption,
          perifericoId: Number(selectedPeriferico?.id_periferico),
          sistemaoperativoId: 0,
          capacidad: "",
          tipo: "",
          edificioId: 0,
          marcaId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Modelo") {
        result = await agregarFunc({
          nombre: newOption,
          marcaId: Number(selectedMarca?.id_marca),
          sistemaoperativoId: 0,
          capacidad: "",
          tipo: "",
          perifericoId: 0,
          edificioId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Serie") {
        result = await agregarFunc({
          nombre: newOption,
          modeloId: Number(selectedModelo?.id_modelo),
          edificioId: 0,
          sistemaoperativoId: 0,
          capacidad: "",
          tipo: "",
          perifericoId: 0,
          marcaId: 0,
        });
      } else {
        result = await agregarFunc({
          nombre: newOption,
          tipo: "",
          capacidad: "",
          sistemaoperativoId: 0,
          edificioId: 0,
          perifericoId: 0,
          marcaId: 0,
          modeloId: 0,
        });
      }
      console.log("Nueva opción agregada:", result);
      onClose();
    } catch (err) {
      setError("Error al agregar la opción.");
    }
  };

  useEffect(() => {
    if (!open) {
      setNewOption("");
      setSeletedEdificio(null);
      setCapacidad("");
      setSelectedMarca(null);
      setSelectedPeriferico(null);
      setSelectedModelo(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar {selectedCategoria || "Elemento"}</DialogTitle>
      <DialogContent className="h-auto">
        {selectedCategoria === "RAM" ? (
          <Box className="flex flex-col mt-2 gap-3">
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
          </Box>
        ) : selectedCategoria === "Disco" ? (
          <Box className="flex flex-col mt-2 gap-3">
          <TextField
            label="Capacidad"
            variant="outlined"
            fullWidth
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
          />
          </Box>
        ) : selectedCategoria === "Ubicacion" ? (
          <Box className="flex flex-col mt-2 gap-3">
            <Autocomplete
              size="small"
              disablePortal
              options={edificios}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedEdificio}
              onChange={(_, newValue) => {
                setSeletedEdificio(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Edificio"
                  variant="outlined"
                  error={!!error}
                  helperText={error && "Por favor seleccionar un edificio"}
                  fullWidth
                />
              )}
            />
            <TextField
              label="Ubicacion"
              variant="outlined"
              fullWidth
              disabled={!selectedEdificio}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              error={Boolean(error)}
              helperText={error}
            />
          </Box>
        ) : selectedCategoria === "Versión SO" ? (
          <Box className="flex flex-col mt-2 gap-3">
            <Autocomplete
              size="small"
              disablePortal
              options={sistemasOperativos}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedSO}
              onChange={(_, newValue) => {
                setSeletedSO(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sistema Operativo"
                  variant="outlined"
                  error={!!error}
                  helperText={
                    error && "Por favor seleccionar un sistema operativo"
                  }
                  fullWidth
                />
              )}
            />
            <TextField
              label="Versión Sistema Operativo"
              variant="outlined"
              fullWidth
              disabled={!selectedSO}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              error={Boolean(error)}
              helperText={error}
            />
          </Box>
         ) : selectedCategoria === "Marca" ? (
          <Box className="flex flex-col mt-2 gap-3">
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedPeriferico}
              onChange={(_, newValue) => {
                setSelectedPeriferico(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periférico"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <TextField
              label="Nombre de Marca"
              variant="outlined"
              fullWidth
              disabled={!selectedPeriferico}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
          </Box>
        ) : selectedCategoria === "Modelo" ? (
          <Box className="flex flex-col mt-2 gap-3">
          <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedPeriferico}
              onChange={(_, newValue) => {
                setSelectedPeriferico(newValue);
                setSelectedMarca(null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periférico"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={marcas}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedMarca}
              onChange={(_, newValue) => {
                setSelectedMarca(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marca"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled={!selectedPeriferico}
            />
            <TextField
              label="Nombre del Modelo"
              variant="outlined"
              fullWidth
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
          </Box>
        ) : selectedCategoria === "Serie" ? (
          <Box className="flex flex-col mt-2 gap-3">
           <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedPeriferico}
              onChange={(_, newValue) => {
                setSelectedPeriferico(newValue);
                setSelectedMarca(null);
                setSelectedModelo(null);

              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periférico"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={marcas}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedMarca}
              onChange={(_, newValue) => {
                setSelectedMarca(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marca"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled={!selectedPeriferico}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={modelos}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedModelo}
              onChange={(_, newValue) => setSelectedModelo(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Modelo"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled={!selectedPeriferico && !selectedMarca}
            />
            <TextField
              label="Nombre de Serie"
              variant="outlined"
              fullWidth
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
          </Box>
        ) : (
          <Box className="flex flex-col mt-2 gap-3">
          <TextField
            label={`Nuevo ${selectedCategoria || "Elemento"}`}
            variant="outlined"
            fullWidth
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          </Box>
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