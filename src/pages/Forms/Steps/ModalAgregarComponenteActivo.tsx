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
import { useState, useEffect } from "react";
import { Componente } from "../../../types/Activo/Componente/index.ts";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import { Marca, Modelo, Periferico } from "../../../types/index.ts";
import { useErrorsComponents } from "../hooks/useErrorsComponents.ts";
import { useExisteInventario } from "@hooks/useExisteInventario";
import { useExisteSerie } from "@hooks/useExisteSerie";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  perifericos: Periferico[];
  onAddComponent: (nuevoComponente: Componente) => void;
  addedPerifericos: any;
  empresaComputadora?: string;
  inventarioComputadora?: string;
}

export const ModalAgregarComponenteActivo: React.FC<ModalProps> = ({
  open,
  onClose,
  title = "Agregar activo",
  perifericos = [],
  onAddComponent,
  addedPerifericos = [],
  empresaComputadora = "",
  inventarioComputadora = "",
}) => {
  const [nuevoComponente, setNuevoComponente] = useState<Componente>({
    periferico: null,
    marca: null,
    modelo: null,
    serie: "",
    inventario: "",
  });
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
    string | null
  >(null);
  const {
    componentsErrors,
    completeDatosComponents,
    handleComponentsErrors,
    handleUniqueComponentsError,
  } = useErrorsComponents();

  const [empresa, setEmpresa] = useState(empresaComputadora);
  const { existe: existeInventario, consultarInventario } = useExisteInventario();
  const { existe: existeSerie, consultarSerie } = useExisteSerie();

  const generateInventario = (
    periferico: Periferico | null,
    baseInventario: string
  ): string => {
    if (!periferico || !baseInventario) return "";

    if (empresa === "Espol" || empresa === "EspolTech") {
      const sufijos: { [key: string]: string } = {
        monitor: "-1",
        teclado: "-2",
        mouse: "-3",
        parlante: "-4",
        camara: "-5",
      };

      const nombrePeriferico = periferico.nombre?.toLowerCase();
      const sufijo = sufijos[nombrePeriferico] || "";

      return baseInventario + sufijo;
    }

    return "";
  };

  useEffect(() => {
    if (
      nuevoComponente.periferico &&
      (empresa === "Espol" || empresa === "EspolTech") &&
      inventarioComputadora
    ) {
      const nuevoInventario = generateInventario(
        nuevoComponente.periferico,
        inventarioComputadora
      );
      setNuevoComponente((prev) => ({
        ...prev,
        inventario: nuevoInventario,
      }));
    }
  }, [nuevoComponente.periferico, empresa, inventarioComputadora]);

  useEffect(() => {
    if (open) {
      setEmpresa(empresaComputadora);
    }
  }, [open, empresaComputadora]);

  const filteredPerifericos = perifericos.filter((p) => {
    const nombre = p?.nombre?.toLowerCase();
    if (
      nombre === "computadora" ||
      nombre === "laptop" ||
      nombre === "proyector" ||
      nombre === "accesspoint" ||
      nombre === "switch"
    ) {
      return false;
    }
    if (
      (nombre === "mouse" || nombre === "teclado") &&
      addedPerifericos.some(
        (added: any) => added?.periferico?.id_periferico === p?.id_periferico
      )
    ) {
      return false;
    }
    if (
      nombre === "monitor" &&
      addedPerifericos.filter(
        (added: any) => added?.periferico?.nombre?.toLowerCase() === "monitor"
      ).length >= 2
    ) {
      return false;
    }
    if (
      nombre !== "monitor" &&
      addedPerifericos.some(
        (added: any) => added?.periferico?.id_periferico === p?.id_periferico
      )
    ) {
      return false;
    }
    return true;
  });

  const { marcas: marcasComponente } = useMarcasPorPeriferico(
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const { modelos: modelosComponente } = useModelosPorMarcaPeriferico(
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.periferico?.id_periferico ?? ""
  );

  const handlePerifericoComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Periferico | null
  ) => {
    const nuevoInventario =
      (empresa === "Espol" || empresa === "EspolTech") && inventarioComputadora
        ? generateInventario(newValue, inventarioComputadora)
        : "";

    setNuevoComponente({
      ...nuevoComponente,
      periferico: newValue,
      marca: null,
      modelo: null,
      serie: "",
      inventario: nuevoInventario,
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
      serie: "",
    });
  };

  const handleModeloComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null
  ) => {
    setNuevoComponente({ ...nuevoComponente, modelo: newValue });
  };

  const agregarComponente = () => {
    const errores = handleComponentsErrors({
      ...nuevoComponente,
      empresa,
    });

    if (Object.values(errores).includes(true)) {
      setErrorMensajeComponente(
        "Por favor completa todos los campos obligatorios."
      );
      return;
    }

    if (!completeDatosComponents({ ...nuevoComponente, empresa })) {
      setErrorMensajeComponente(
        "Por favor completa todos los campos obligatorios."
      );
      return;
    }

    onAddComponent(nuevoComponente);
    setNuevoComponente({
      periferico: {} as Periferico,
      marca: {} as Marca,
      modelo: {} as Modelo,
      serie: "",
      inventario: "",
    });
    limpiarCamposDependientesComponente();
    setErrorMensajeComponente(null);
    onClose();
  };

  const limpiarCamposDependientesComponente = () => {
    setNuevoComponente({
      ...nuevoComponente,
      periferico: null,
      marca: null,
      modelo: null,
      serie: "",
      inventario: "",
    });
  };

  const getInventarioHelperText = () => {
    if (empresa === "Espol") {
      return "El inventario se genera automáticamente";
    } else if (empresa === "EspolTech") {
      return "El inventario se genera automáticamente, pero puedes editarlo";
    }
    return "";
  };

  const getMaxLength = () => {
    if (empresa === "EspolTech") {
      return 20;
    }
    return 10;
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
                  handlePerifericoComponenteChange(_, newValue);
                  handleUniqueComponentsError("periferico", newValue, {
                    ...nuevoComponente,
                    empresa,
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
                  handleMarcaComponenteChange(_, newValue);
                  handleUniqueComponentsError("marca", newValue, {
                    ...nuevoComponente,
                    empresa,
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
                  handleModeloComponenteChange(_, newValue);
                  handleUniqueComponentsError("modelo", newValue, {
                    ...nuevoComponente,
                    empresa,
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
              <TextField
                label="Serie"
                variant="outlined"
                fullWidth
                size="small"
                value={
                  typeof nuevoComponente.serie === "string"
                    ? nuevoComponente.serie
                    : nuevoComponente.serie || ""
                }
                error={
                  !!componentsErrors.serie ||
                  (!!nuevoComponente.serie && existeSerie)
                }
                helperText={
                  componentsErrors.serie
                    ? "Por favor escribir una serie"
                    : existeSerie
                    ? "La serie ya existe"
                    : ""
                }
                onChange={async (e) => {
                  const value = e.target.value;
                  if (value !== null && value.length > 30) {
                    return;
                  }
                  setNuevoComponente({ ...nuevoComponente, serie: value });
                  handleUniqueComponentsError("serie", value, {
                    ...nuevoComponente,
                    empresa,
                  });
                  if (value) {
                    await consultarSerie(value);
                  }
                }}
                disabled={!nuevoComponente.modelo}
              />
              <Autocomplete
                size="small"
                disablePortal
                options={["Espol", "EspolTech"]}
                getOptionLabel={(option) => (option ? option : "")}
                value={empresa}
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
                disabled={true}
              />
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <TextField
                  label="Inventario"
                  placeholder="Inventario"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={nuevoComponente.inventario}
                  error={
                  !!componentsErrors.inventario ||
                  (nuevoComponente.inventario !== "S/N" && !!nuevoComponente.inventario && existeInventario)
                  }
                  helperText={
                  componentsErrors.inventario && nuevoComponente.inventario !== "S/N"
                    ? "Por favor escribir un inventario válido"
                    : nuevoComponente.inventario !== "S/N" && existeInventario
                    ? "El inventario ya existe"
                    : getInventarioHelperText()
                  }
                  onChange={async (e) => {
                  let value = e.target.value;
                  const maxLength = getMaxLength();

                  if (value !== null && value.length > maxLength) {
                    value = value.slice(0, maxLength);
                  }
                  setNuevoComponente({
                    ...nuevoComponente,
                    inventario: value,
                  });
                  handleUniqueComponentsError("inventario", value, {
                    ...nuevoComponente,
                    empresa,
                  });
                  if (value && value !== "S/N") {
                    await consultarInventario(value);
                  }
                  }}
                  disabled={nuevoComponente.inventario === "S/N"}
                />
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <input
                  type="checkbox"
                  id="sin-inventario-modal-componente"
                  checked={nuevoComponente.inventario === "S/N"}
                  onChange={(e) => {
                    if (e.target.checked) {
                    setNuevoComponente({
                      ...nuevoComponente,
                      inventario: "S/N"
                    });
                    handleUniqueComponentsError("inventario", "S/N", {
                      ...nuevoComponente,
                      empresa,
                    });
                    } else {
                    const nuevoInventario =
                      (empresa === "Espol" || empresa === "EspolTech") && inventarioComputadora
                      ? generateInventario(nuevoComponente.periferico, inventarioComputadora)
                      : "";
                    setNuevoComponente({
                      ...nuevoComponente,
                      inventario: nuevoInventario
                    });
                    handleUniqueComponentsError("inventario", nuevoInventario, {
                      ...nuevoComponente,
                      empresa,
                    });
                    }
                  }}
                  />
                  <label htmlFor="sin-inventario-modal-componente">Sin inventario</label>
                </Box>
                </Box>
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
            disabled={
              !!componentsErrors.serie ||
              !!componentsErrors.inventario ||
              (!!nuevoComponente.serie && existeSerie) ||
              (nuevoComponente.inventario !== "S/N" && !!nuevoComponente.inventario && existeInventario)
            }
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