import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { Marca, Modelo, Ubicacion, Edificio } from "../../../../../types";
import { ActivoRedEdit } from "../../../../../types/Activo";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import useSubirImagen from "../../../../../hooks/useSubirImagen";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";
import { validateInventario } from "@pages/Forms/helpers/validateInventario";
import useEditarActivoRed from "../hooks/useEditarActivoRed";
import { validateMAC } from "@pages/Forms/StepsSAP/helpers/validateMAC";
import { API_BASE_URL } from "../../../../../data";
import { useSnackbar } from "@context/SnackbarContext";
import { useExisteInventario } from "../../../../../hooks/useExisteInventario";
import { useExisteSerie } from "../../../../../hooks/useExisteSerie";
import { useUser } from "@context/userContext.tsx";

interface EditarActivoRedProps {
  equipoRedActivo: ActivoRedEdit;
  perifericoName: string;
}

const EditarActivoRed = ({
  perifericoName,
  equipoRedActivo,
}: EditarActivoRedProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);

  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<string>("");

  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [selectedInventarioAnio, setSelectedInventarioAnio] =
    useState<string>("");
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(
    null
  );
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
  const [errorAnio, setErrorAnio] = useState<boolean>(false);
  const [errorMAC, setErrorMAC] = useState<boolean>(false);
  //const [errorNombreEquipo, setErrorNombreEquipo] = useState<boolean>(false);
  const [errorPuertos, setErrorPuertos] = useState<boolean>(false);
  const [errorPuertoFTP, setErrorPuertoFTP] = useState<boolean>(false);
  const [errorMensajeEquipo, setErrorMensajeEquipo] = useState<string | null>(
    null
  );
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);

  const { showMessage } = useSnackbar();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const { uploadImage } = useSubirImagen();
  const { marcas } = useMarcasPorPeriferico(
    equipoRedActivo?.id_periferico ?? ""
  );
  const { modelos } = useModelosPorMarcaPeriferico(
    equipoRedActivo?.id_marca ?? "",
    equipoRedActivo?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoRedActivo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );

  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");
  const { editarActivoRed } = useEditarActivoRed();
  const { user } = useUser();
  const { existe: existeInventario, consultarInventario } = useExisteInventario();
  const { existe: existeSerie, consultarSerie } = useExisteSerie();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (equipoRedActivo) {
      setSelectedInventarioInv(equipoRedActivo.inventario);
      setSelectedInventarioAnio(equipoRedActivo.anio_compra);
      setCurrentImagePath(equipoRedActivo.imagenRuta);
      setNewObservation(equipoRedActivo.observacion ?? "");
      setSelectedMAC(equipoRedActivo.mac);
      setSelectedPuertos(equipoRedActivo.puertos);
      setSelectedPuertoFTP(equipoRedActivo.puerto_ftp);
      setNombreEquipo(equipoRedActivo.nombre_equipo ?? "");
      
      // Normalizar empresa a minúsculas para comparación y ajustar formato
      const empresaNormalizada = equipoRedActivo.empresa?.toLowerCase();
      if (empresaNormalizada === "espol") {
        setEmpresa("Espol");
      } else if (empresaNormalizada === "espoltech") {
        setEmpresa("EspolTech");
      } else {
        // Fallback al método anterior solo si no hay empresa
        equipoRedActivo.inventario.length === 10 ||
        equipoRedActivo.inventario.length === 12
          ? setEmpresa("EspolTech")
          : setEmpresa("Espol");
      }
    }
  }, [equipoRedActivo]);

  useEffect(() => {
    if (equipoRedActivo && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipoRedActivo.id_marca) ||
          null
      );
    }
  }, [equipoRedActivo, marcas]);

  useEffect(() => {
    if (equipoRedActivo && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find(
          (modelo) => modelo?.id_modelo === equipoRedActivo.id_modelo
        ) || null
      );
    }
  }, [equipoRedActivo, modelos]);

  useEffect(() => {
    if (equipoRedActivo && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoRedActivo.id_serie)
          ?.nombre || ""
      );
    }
  }, [equipoRedActivo, series]);

  useEffect(() => {
    if (equipoRedActivo && edificios.length > 0) {
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio?.id_edificio === equipoRedActivo.id_edificio
        ) || null
      );
    }
  }, [equipoRedActivo, edificios]);

  useEffect(() => {
    if (equipoRedActivo && ubicaciones.length > 0) {
      setSelectedUbicacion(
        ubicaciones.find(
          (ubicacion) =>
            ubicacion?.id_ubicacion === equipoRedActivo.id_ubicacion
        ) || null
      );
    }
  }, [equipoRedActivo, ubicaciones]);

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
        showMessage("Error al cargar la imagen", "error");
        return;
      }
    }

    const payload = {
      tipo: "activo",
      inventario: selectedInventarioInv,
      anio_compra: selectedInventarioAnio,
      id_usuario: "1",
      imagenRuta: image ? nuevaImagen : "",
      id_ubicacion: selectedUbicacion?.id_ubicacion ?? "",
      perifericoId: equipoRedActivo?.id_periferico,
      serie: selectedInventarioSerie ?? "",
      marcaId: selectedInventarioMarca?.id_marca ?? "",
      modeloId: selectedInventarioModelo?.id_modelo ?? "",
      observacion: observationValue ?? "",
      mac: selectedMAC ?? "",
      puertos: selectedPuertos ?? "",
      puerto_ftp: selectedPuertoFTP ?? "",
      nombre_equipo: nombreEquipo,
      empresa: empresa ?? "",
      editor: user?.email ?? undefined,
    };
    try {
      await editarActivoRed(equipoRedActivo.id_equipo, payload);
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
  const handlePuertosChange = (puertos: string) => {
    setSelectedPuertos(puertos);
    if (puertos === null) {
      setErrorPuertos(true);
    } else if (puertos !== null && /^\d+$/.test(puertos)) {
      setErrorPuertos(false);
    } else {
      setErrorPuertos(true);
    }
  };
  const handlePuertoFTPChange = (puertoFTP: string) => {
    setSelectedPuertoFTP(puertoFTP);
    if (puertoFTP === null) {
      setErrorPuertoFTP(true);
    } else if (puertoFTP !== null && /^\d+$/.test(puertoFTP)) {
      setErrorPuertoFTP(false);
    } else {
      setErrorPuertoFTP(true);
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
    if (
      !selectedInventarioInv ||
      errorInventario ||
      !selectedInventarioAnio ||
      errorAnio ||
      !selectedInventarioSerie ||
      !selectedUbicacion ||
      !selectedMAC ||
      (perifericoName === "AccessPoint" ? false : !selectedPuertos) ||
      (perifericoName === "AccessPoint" ? false : !selectedPuertoFTP)
    ) {
      setErrorMensajeEquipo("Por favor verificar todos los campos del equipo.");
      return false;
    }
    setErrorMensajeEquipo(null);
    return true;
  };

  const serieOriginal = series.find((serie) => serie?.id_serie === equipoRedActivo.id_serie)?.nombre || "";

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
              (
                existeInventario &&
                selectedInventarioInv !== equipoRedActivo.inventario &&
                selectedInventarioInv !== "S/N"
              )
            }
            helperText={
              errorInventario && selectedInventarioInv !== "S/N"
                ? "Por favor escribir un inventario válido"
                : existeInventario && selectedInventarioInv !== equipoRedActivo.inventario && selectedInventarioInv !== "S/N"
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
              if (value && value !== equipoRedActivo.inventario && value !== "S/N") {
                await consultarInventario(value);
              }
            }}
            disabled={empresa === "" || selectedInventarioInv === "S/N"}
          />
          <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gridColumn: "span 2" }}>
            <input
              type="checkbox"
              id="sin-inventario-editar"
              checked={selectedInventarioInv === "S/N"}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedInventarioInv("S/N");
                  setErrorInventario(false);
                } else {
                  setSelectedInventarioInv("");
                  setErrorInventario(true);
                }
              }}
              disabled={empresa === ""}
              style={{ marginRight: 4 }}
            />
            <label htmlFor="sin-inventario-editar" style={{ fontSize: "0.875rem", cursor: "pointer" }}>
              Sin inventario
            </label>
          </Box>
          <TextField
            label="Año de Compra"
            placeholder="Año de Compra"
            variant="outlined"
            fullWidth
            size="small"
            error={!!errorAnio}
            helperText={errorAnio ? "El año debe tener 4 dígitos y ser menor o igual al año actual" : ""}
            value={selectedInventarioAnio}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= 4) {
                setSelectedInventarioAnio(value);
                if (value.length === 4) {
                  const year = parseInt(value, 10);
                  const currentYear = new Date().getFullYear();
                  if (year > currentYear) {
                    setErrorAnio(true);
                  } else {
                    setErrorAnio(false);
                  }
                } else if (value.length < 4 && value.length > 0) {
                  setErrorAnio(true);
                } else {
                  setErrorAnio(false);
                }
              }
            }}
          />
        </Box>
      </div>

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
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
        <TextField
          label="MAC"
          placeholder="MAC"
          variant="outlined"
          fullWidth
          size="small"
          value={selectedMAC}
          error={!!errorMAC}
          helperText={errorMAC ? "Por favor escribir una MAC válida" : ""}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();

            if (value !== null && value.length > 17) {
              return;
            }
            handleMACChange(value);
          }}
        />
        <TextField
          label="Nombre Equipo"
          placeholder="Nombre Equipo"
          variant="outlined"
          fullWidth
          size="small"
          value={nombreEquipo}
          error={!!errorMensajeEquipo}
          helperText={
            errorMensajeEquipo ? "Por favor escribir un nombre del equipo" : ""
          }
          onChange={(e) => {
            let value = e.target.value;
            if (value !== null && value.length > 14) {
              value = value.slice(0, 14);
            }
            setNombreEquipo(value);
          }}
        />
        {perifericoName === "Switch" ? (
          <TextField
            label="Puertos 1000"
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
              handlePuertosChange(value);
            }}
            error={!!errorPuertos}
            helperText={
              errorPuertos
                ? "Por favor escribir una cantidad de puertos válidos"
                : ""
            }
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
            error={!!errorPuertoFTP}
            helperText={
              errorPuertoFTP ? "Por favor escribir un puerto FTP válido" : ""
            }
            onChange={(e) => {
              const value = e.target.value;

              if (value !== null && value.length > 10) {
                return;
              }
              handlePuertoFTPChange(value);
            }}
          />
        ) : (
          ""
        )}
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
            ) : equipoRedActivo.imagenRuta ? (
              <img
                src={`${API_BASE_URL}${equipoRedActivo.imagenRuta}`}
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
            (existeInventario && selectedInventarioInv !== equipoRedActivo.inventario && selectedInventarioInv !== "S/N") ||
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

export default EditarActivoRed;