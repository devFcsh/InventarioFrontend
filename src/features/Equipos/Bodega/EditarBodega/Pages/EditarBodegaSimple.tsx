import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { Marca, Modelo, Lampara } from "../../../../../types";
import { BodegaSimpleEdit } from "../../../../../types/Bodega/index";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import useEditarBodegaSimple from "../hooks/useEditarBodegaSimple";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";
import { validateInventario } from "@pages/Forms/helpers/validateInventario";
import { useLamparasPorModelo } from "@hooks/useLamparasPorModelo";
import useLamparas from "@hooks/useLamparas";
import { useSnackbar } from "@context/SnackbarContext";
import { useExisteInventario } from "../../../../../hooks/useExisteInventario";
import { useExisteSerie } from "../../../../../hooks/useExisteSerie";

interface EditarBodegaSimpleProps {
  equipoSimpleBodega: BodegaSimpleEdit;
  perifericoName: string;
}

const EditarBodegaSimple = ({
  perifericoName,
  equipoSimpleBodega,
}: EditarBodegaSimpleProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedLampara, setSelectedLampara] = useState<Lampara | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<string>("");
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [selectedInventarioAnio, setSelectedInventarioAnio] =
    useState<string>("");
  const [newObservation, setNewObservation] = useState<string>("");
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
    string | null
  >(null);
  const [empresa, setEmpresa] = useState<string | null>("");
  const [errorEmpresa, setErrorEmpresa] = useState<boolean>(false);
  const [errorInventario, setErrorInventario] = useState<boolean>(false);
  const [errorAnio, setErrorAnio] = useState<boolean>(false);
  const [errorMensajeEquipo, setErrorMensajeEquipo] = useState<string | null>(
    null
  );
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const { showMessage } = useSnackbar();
  const navigate = useNavigate();
  const { marcas } = useMarcasPorPeriferico(
    equipoSimpleBodega?.id_periferico ?? ""
  );
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipoSimpleBodega?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoSimpleBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { lamparas } = useLamparasPorModelo(
    equipoSimpleBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const [errorLampara, setErrorLampara] = useState(false);

  const { lamparasTotales } = useLamparas();
  const { editarBodegaSimple } = useEditarBodegaSimple();
  const { existe: existeInventario, consultarInventario } = useExisteInventario();
  const { existe: existeSerie, consultarSerie } = useExisteSerie();

  // Serie original
  const serieOriginal = series.find((serie) => serie?.id_serie === equipoSimpleBodega.id_serie)?.nombre || "";

  // Inventario original
  const inventarioOriginal = equipoSimpleBodega.inventario;

  useEffect(() => {
    if (equipoSimpleBodega) {
      setSelectedInventarioInv(equipoSimpleBodega.inventario);
      setSelectedInventarioAnio(equipoSimpleBodega.anio_compra);
      setNewObservation(equipoSimpleBodega.observacion);
      equipoSimpleBodega.inventario.length === 10 ||
      equipoSimpleBodega.inventario.length === 12
        ? setEmpresa("EspolTech")
        : setEmpresa("Espol");
    }
  }, [equipoSimpleBodega]);

  useEffect(() => {
    if (equipoSimpleBodega && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find(
          (marca) => marca?.id_marca === equipoSimpleBodega.id_marca
        ) || null
      );
    }
  }, [equipoSimpleBodega, marcas]);

  useEffect(() => {
    if (equipoSimpleBodega && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find(
          (modelo) => modelo?.id_modelo === equipoSimpleBodega.id_modelo
        ) || null
      );
    }
  }, [equipoSimpleBodega, modelos]);

  useEffect(() => {
    if (equipoSimpleBodega && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoSimpleBodega.id_serie)
          ?.nombre || ""
      );
    }
  }, [equipoSimpleBodega, series]);

  useEffect(() => {
    if (equipoSimpleBodega && lamparasTotales.length > 0) {
      setSelectedLampara(
        lamparasTotales.find(
          (lampara) => lampara?.id_lampara === equipoSimpleBodega.id_lampara
        ) || null
      );
    }
  }, [equipoSimpleBodega, lamparasTotales]);

  const handleEditEquipo = async (observationValue: string) => {
    const payload = {
      tipo: "bodega",
      inventario: selectedInventarioInv,
      anio_compra: selectedInventarioAnio,
      serie: selectedInventarioSerie ?? "",
      perifericoId: equipoSimpleBodega.id_periferico,
      observacion: observationValue,
      id_lampara: selectedLampara?.id_lampara ?? "",
    };
    try {
      await editarBodegaSimple(equipoSimpleBodega.id_equipo, payload);
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
  const handleLamparaChange = (lampara: Lampara) => {
    setSelectedLampara(lampara);
    if (lampara === null) {
      setErrorLampara(true);
    } else {
      setErrorLampara(false);
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
      errorInventario ||
      !selectedInventarioSerie ||
      (perifericoName !== "Proyector" ? false : !selectedLampara)
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
            setSelectedLampara(null);
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
        <TextField
          label="Serie"
          variant="outlined"
          fullWidth
          size="small"
          value={
            typeof selectedInventarioSerie === "string"
              ? selectedInventarioSerie
              : selectedInventarioSerie || ""
          }
          error={
            existeSerie &&
            selectedInventarioSerie !== serieOriginal
          }
          helperText={
            existeSerie && selectedInventarioSerie !== serieOriginal
              ? "La serie ya existe"
              : ""
          }
          onChange={async (e) => {
            const value = e.target.value;
            if (value !== null && value.length > 30) {
              return;
            }
            setSelectedInventarioSerie(value);
            if (value && value !== serieOriginal) {
              await consultarSerie(value);
            }
          }}
          disabled={!selectedInventarioModelo}
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
            error={
              !!errorInventario ||
              (existeInventario && selectedInventarioInv !== inventarioOriginal)
            }
            helperText={
              errorInventario
                ? "Por favor escribir un inventario válido"
                : existeInventario && selectedInventarioInv !== inventarioOriginal
                ? "El inventario ya existe"
                : ""
            }
            onChange={async (e) => {
              const value = e.target.value;
              if (empresa === "Espol" && value !== null && value.length > 8) {
                return;
              } else if (
                empresa === "EspolTech" &&
                value !== null &&
                value.length > 25
              ) {
                return;
              }
              handleChangeInventario(value);
              if (value && value !== inventarioOriginal) {
                await consultarInventario(value);
              }
            }}
            disabled={empresa === ""}
          />
          <TextField
            label="Año de Compra"
            placeholder="Año de Compra"
            variant="outlined"
            fullWidth
            size="small"
            error={!!errorAnio}
            helperText={errorAnio ? "Por favor escribir un año válido" : ""}
            value={selectedInventarioAnio}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setSelectedInventarioAnio(value);
              } else {
                setErrorAnio(true);
              }
            }}
          />
        </Box>
        {perifericoName === "Proyector" ? (
          <Autocomplete
            size="small"
            disablePortal
            options={lamparas}
            value={selectedLampara}
            onChange={(_, newValue: Lampara | null) => {
              handleLamparaChange(newValue);
            }}
            getOptionLabel={(option) => (option ? option.nombre : "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lámpara"
                variant="outlined"
                error={!!errorLampara}
                helperText={
                  errorLampara ? "Por favor seleccionar una lámpara" : ""
                }
                fullWidth
              />
            )}
            disabled={!selectedInventarioModelo}
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
          disabled={
            (existeInventario && selectedInventarioInv !== inventarioOriginal) ||
            (existeSerie && selectedInventarioSerie !== serieOriginal)
          }
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

export default EditarBodegaSimple;