import {SyntheticEvent, FC,useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Alert,
} from "@mui/material";
import {Autocomplete, TextField, Box} from '@mui/material';
import { Periferico } from "../../../../types";
import { useNavigate } from "react-router-dom";

interface ModalConfirmationProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  perifericos: Periferico[];
  steps: string[]
}

export const ModalAgregarBodega: FC<ModalConfirmationProps> = ({
  open,
  onClose,
  title = "Agregar Bodega",
  perifericos = [],
  steps = []
}) => {
  const [selectedPeriferico, setSelectedPeriferico] =
    useState<Periferico | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const hasPerifericos = Array.isArray(perifericos) && perifericos.length > 0;
  
  
  const handlePerifericoChange = (
      _event: SyntheticEvent<Element, Event>,
      newValue: Periferico | null
    ) => {
      setSelectedPeriferico(newValue);
  };

    const handleConfirm = () => {
      if (!selectedPeriferico) {
        setError("Por favor, selecciona un periférico antes de continuar");
        return;
      }
      setError(null);
      let state = {};
      if (selectedPeriferico.nombre === 'Laptop' || selectedPeriferico.nombre === 'Computadora') {
        steps = [
          "Datos de inventario",
          "Información general",
          "Componentes",
        ];
        state = { periferico: selectedPeriferico, perifericos, tipoInventario: "bodega" ,steps};
        navigate('/FormLC', { state });
      } else if(selectedPeriferico.nombre === 'Switch' || selectedPeriferico.nombre === 'AP'){
        steps = [
          "Datos de inventario",
          "Información general",
        ];
        state = { periferico: selectedPeriferico, perifericos, tipoInventario: "bodega", steps};
        navigate('/FormSAP', { state });
    }else {
        steps = [
          "Datos de inventario"
        ];
        state = { periferico: selectedPeriferico, perifericos, tipoInventario: "bodega",steps };
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
      <Box sx={{ width: "100%" , height:"280"}}>
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
              sx={{ width: "100%" , height:200}}
              value={selectedPeriferico}
              onChange={handlePerifericoChange}
              renderInput={(params) => (
                <TextField {...params} label="Periférico" variant="outlined" />
              )}
              noOptionsText="No se encontraron periféricos"
              loadingText="Cargando periféricos..."
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
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
            disabled={!hasPerifericos || !selectedPeriferico}
          >
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}