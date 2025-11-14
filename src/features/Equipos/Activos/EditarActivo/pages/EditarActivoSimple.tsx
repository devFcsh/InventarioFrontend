import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { Marca, Modelo, Lampara, Ubicacion, Edificio, Periferico } from "../../../../../types";
import { ActivoSimpleEdit } from "../../../../../types/Activo";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import { useLamparasPorModelo } from "../../../../../hooks/useLamparasPorModelo";
import useLamparas from "../../../../../hooks/useLamparas";
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";
import usePerifericos from "../../../../../hooks/usePerifericos";
import useSubirImagen from "../../../../../hooks/useSubirImagen";
import useEditarActivoSimple from "../hooks/useEditarActivoSimple";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";
import { validateInventario } from "@pages/Forms/helpers/validateInventario";
import { useSnackbar } from "@context/SnackbarContext";
import { useExisteInventario } from "../../../../../hooks/useExisteInventario";
import { useExisteSerie } from "../../../../../hooks/useExisteSerie";
import useComputadorasPorPeriferico, { ComputadoraSimple } from "../../../../../hooks/useComputadorasPorPeriferico";
interface EditarActivoSimpleProps {
  equipoSimpleActivo: ActivoSimpleEdit;
  idUsuario: string | null;
  perifericoName: string;
}

const EditarActivoSimple = ({
  perifericoName,
  equipoSimpleActivo,
  idUsuario,
}: EditarActivoSimpleProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] = useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedLampara, setSelectedLampara] = useState<Lampara | null>(null);
  const [selectedPeriferico, setSelectedPeriferico] = useState<Periferico | null>(null);
  const [selectedComputadora, setSelectedComputadora] = useState<ComputadoraSimple | null>(null);
  const [serieNombre, setSerieNombre] = useState<string>("");
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
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(
    null
  );
  const [image, setImage] = useState<File | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const { uploadImage } = useSubirImagen();
  const { marcas } = useMarcasPorPeriferico(
    equipoSimpleActivo?.id_periferico ?? ""
  );
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipoSimpleActivo?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoSimpleActivo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { lamparas } = useLamparasPorModelo(
    equipoSimpleActivo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const [errorLampara, setErrorLampara] = useState(false);

  const { edificios } = useEdificios();
  const { lamparasTotales } = useLamparas();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");
  const { perifericos } = usePerifericos();
  const { computadoras } = useComputadorasPorPeriferico(
    selectedPeriferico?.id_periferico ?? "",
    'activo'
  );
  const { editarActivoSimple } = useEditarActivoSimple();
  const { existe: existeInventario, consultarInventario } = useExisteInventario();
  const { existe: existeSerie, consultarSerie } = useExisteSerie();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (equipoSimpleActivo) {
      setSelectedInventarioInv(equipoSimpleActivo.inventario);
      setSelectedInventarioAnio(equipoSimpleActivo.anio_compra);
      setCurrentImagePath(equipoSimpleActivo.imagenRuta);
      setNewObservation(equipoSimpleActivo.observacion ?? "");
      equipoSimpleActivo.inventario.length === 10 ||
      equipoSimpleActivo.inventario.length === 12
        ? setEmpresa("EspolTech")
        : setEmpresa("Espol");
    }
  }, [equipoSimpleActivo]);

  useEffect(() => {
    if (equipoSimpleActivo && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find(
          (marca) => marca?.id_marca === equipoSimpleActivo.id_marca
        ) || null
      );
    }
  }, [equipoSimpleActivo, marcas]);

  useEffect(() => {
    if (equipoSimpleActivo && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find(
          (modelo) => modelo?.id_modelo === equipoSimpleActivo.id_modelo
        ) || null
      );
    }
  }, [equipoSimpleActivo, modelos]);

  useEffect(() => {
    if (equipoSimpleActivo && series.length > 0) {
      const serieObj = series.find(
        (serie) => serie?.id_serie === equipoSimpleActivo.id_serie
      );
      setSerieNombre(serieObj?.nombre || "");
    }
  }, [equipoSimpleActivo, series]);

  useEffect(() => {
    if (!perifericos || perifericos.length === 0) {
      setSelectedPeriferico(null);
      return;
    }
    if (equipoSimpleActivo?.isComponente) {
      const perifericoIdToUse =
        equipoSimpleActivo.id_periferico_computadora ?? equipoSimpleActivo.id_periferico;
      const found = perifericos.find(
        (p) => String(p?.id_periferico) === String(perifericoIdToUse)
      );
      setSelectedPeriferico(found || null);
    } else {
      setSelectedPeriferico(null);
    }
  }, [equipoSimpleActivo, perifericos]);

  useEffect(() => {
    if (equipoSimpleActivo?.isComponente && computadoras && computadoras.length > 0) {
      const foundComp = computadoras.find((c) => {
        if (equipoSimpleActivo.id_computadora && String(c?.id_equipo) === String(equipoSimpleActivo.id_computadora)) {
          return true;
        }
        if (
          equipoSimpleActivo.id_serie_computadora &&
          String(c?.serie) === String(equipoSimpleActivo.id_serie_computadora)
        ) {
          return true;
        }
        return false;
      });
      setSelectedComputadora(foundComp || null);
    } else {
      setSelectedComputadora(null);
    }
  }, [equipoSimpleActivo, computadoras]);

  useEffect(() => {
    if (equipoSimpleActivo && edificios.length > 0) {
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio?.id_edificio === equipoSimpleActivo.id_edificio
        ) || null
      );
    }
  }, [equipoSimpleActivo, edificios]);

  useEffect(() => {
    if (equipoSimpleActivo && ubicaciones.length > 0) {
      setSelectedUbicacion(
        ubicaciones.find(
          (ubicacion) =>
            ubicacion?.id_ubicacion === equipoSimpleActivo.id_ubicacion
        ) || null
      );
    }
  }, [equipoSimpleActivo, ubicaciones]);

  useEffect(() => {
    if (equipoSimpleActivo && lamparasTotales.length > 0) {
      setSelectedLampara(
        lamparasTotales.find(
          (lampara) => lampara?.id_lampara === equipoSimpleActivo.id_lampara
        ) || null
      );
    }
  }, [equipoSimpleActivo, lamparasTotales]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditEquipo = async (observationValue: string) => {
    let nuevaImagen = currentImagePath;

    if (image) {
      try {
        nuevaImagen = await uploadImage(image);
      } catch (error) {
        showMessage("Error al subir la imagen", "error");
        return;
      }
    }

    const payload = {
      tipo: "activo",
      inventario: selectedInventarioInv,
      anio_compra: selectedInventarioAnio,
      id_usuario: idUsuario ?? "",
      imagenRuta: image ? nuevaImagen : "",
      id_ubicacion: selectedUbicacion?.id_ubicacion ?? "",
      serie: serieNombre,
      perifericoId: equipoSimpleActivo?.id_periferico,
      modeloId: selectedInventarioModelo?.id_modelo ?? "",
      id_computadora: selectedComputadora ? String(selectedComputadora.id_equipo) : undefined,
      observacion: observationValue,
      id_lampara: selectedLampara?.id_lampara ?? "",
    };
    try {
      await editarActivoSimple(equipoSimpleActivo.id_equipo, payload);
      showMessage("Equipo editado correctamente", "success");
      navigate("/activos");
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
    if (!lampara) {
      setErrorLampara(true);
    } else {
      setErrorLampara(false);
    }
  };

  const handleCancelar = () => {
    setOpenModalCancelar(false);
    navigate("/activos");
  };

  const handleConfirmCancelar = () => {
    setOpenModalCancelar(true);
  };
  const validarCamposEquipo = () => {
    const missing: string[] = [];

    if (!selectedInventarioInv || errorInventario) missing.push("Inventario");
    if (!serieNombre) missing.push("Serie");
    if (!selectedUbicacion) missing.push("Ubicación");
    if (perifericoName === "Proyector" && !selectedLampara) missing.push("Lámpara");

    if (missing.length > 0) {
      setErrorMensajeEquipo(
        `Por favor complete los siguientes campos: ${missing.join(", ")}.`
      );
      return false;
    }

    setErrorMensajeEquipo(null);
    return true;
  };

  const serieOriginal = serieNombre;

  const inventarioOriginal = equipoSimpleActivo.inventario;

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
          value={serieNombre}
          error={
            existeSerie &&
            serieNombre !== serieOriginal
          }
          helperText={
            existeSerie && serieNombre !== serieOriginal
              ? "La serie ya existe"
              : ""
          }
          onChange={async (e) => {
            const value = e.target.value;
            if (value !== null && value.length > 30) {
              return;
            }
            setSerieNombre(value);
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

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {equipoSimpleActivo?.isComponente ? (
          <>
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos.filter((p) => (p?.nombre === 'Computadora' || p?.nombre === 'Laptop'))}
              value={selectedPeriferico}
              onChange={(_, newValue: Periferico | null) => {
                setSelectedPeriferico(newValue);
                setSelectedComputadora(null);
              }}
              getOptionLabel={(option) => (option ? option.nombre : "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periférico (opcional)"
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            <Autocomplete
              size="small"
              disablePortal
              options={computadoras}
              value={selectedComputadora}
              onChange={(_, newValue: ComputadoraSimple | null) => setSelectedComputadora(newValue)}
              getOptionLabel={(option) => (option?.serie ? String(option.serie) : String(option?.id_equipo))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Serie computadora (opcional)"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled={!selectedPeriferico || !computadoras || computadoras.length === 0}
            />
          </>
        ) : null}
        <Autocomplete
          size="small"
          disablePortal
          options={edificios}
          value={selectedEdificio}
          onChange={(_, newValue) => {
            setSelectedEdificio(newValue);
            setSelectedUbicacion(null);
          }}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Edificio"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Autocomplete
          size="small"
          disablePortal
          options={ubicaciones}
          value={selectedUbicacion}
          onChange={(_, newValue) => setSelectedUbicacion(newValue)}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ubicacion"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!selectedEdificio}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Cargar Imagen</h2>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div
            onClick={handleImageClick}
            className="w-full max-w-sm h-48 border border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            ) : equipoSimpleActivo.imagenRuta ? (
              <img
                src={`http://localhost:5000${equipoSimpleActivo.imagenRuta}`}
                alt="Imagen del equipo"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">Haz clic para cargar una imagen</p>
            )}
          </div>
        </div>
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
            handleObservation(value);
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
            (existeSerie && serieNombre !== serieOriginal)
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

export default EditarActivoSimple;