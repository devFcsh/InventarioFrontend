import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Alert,
  Autocomplete, TextField, Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Periferico, Edificio, Uso } from "../../../../../types/index";

interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  perifericos: Periferico[];
  usos: Uso[];
  edificios: Edificio[];
  steps: string[]
}


export const ModalAgregarActivo: React.FC<ModalConfirmationProps> = ({
  open,
  onClose,
  title = "Agregar activo",
  perifericos = [],
  usos = [],
  edificios = [],
  steps = []
}) => {
  const [selectedPeriferico, setSelectedPeriferico] =
    useState<Periferico | null>(null);
  const [selectedEdificio, setSelectedEdificio] =
    useState<Edificio | null>(null);
  const [selectedUso, setSelectedUso] =
    useState<Uso | null>(null);
  const [errors, setErrors] = useState({
    perifericoError: "",
    usoError: "",
    edificioError: ""
  });
  const navigate = useNavigate();
  const hasPerifericos = Array.isArray(perifericos) && perifericos.length > 0;

  const handlePerifericoChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Periferico | null
  ) => {
    setSelectedPeriferico(newValue);
  };
  const handleUsoChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Uso | null
  ) => {
    setSelectedUso(newValue);
  };
  const handleEdificioChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Edificio | null
  ) => {
    setSelectedEdificio(newValue);
  };

  const handleConfirm = () => {
    if (!selectedPeriferico) {
      setErrors({
        ...errors,
        perifericoError: "Por favor, selecciona un periférico antes de continuar"
      });
      return;
    }
    if (!selectedEdificio) {
      setErrors({
        ...errors,
        edificioError: "Por favor, selecciona un edificio antes de continuar"
      });
      return;
    }
    
    if(selectedPeriferico?.nombre!=="Switch" && selectedPeriferico?.nombre!=="AP"){
        if (!selectedUso) {
          setErrors({
            ...errors,
            usoError: "Por favor seleccionar el uso antes de continuar"
          });
          return;
        }
    }else{
      setErrors({
        ...errors,
        usoError: ""
      });
    }
    setErrors({
      perifericoError: "",
      usoError: "",
      edificioError: ""
    });
    let state = {};
    if (selectedPeriferico.nombre === 'Laptop' || selectedPeriferico.nombre === 'Computadora') {
      steps = [
        "Datos de inventario",
        "Información general",
        "Cargar imagen",
        "Componentes",
      ];
      state = { periferico: selectedPeriferico, perifericos, tipoInventario: "activo", steps, edificio: selectedEdificio, uso: selectedUso };
      navigate('/FormLC', { state });
    } else if(selectedPeriferico.nombre === 'Switch' || selectedPeriferico.nombre === 'AP'){
        steps = [
          "Datos de inventario",
          "Información general",
          "Cargar imagen"
        ];
        state = { periferico: selectedPeriferico, perifericos, tipoInventario: "activo", steps, edificio: selectedEdificio, uso: selectedUso };
        navigate('/FormSAP', { state });
    }else {
      steps = [
        "Datos de inventario",
        "Cargar imagen",
      ];
      state = { periferico: selectedPeriferico, perifericos, tipoInventario: "activo", steps, edificio: selectedEdificio, uso: selectedUso };
      navigate('/FormPMTM', { state });
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
        <Box sx={{ width: "100%", height: "280" }}>
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
                sx={{ width: "100%", marginBottom: 2 }}
                value={selectedPeriferico}
                onChange={handlePerifericoChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Periférico"
                    variant="outlined"
                    error={!!errors.perifericoError}
                    helperText={errors.perifericoError ? "Por favor seleccionar un periférico" : ""}
                  />
                )}
                noOptionsText="No se encontraron periféricos"
                loadingText="Cargando periféricos..."
              />
              <Autocomplete
                size="small"
                disablePortal
                options={edificios}
                getOptionLabel={(option) => option ? option.nombre : ""}
                value={selectedEdificio}
                sx={{ width: "100%", marginBottom: 2 }}
                onChange={handleEdificioChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Edificio"
                    variant="outlined"
                    error={!!errors.edificioError}
                    helperText={errors.edificioError ? "Por favor seleccionar un edificio" : ""}
                    fullWidth
                  />
                )}
              />
              {
                selectedPeriferico?.nombre !== 'Switch' && selectedPeriferico?.nombre !== "AP"?
                <Autocomplete
                size="small"
                disablePortal
                options={usos}
                value={selectedUso}
                sx={{ width: "100%", marginBottom: 2 }}
                onChange={handleUsoChange}
                getOptionLabel={(option) => option ? option.nombre : ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Uso"
                    variant="outlined"
                    error={!!errors.usoError}
                    helperText={errors.usoError ? "Por favor seleccionar un uso" : ""}
                    fullWidth
                  />
                )}
              />

                :""
              }
              </>
          )}
        </Box>
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
            disabled={!hasPerifericos || !selectedPeriferico || !selectedEdificio}
          >
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}