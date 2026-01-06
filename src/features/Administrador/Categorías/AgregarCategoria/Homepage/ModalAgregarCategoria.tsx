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
import useEdificios from "@hooks/useEdificios";
import { Edificio, Marca, Modelo, Periferico, SistemaOperativo } from "../../../../../types";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
import usePerifericos from "@hooks/usePerifericos";
import { useAgregarMarca } from "../hooks/useAgregarMarca";
import { useAgregarModelo } from "../hooks/useAgregarModelo";
import { useAgregarUbicacion } from "../hooks/useAgregarUbicacion";
import { useAgregarLampara } from "../hooks/useAgregarLampara";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import { useAgregarActividadMantenimiento } from "../../../../Equipos/Activos/MantenimientoActivo/hooks/useAgregarActividadMantenimiento";

interface ModalAgregarCategoriaProps {
  open: boolean;
  onClose: () => void;
  selectedCategoria: string | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleCloseCancelarModalAgregar: () => void;
}

const ModalAgregarCategoria: FC<ModalAgregarCategoriaProps> = ({
  open,
  onClose,
  selectedCategoria,
  error,
  setError,
  handleCloseCancelarModalAgregar,
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
  const [tipoActividad, setTipoActividad] = useState<string>("");
  const [selectedPerifericoActividad, setSelectedPerifericoActividad] = useState<Periferico | null>(null);

  const { perifericos } = usePerifericos(); 
  const { edificios } = useEdificios();
  const { sistemasOperativos } = useSistemasOperativos();

  const { marcas } = useMarcasPorPeriferico(selectedPeriferico?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
  selectedMarca?.id_marca ?? "",
  selectedPeriferico?.id_periferico ?? ""
);

  const { agregarLampara } = useAgregarLampara();
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
  const { agregarActividad } = useAgregarActividadMantenimiento();

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
      case "Ubicación":
        return agregarUbicacion ;
      case "Procesador":
        return agregarProcesador;
      case "Marca":
        return agregarMarca;
      case "Modelo":
        return agregarModelo;
      case "Lampara":
        return agregarLampara;
      case "Actividad de Mantenimiento":
        return agregarActividad;
      default:
        return null;
    }
  };

  const handleAgregarOption = async () => {

    if (
      !capacidad && !ramTipo && selectedCategoria === "RAM") {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !capacidad && selectedCategoria === "Disco" ) {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !newOption && selectedCategoria !== "Disco" && selectedCategoria !== "RAM") {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !selectedSO?.id_sistemaoperativo && selectedCategoria === "Versión SO" ) {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !selectedEdificio?.id_edificio && selectedCategoria === "Ubicación" ) {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !selectedMarca?.id_marca && selectedCategoria === "Modelo" ) {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !selectedModelo?.id_modelo && (selectedCategoria === "Serie" || selectedCategoria === "Lampara") ) {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !newOption && selectedCategoria === "Actividad de Mantenimiento" ) {
      setError("Por favor, ingrese una subcategoría válida.");
      return;
    }

    if (
      !tipoActividad && selectedCategoria === "Actividad de Mantenimiento" ) {
      setError("Por favor, seleccione el tipo de actividad.");
      return;
    }

    try {
      if (selectedCategoria === "Actividad de Mantenimiento") {
        await agregarActividad({
          nombre: newOption,
          id_periferico: selectedPerifericoActividad?.id_periferico ? Number(selectedPerifericoActividad.id_periferico) : null,
          tipo: tipoActividad,
        });
        onClose();
        return;
      }

    const agregarFunc = getAgregarFunction(selectedCategoria || "");
    if (!agregarFunc) {
      setError("Función no definida para esta categoría.");
      return;
    }
      if (selectedCategoria === "RAM") {
        await agregarFunc({
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
        await agregarFunc({
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
        await agregarFunc({
          nombre: newOption,
          sistemaoperativoId: Number(selectedSO?.id_sistemaoperativo),
          capacidad: "",
          tipo: "",
          edificioId: 0,
          perifericoId: 0,
          marcaId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Ubicación") {
        await agregarFunc({
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
        await agregarFunc({
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
        await agregarFunc({
          nombre: newOption,
          marcaId: Number(selectedMarca?.id_marca),
          sistemaoperativoId: 0,
          capacidad: "",
          tipo: "",
          perifericoId: 0,
          edificioId: 0,
          modeloId: 0,
        });
      } else if (selectedCategoria === "Serie" || selectedCategoria === "Lampara") {
        await agregarFunc({
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
        await agregarFunc({
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
      onClose();
    } catch (err) {
      setError("Error al agregar la subcategoría.");
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
      setTipoActividad("");
      setSelectedPerifericoActividad(null);
    }
  }, [open]);

  const handleMarcaChange = (_event: React.SyntheticEvent<Element, Event>,
    newValue: Marca | null) => {
    setSelectedMarca(newValue);
    setSelectedModelo(null);
  };

  const handleModeloChange = (_event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null) => {
    setSelectedModelo(newValue);
  };

  return (
    <Dialog open={open} onClose={handleCloseCancelarModalAgregar}>
      <DialogTitle>Agregar {selectedCategoria || "Elemento"}</DialogTitle>
      <DialogContent className="h-auto">
        {selectedCategoria === "RAM" ? (
            <Box className="flex flex-col mt-2 gap-3">
            <TextField
              label="Tipo de RAM"
              variant="outlined"
              error={!!error}
              helperText={error && "Por favor ingrese un tipo de ram"}
              fullWidth
              value={ramTipo}
              onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 20) {
                return;
              }
              setRamTipo(value);
              }}
            />
            <TextField
              label="Capacidad"
              variant="outlined"
              error={!!error}
              helperText={error && "Por favor ingrese una capacidad"}
              fullWidth
              value={capacidad}
              onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 6) {
                return;
              }
              setCapacidad(value);
              }}
            />
            </Box>
        ) : selectedCategoria === "Disco" ? (
            <Box className="flex flex-col mt-2 gap-3">
            <TextField
              label="Capacidad"
              variant="outlined"
              error={!!error}
              helperText={error && "Por favor ingrese una capacidad"}
              fullWidth
              value={capacidad}
              onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 20) {
                return;
              }
              setCapacidad(value);
              }}
            />
            </Box>
        ) : selectedCategoria === "Ubicación" ? (
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
              label="Ubicación"
              variant="outlined"
              fullWidth
              disabled={!selectedEdificio}
              value={newOption}
              onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 20) {
                return;
              }
              setNewOption(e.target.value);
              }}
              error={!!error}
              helperText={error && "Por favor seleccionar una ubicación"}
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
              onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 20) {
                return;
              }
              setNewOption(e.target.value);
              }}
              error={!!error}
              helperText={error && "Por favor seleccionar una versión"}
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
                  error={!!error}
                  helperText={error && "Por favor seleccione un periférico"}
                  fullWidth
                />
              )}
            />
            <TextField
              label="Nombre de Marca"
              variant="outlined"
              error={!!error}
              helperText={error && "Por favor ingrese una marca"}
              fullWidth
              disabled={!selectedPeriferico}
              value={newOption}
              onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 30) {
                return;
              }
              setNewOption(e.target.value);
              }}
            />
          </Box>
        ) : selectedCategoria === "Modelo" ? (
          <Box className="flex flex-col mt-2 gap-3">
         <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(_, newValue) => {
                setSelectedPeriferico(newValue);
                setSelectedMarca(null);
                setSelectedModelo(null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Periférico" variant="outlined" error={!!error}
                helperText={error && "Por favor seleccionar un periférico"} fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={marcas}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedMarca}
              onChange={handleMarcaChange}
              renderInput={(params) => (
                <TextField {...params} label="Marca" variant="outlined" error={!!error}
                helperText={error && "Por favor seleccionar una marca"} fullWidth />
              )}
              disabled={!selectedPeriferico}
            />
            <TextField
              label="Nombre del Modelo"
              variant="outlined"
              error={!!error}
                  helperText={error && "Por favor ingrese un modelo"}
              fullWidth
              value={newOption}
              onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 30) {
                return;
              }
              setNewOption(e.target.value);
              }}
            />
          </Box>
        ) : selectedCategoria === "Serie" || selectedCategoria === "Lampara" ? (
          <Box className="flex flex-col mt-2 gap-3">
           <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(_, newValue) => {
                setSelectedPeriferico(newValue);
                setSelectedMarca(null);
                setSelectedModelo(null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Periférico" variant="outlined" error={!!error}
                helperText={error && "Por favor seleccionar un periférico"} fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={marcas}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedMarca}
              onChange={handleMarcaChange}
              renderInput={(params) => (
                <TextField {...params} label="Marca" variant="outlined" error={!!error}
                helperText={error && "Por favor seleccionar una marca"} fullWidth />
              )}
              disabled={!selectedPeriferico}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={modelos}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedModelo}
              onChange={handleModeloChange}
              renderInput={(params) => (
                <TextField {...params} label="Modelo" variant="outlined" error={!!error}
                helperText={error && "Por favor seleccionar un modelo"} fullWidth />
              )}
              disabled={!selectedMarca}
            />
          </Box>
        ) : selectedCategoria === "Actividad de Mantenimiento" ? (
          <Box className="flex flex-col mt-2 gap-3">
            <TextField
              label="Nombre de la Actividad"
              variant="outlined"
              fullWidth
              value={newOption}
              onChange={(e) => {
                const value = e.target.value;
                if (value !== null && value.length > 100) {
                  return;
                }
                setNewOption(e.target.value);
              }}
              error={Boolean(error)}
              helperText={error}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={["Preventivo", "Correctivo"]}
              getOptionLabel={(option) => option}
              value={tipoActividad || null}
              onChange={(_, newValue) => setTipoActividad(newValue || "")}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Tipo de Actividad" 
                  variant="outlined" 
                  error={Boolean(error)}
                  helperText={error && "Por favor seleccione el tipo de actividad"}
                  fullWidth 
                />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              value={selectedPerifericoActividad}
              onChange={(_, newValue) => setSelectedPerifericoActividad(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Periférico (Opcional)" 
                  variant="outlined" 
                  fullWidth 
                />
              )}
            />
          </Box>
        ) : (
          <Box className="flex flex-col mt-2 gap-3">"
          <TextField
            label={`Nuevo ${selectedCategoria || "Elemento"}`}
            variant="outlined"
            fullWidth
            value={newOption}
            onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 20) {
                return;
              }
              setNewOption(e.target.value);
              }}
            error={Boolean(error)}
            helperText={error}
          />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseCancelarModalAgregar} color="primary">
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