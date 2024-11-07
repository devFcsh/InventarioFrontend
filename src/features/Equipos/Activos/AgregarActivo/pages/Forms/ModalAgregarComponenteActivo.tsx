import { Alert,Box, Button,Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import usePerifericos from "@hooks/usePerifericos";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import {
    Marca,
    Modelo,
    Serie,
    Periferico,
  
  } from "../../../../../../types";
  
import { useState } from 'react';
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import { Componente } from "../../../../../../types/Activo/Componente/index.ts";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    perifericos: Periferico[];
  }

export const ModalAgregarComponenteActivo: React.FC<ModalProps> = ({  open,
    onClose,
    title = "Agregar activo",
    perifericos = []
  })=> {
    
    const [componentes, setComponentes] = useState<Componente[]>([]);
    const eliminarComponente = (index: number) => {
        setComponentes(componentes.filter((_, i) => i !== index));
      };
      const limpiarCamposDependientesComponente = () => {
        setNuevoComponente({
          ...nuevoComponente,
          periferico: null,
          marca: null,
          modelo: null,
          serie: null,
          inventario: "",
        });
    };
    const [nuevoComponente, setNuevoComponente] = useState<Componente>({
        periferico: null,
        marca: null,
        modelo: null,
        serie: null,
        inventario: "",
      });
      const handleModeloComponenteChange = (
        _event: React.SyntheticEvent<Element, Event>,
        newValue: Modelo | null
      ) => {
        setNuevoComponente({ ...nuevoComponente, modelo: newValue, serie: null });
      };
    const handleMarcaComponenteChange = (
        _event: React.SyntheticEvent<Element, Event>,
        newValue: Marca | null
      ) => {
        setNuevoComponente({
          ...nuevoComponente,
          marca: newValue,
          modelo: null,
          serie: null,
        });
      };
      const { modelos: modelosComponente } = useModelosPorMarcaPeriferico(
        nuevoComponente.marca?.id_marca ?? "",
        nuevoComponente.periferico?.id_periferico ?? ""
      );
      const { marcas: marcasComponente } = useMarcasPorPeriferico(
        nuevoComponente.periferico?.id_periferico ?? ""
      );
      const { series: seriesComponente } = useSeriesPorModelo(
        nuevoComponente.periferico?.id_periferico ?? "",
        nuevoComponente.marca?.id_marca ?? "",
        nuevoComponente.modelo?.id_modelo ?? ""
      );
      const [errorMensajeComponente, setErrorMensajeComponente] = useState<
      string | null
    >(null);
    const filteredPerifericos = perifericos.filter(
        (p) =>
          p?.nombre.toLowerCase() !== "computadora" &&
          p?.nombre.toLowerCase() !== "laptop"
      );
      const handleSerieComponenteChange = (
        _event: React.SyntheticEvent<Element, Event>,
        newValue: Serie | null
      ) => {
        setNuevoComponente({ ...nuevoComponente, serie: newValue });
      };
      const handlePerifericoComponenteChange = (
        _event: React.SyntheticEvent<Element, Event>,
        newValue: Periferico | null
      ) => {
        setNuevoComponente({
          ...nuevoComponente,
          periferico: newValue,
          marca: null,
          modelo: null,
          serie: null,
        });
      };
      const agregarComponente = () => {
        if (
          nuevoComponente.periferico &&
          nuevoComponente.marca &&
          nuevoComponente.modelo &&
          nuevoComponente.serie &&
          nuevoComponente.inventario !== ""
        ) {
          setComponentes([...componentes, nuevoComponente]);
          setNuevoComponente({
            periferico: {} as Periferico,
            marca: {} as Marca,
            modelo: {} as Modelo,
            serie: {} as Serie,
            inventario: "",
          });
          limpiarCamposDependientesComponente();
          setErrorMensajeComponente(null);
        } else {
          setErrorMensajeComponente(
            "Por favor, complete todos los campos del componente."
          );
        }
      };
    return (
        <>

        <Dialog
          open={open} 
          onClose={onClose}
        >
          <DialogTitle>
            <p className="text-2xl font-semibold">{title}</p>
          </DialogTitle>
          <DialogContent>
            <br />
            <div className="flex-1 space-y-4">
        <Autocomplete
          size="small"
          disablePortal
          options={filteredPerifericos}
          getOptionLabel={(option: Periferico) => option?.nombre || ""}
          onChange={handlePerifericoComponenteChange}
          value={nuevoComponente.periferico}
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
          options={marcasComponente}
          getOptionLabel={(option: Marca) => option?.nombre || ""}
          onChange={handleMarcaComponenteChange}
          value={nuevoComponente.marca}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Marca"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!nuevoComponente.periferico}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={modelosComponente}
          getOptionLabel={(option: Modelo) => option?.nombre || ""}
          onChange={handleModeloComponenteChange}
          value={nuevoComponente.modelo}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Modelo"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!nuevoComponente.marca}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={seriesComponente}
          getOptionLabel={(option: Serie) => option?.nombre || ""}
          onChange={handleSerieComponenteChange}
          value={nuevoComponente.serie}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Serie"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!nuevoComponente.modelo}
        />
        <TextField
          label="Inventario"
          placeholder="Inventario"
          variant="outlined"
          fullWidth
          size="small"
          value={nuevoComponente.inventario}
          onChange={(e) =>
            setNuevoComponente({
              ...nuevoComponente,
              inventario: e.target.value,
            })
          }
        />

      </div>
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
              onClick={agregarComponente}
              fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                }}
              >
                Agregar Componente
              </Button>
        {errorMensajeComponente && (
          <div className="text-red-500 mb-4">{errorMensajeComponente}</div>
        )}
            </Box>
          </DialogActions>
        </Dialog>
        </>
      );

}
