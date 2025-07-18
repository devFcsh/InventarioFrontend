import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { Marca, Modelo, Serie } from "../../../../../types";
import { BodegaRedEdit } from "../../../../../types/Bodega";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";
import { validateInventario } from "@pages/Forms/helpers/validateInventario";
import useEditarBodegaRed from "../hooks/useEditarBodegaRed";
import { validateMAC } from "@pages/Forms/StepsSAP/helpers/validateMAC";
import { useSnackbar } from "@context/SnackbarContext";

interface EditarBodegaRedProps {
  equipoRedBodega: BodegaRedEdit;
  perifericoName: string;
}

const EditarBodegaRed = ({
  perifericoName,
  equipoRedBodega,
}: EditarBodegaRedProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);

  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);

  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");

  const [selectedMAC, setSelectedMAC] = useState<string>("");
  const [selectedPuertos, setSelectedPuertos] = useState<string>("");
  const [selectedPuertoFTP, setSelectedPuertoFTP] = useState<string>("");
  const [empresa, setEmpresa] = useState<string | null>("");
  const [nombreEquipo, setNombreEquipo] = useState<string>("");

  const [newObservation, setNewObservation] = useState<string>("");
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
    string | null
  >(null);
  const [errorEmpresa, setErrorEmpresa] = useState<boolean>(false);
  const [errorInventario, setErrorInventario] = useState<boolean>(false);
  //const [errorNombreEquipo, setErrorNombreEquipo] = useState<boolean>(false);
  const [errorMAC, setErrorMAC] = useState<boolean>(false);
  const [errorMensajeEquipo, setErrorMensajeEquipo] = useState<string | null>(
    null
  );
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const { showMessage } = useSnackbar();

  const navigate = useNavigate();

  const { marcas } = useMarcasPorPeriferico(
    equipoRedBodega?.id_periferico ?? ""
  );
  const { modelos } = useModelosPorMarcaPeriferico(
    equipoRedBodega?.id_marca ?? "",
    equipoRedBodega?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoRedBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );

  const { editarBodegaRed } = useEditarBodegaRed();

  useEffect(() => {
    if (equipoRedBodega) {
      setSelectedInventarioInv(equipoRedBodega.inventario);
      setNewObservation(equipoRedBodega.observacion);
      setSelectedMAC(equipoRedBodega.mac);
      setSelectedPuertos(equipoRedBodega.puertos);
      setSelectedPuertoFTP(equipoRedBodega.puerto_ftp);
      setNombreEquipo(equipoRedBodega.nombre_equipo ?? "");
      (equipoRedBodega.inventario.length === 10 || equipoRedBodega.inventario.length === 12)
        ? setEmpresa("EspolTech")
        : setEmpresa("Espol");
    }
  }, [equipoRedBodega]);

  useEffect(() => {
    if (equipoRedBodega && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipoRedBodega.id_marca) ||
          null
      );
    }
  }, [equipoRedBodega, marcas]);

  useEffect(() => {
    if (equipoRedBodega && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find(
          (modelo) => modelo?.id_modelo === equipoRedBodega.id_modelo
        ) || null
      );
    }
  }, [equipoRedBodega, modelos]);

  useEffect(() => {
    if (equipoRedBodega && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoRedBodega.id_serie) ||
          null
      );
    }
  }, [equipoRedBodega, series]);

  const handleEditEquipo = async (observationValue: string) => {
    const payload = {
      tipo: "bodega",
      inventario: selectedInventarioInv,
      id_serie: selectedInventarioSerie?.id_serie ?? "",
      observacion: observationValue ?? "",
      mac: selectedMAC ?? "",
      puertos: selectedPuertos ?? "",
      puerto_ftp: selectedPuertoFTP ?? "",
      nombre_equipo: nombreEquipo,
    };
    try {
      await editarBodegaRed(equipoRedBodega.id_equipo, payload);
      showMessage("Equipo editado exitosamente", "success");
      navigate("/bodega");
    } catch (error) {
      showMessage("Error al editar el equipo", "error");
    }
  };

  const handleConfirmEditarEquipo = () => {
    if (validarCamposEquipo()) {
      setOpenModalEditar(true);
    }
  };

  const handleModalConfirmEditar = async () => {
    setOpenModalEditar(false);
    await handleEditEquipo(newObservation);
  };
  const handleObservation = (newObservation: string) => {
    if (newObservation.length <= 200) {
      setNewObservation(newObservation);
      setErrorMensajeComponente("");
    } else {
      setErrorMensajeComponente(
        "La observación no puede tener más de 200 caracteres."
      );
    }
  };

  const handleChangeEmpresa = (newEmpresa: string | null) => {
    setEmpresa(newEmpresa);
    if (newEmpresa === null) {
      setErrorEmpresa(true);
      setSelectedInventarioInv("");
      setErrorInventario(true);
    } else {
      setErrorEmpresa(false);
      !validateInventario(selectedInventarioInv, newEmpresa)
        ? setErrorInventario(true)
        : setErrorInventario(false);
    }
  };

  const handleChangeInventario = (inventario: string) => {
    setSelectedInventarioInv(inventario);
    if (empresa === "Espol") {
      !validateInventario(inventario ? inventario : "", empresa)
        ? setErrorInventario(true)
        : setErrorInventario(false);
    } else if (empresa === "EspolTech") {
      !validateInventario(inventario ? inventario : "", empresa)
        ? setErrorInventario(true)
        : setErrorInventario(false);
    }
  };
  const handleMACChange = (MAC: string) => {
    setSelectedMAC(MAC);
    if (MAC === null) {
      setErrorMAC(true);
    } else {
      !validateMAC(MAC) ? setErrorMAC(true) : setErrorMAC(false);
    }
  };

  const handleCancelar = () => {
    setOpenModalCancelar(false);
    navigate("/bodega");
  };

  const handleConfirmCancelar = () => {
    setOpenModalCancelar(true);
  };
  const validarCamposEquipo = () => {
    if (
      !selectedInventarioInv ||
      !selectedInventarioSerie ||
      !selectedMAC ||
      (perifericoName === "AP" ? false : !selectedPuertos) ||
      (perifericoName === "AP" ? false : !selectedPuertoFTP)
    ) {
      setErrorMensajeEquipo("Por favor, complete todos los campos del equipo.");
      return false;
    }
    setErrorMensajeEquipo(null);
    return true;
  };

  return (
    <div>
      <ModalConfirmation
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        onConfirm={handleModalConfirmEditar}
        title="Confirmar Editar Equipo"
        message="¿Está seguro de que desea editar este equipo?"
      />
      <ModalConfirmation
        open={openModalCancelar}
        onClose={() => setOpenModalCancelar(false)}
        onConfirm={handleCancelar}
        title="Confirmar Cancelar"
        message="¿Está seguro de que desea cancelar? Todos los cambios no guardados se perderán."
      />
      <h2 className="text-xl font-semibold mb-5">Información de Inventario</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Autocomplete
          size="small"
          disablePortal
          options={marcas}
          value={selectedInventarioMarca}
          onChange={(_, newValue) => {
            setSelectedInventarioMarca(newValue);
            setSelectedInventarioModelo(null);
            setSelectedInventarioSerie(null);
          }}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Marca" variant="outlined" fullWidth />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={modelos}
          value={selectedInventarioModelo}
          onChange={(_, newValue) => {
            setSelectedInventarioModelo(newValue);
            setSelectedInventarioSerie(null);
          }}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Modelo"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={series}
          value={selectedInventarioSerie}
          onChange={(_, newValue) => setSelectedInventarioSerie(newValue)}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Serie" variant="outlined" fullWidth />
          )}
        />
        <Box
          sx={{
            display: "inline-flex",
          }}
        >
          <Autocomplete
            size="small"
            disablePortal
            sx={{ width: "50%" }}
            options={["Espol", "EspolTech"]}
            getOptionLabel={(option) => (option ? option : "")}
            value={empresa}
            onChange={(_, newValue) => {
              handleChangeEmpresa(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Empresa"
                variant="outlined"
                error={!!errorEmpresa}
                helperText={
                  errorEmpresa ? "Por favor seleccionar una empresa" : ""
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
            value={selectedInventarioInv}
            error={!!errorInventario}
            helperText={
              errorInventario ? "Por favor escribir un inventario válido" : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (empresa === "Espol" && value !== null && value.length > 8) {
                return;
              } else if (
                empresa === "EspolTech" &&
                value !== null &&
                value.length > 12
              ) {
                return;
              }
              handleChangeInventario(value);
            }}
            disabled={empresa === ""}
          />
        </Box>
      </div>

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextField
          label="MAC"
          placeholder="MAC"
          variant="outlined"
          fullWidth
          size="small"
          value={selectedMAC}
          error={!!errorMAC}
          helperText={errorMAC ? "Por favor escribir un inventario válido" : ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value !== null && value.length > 1) {
              return;
            }
            handleMACChange(e.target.value);
          }}
        />
        <TextField
          label="Nombre Equipo"
          placeholder="Nombre Equipo"
          variant="outlined"
          fullWidth
          size="small"
          value={nombreEquipo}
          onChange={(e) => {
            let value = e.target.value;
            if (value !== null && value.length > 10) {
              value = value.slice(0, 10);
            }
            setNombreEquipo(value);
          }}
        />
        {perifericoName === "Switch" ? (
          <TextField
            label="Puertos 10-100-1000"
            placeholder="Puertos"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedPuertos}
            onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 10) {
                return;
              }
              setSelectedPuertos(e.target.value);
            }}
          />
        ) : (
          ""
        )}
        {perifericoName === "Switch" ? (
          <TextField
            label="puertoFTP"
            placeholder="Puerto FTP"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedPuertoFTP}
            onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 10) {
                return;
              }
              setSelectedPuertoFTP(e.target.value);
            }}
          />
        ) : (
          ""
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-10">Observación</h2>
        <TextField
          label="Observación"
          variant="outlined"
          fullWidth
          multiline
          minRows={2}
          value={newObservation}
          onChange={(e) => {
            const value = e.target.value;
            if (value !== null && value.length > 200) {
              return;
            }
            handleObservation(e.target.value);
          }}
          error={!!errorMensajeComponente}
          helperText={errorMensajeComponente}
        />
      </div>

      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
          onClick={handleConfirmEditarEquipo}
          fullWidth
        >
          Guardar Cambios
        </Button>
        <Button
          onClick={handleConfirmCancelar}
          color="error"
          variant="contained"
          fullWidth
        >
          Cancelar
        </Button>
      </div>
      {errorMensajeEquipo && (
        <div className="text-red-500 mt-2">{errorMensajeEquipo}</div>
      )}
    </div>
  );
};

export default EditarBodegaRed;
