import {
  Box,
  Button,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import { useState } from "react";
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import { Componente } from "../../../types/Activo/Componente/index.ts";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import { Marca, Modelo, Serie, Periferico} from "../../../types/index.ts";
import { useErrorsComponents } from '../hooks/useErrorsComponents.ts';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  perifericos: Periferico[];
  onAddComponent: (nuevoComponente: Componente) => void;
  addedPerifericos: any;
}

export const ModalAgregarComponenteActivo: React.FC<ModalProps> = ({
  open,
  onClose,
  title = "Agregar activo",
  perifericos = [],
  onAddComponent,
  addedPerifericos = [],
}) => {
  const [nuevoComponente, setNuevoComponente] = useState<Componente>({
    periferico: null,
    marca: null,
    modelo: null,
    serie: null,
    inventario: "",
  });
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
    string | null
  >(null);
  const { componentsErrors, completeDatosComponents, handleComponentsErrors, handleUniqueComponentsError } = useErrorsComponents();
  const [empresa, setEmpresa] = useState("");
  const filteredPerifericos = perifericos.filter(
    (p) =>
      p?.nombre.toLowerCase() !== "computadora" &&
      p?.nombre.toLowerCase() !== "laptop" &&
      p?.nombre.toLowerCase() !== "proyector" &&
      p?.nombre.toLowerCase() !== "ap" &&
      p?.nombre.toLowerCase() !== "switch" &&
      !addedPerifericos.some((added: { periferico: { id_periferico: string | undefined; }; })=> added?.periferico?.id_periferico === p?.id_periferico)
  );
  const { marcas: marcasComponente } = useMarcasPorPeriferico(
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const { modelos: modelosComponente } = useModelosPorMarcaPeriferico(
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const { series: seriesComponente } = useSeriesPorModelo(
    nuevoComponente.periferico?.id_periferico ?? "",
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.modelo?.id_modelo ?? ""
  );
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
  const handleModeloComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null
  ) => {
    setNuevoComponente({ ...nuevoComponente, modelo: newValue, serie: null });
  };
  const handleSerieComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Serie | null
  ) => {
    setNuevoComponente({ ...nuevoComponente, serie: newValue });
  };
  const agregarComponente = () => {
    handleComponentsErrors({
      ...nuevoComponente,
      empresa
    });
    if (
      !Object.values(componentsErrors).includes(true) && completeDatosComponents({
        ...nuevoComponente,
        empresa
      })
    ) {
      onAddComponent(nuevoComponente);
      setNuevoComponente({
        periferico: {} as Periferico,
        marca: {} as Marca,
        modelo: {} as Modelo,
        serie: {} as Serie,
        inventario: "",
      });
      limpiarCamposDependientesComponente();
      setErrorMensajeComponente(null);

      onClose();
    }
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
  const handleEmpresaChange = (newValue: string) => {
    if (newValue) {
      setEmpresa(newValue);
    } else {
      setEmpresa("");
      setNuevoComponente({
        ...nuevoComponente,
        inventario: "",
      });
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <p className="text-2xl font-semibold">{title}</p>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <div className="m-4">
            <div className="grid grid-cols-2 gap-8">
              <Autocomplete
                size="small"
                disablePortal
                options={filteredPerifericos}
                getOptionLabel={(option: Periferico) => option?.nombre || ""}
                onChange={(_, newValue: Periferico | null) => {
                  handlePerifericoComponenteChange(_,newValue)
                  handleUniqueComponentsError("periferico", newValue,{
                    ...nuevoComponente,
                    empresa
                  });
                }}
                value={nuevoComponente.periferico}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Periférico"
                    variant="outlined"
                    error={!!componentsErrors.periferico}
                    helperText={
                      componentsErrors.periferico
                        ? "Por favor seleccionar un periférico"
                        : ""
                    }
                    fullWidth
                  />
                )}
              />
              <Autocomplete
                size="small"
                disablePortal
                options={marcasComponente}
                getOptionLabel={(option: Marca) => option?.nombre || ""}
                onChange={(_, newValue: Marca | null) => {
                  handleMarcaComponenteChange(_,newValue)
                  handleUniqueComponentsError("marca", newValue,{
                    ...nuevoComponente,
                    empresa
                  });
                }}
                value={nuevoComponente.marca}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Marca"
                    variant="outlined"
                    error={!!componentsErrors.marca}
                    helperText={
                      componentsErrors.marca
                        ? "Por favor seleccionar una marca"
                        : ""
                    }
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
                onChange={(_, newValue: Modelo | null) => {
                  handleModeloComponenteChange(_,newValue)
                  handleUniqueComponentsError("modelo", newValue,{
                    ...nuevoComponente,
                    empresa
                  });
                }}
                value={nuevoComponente.modelo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Modelo"
                    variant="outlined"
                    error={!!componentsErrors.modelo}
                    helperText={
                      componentsErrors.modelo
                        ? "Por favor seleccionar un modelo"
                        : ""
                    }
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
                onChange={(_, newValue: Serie | null) => {
                  handleSerieComponenteChange(_,newValue)
                  handleUniqueComponentsError("serie", newValue,{
                    ...nuevoComponente,
                    empresa
                  });
                }}
                value={nuevoComponente.serie}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Serie"
                    variant="outlined"
                    error={!!componentsErrors.serie}
                    helperText={
                      componentsErrors.serie
                        ? "Por favor seleccionar una serie"
                        : ""
                    }
                    fullWidth
                  />
                )}
                disabled={!nuevoComponente.modelo}
              />
              <Autocomplete
                size="small"
                disablePortal
                options={["Espol", "EspolTech"]}
                getOptionLabel={(option) => (option ? option : "")}
                value={empresa}
                onChange={(_, newValue: string | null) => {
                  handleEmpresaChange(newValue|| "" )
                  handleUniqueComponentsError("empresa", newValue,{
                    ...nuevoComponente,
                    empresa
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empresa"
                    variant="outlined"
                    error={!!componentsErrors.empresa}
                    helperText={
                      componentsErrors.empresa
                        ? "Por favor seleccionar una empresa"
                        : ""
                    }
                    fullWidth
                    sx={{ marginRight: 8, width: "100%" }}
                  />
                )}
              />
              <TextField
                label="Inventario"
                placeholder="Inventario"
                variant="outlined"
                fullWidth
                size="small"
                value={nuevoComponente.inventario}
                error={!!componentsErrors.inventario}
                helperText={componentsErrors.inventario? "Por favor escribir un inventario válido" :""}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value !== null && value.length > 10) {
                    return
                  }
                  setNuevoComponente({
                    ...nuevoComponente,
                    inventario: value,
                  })
                  handleUniqueComponentsError("inventario",value,{
                    ...nuevoComponente,
                    empresa
                  });
                }}
                disabled={empresa === ""}
              />
            </div>
          </div>
        </Box>
      </DialogContent>

      <DialogActions sx={{ mt: "-10px" }}>
        <Box
          sx={{
            justifyContent: "center",
            width: "100%",
            gap: 2,
            pb: 2,
          }}
          className="grid grid-cols-2"
        >
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
  );
};
