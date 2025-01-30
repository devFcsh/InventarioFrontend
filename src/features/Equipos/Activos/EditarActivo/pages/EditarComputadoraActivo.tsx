import React, { useEffect, useState, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  FormHelperText,
} from "@mui/material";
import {
  Marca,
  Modelo,
  Serie,
  SistemaOperativo,
  VersionSO,
  RAM,
  Disco,
  Dominio,
  VersionOffice,
  Ubicacion,
  Edificio,
  Antivirus,
  Procesador,
} from "../../../../../types";
import { ActivoComputadoraEdit } from "../../../../../types/Activo";
import { Componente } from "../../../../../types/Activo/Componente";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import useDiscos from "../../../../../hooks/useDiscos";
import useDominios from "../../../../../hooks/useDominios";
import useRam from "../../../../../hooks/useRam";
import useSistemasOperativos from "../../../../../hooks/useSistemasOperativos";
import useVersionesSO from "../../../../../hooks/useVersionesSO";
import useVersionesOffice from "../../../../../hooks/useVersionesOffice";
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";
import { antivirus, protocolos } from "../../../../../data";
import { Icon } from "@iconify/react";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import usePerifericos from "../../../../../hooks/usePerifericos";
import useSubirImagen from "../../../../../hooks/useSubirImagen";
import useEditarActivo from "../hooks/useEditarActivo";
import { useGestionarComponentes } from "../hooks/useGestionarComponentes";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";
import useProcesadores from "@hooks/useProcesadores";
import { validateIP } from "../../../../../pages/Forms/helpers/validateIP.ts";
import { validateInventario } from "@pages/Forms/helpers/validateInventario.ts";

interface EditarComputadoraActivoProps {
  equipo: ActivoComputadoraEdit;
  idUsuario: string | null;
  componentes: Componente[];
}

const EditarComputadoraActivo = ({
  equipo,
  idUsuario,
  componentes,
}: EditarComputadoraActivoProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [errorDireccionIP, setErrorDireccionIP] = useState(false);
  const [componentesState, setComponentesState] =
    useState<Componente[]>(componentes);
  const [selectedSO, setSelectedSO] = useState<SistemaOperativo | null>(null);
  const [selectedVersionSO, setSelectedVersionSO] = useState<VersionSO | null>(
    null
  );
  const [errorMensajeEquipo, setErrorMensajeEquipo] = useState<string | null>(
    null
  );
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();
  const [selectedRAM, setSelectedRAM] = useState<RAM | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);
  const [selectedProcesador, setSelectedProcesador] =
    useState<Procesador | null>(null);
  const [selectedDominio, setSelectedDominio] = useState<Dominio | null>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(
    null
  );
  const [selectedVersionOffice, setSelectedVersionOffice] =
    useState<VersionOffice | null>(null);
  const [selectedAntivirus, setSelectedAntivirus] = useState<Antivirus | null>(
    null
  );
  const [nombreEquipo, setNombreEquipo] = useState<string>("");
  const [protocolo, setProtocolo] = useState<string>("");
  const [direccionIP, setDireccionIP] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const [nuevoComponente, setNuevoComponente] = useState<Componente>({
    id_componente: undefined,
    periferico: null,
    marca: null,
    modelo: null,
    serie: null,
    inventario: "",
  });
  const [newObservation, setNewObservation] = useState<string>("");
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
    string | null
  >(null);
  const [empresa, setEmpresa] = useState<string | null>("");
  const [errorEmpresa, setErrorEmpresa] = useState<boolean>(false);
  const [empresaNuevoComponente, setEmpresaNuevoComponente] = useState<
    string | null
  >("");
  const [errorEmpresaNuevoComponente, setErrorEmpresaNuevoComponente] =
    useState<boolean>(false);
  const [errorInventario, setErrorInventario] = useState<boolean>(false);
  const [errorNuevoComponenteInventario, setErrorNuevoComponenteInventario] =
    useState<boolean>(false);

  const { uploadImage } = useSubirImagen();
  const { marcas } = useMarcasPorPeriferico(equipo?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipo?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { discos } = useDiscos();
  const { procesadores } = useProcesadores();
  const { dominios } = useDominios();
  const { ram } = useRam();
  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO(selectedSO?.id_sistemaoperativo ?? "");
  const { versionesOffice } = useVersionesOffice();
  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");
  const { editarActivo } = useEditarActivo();
  const { gestionarComponentes } = useGestionarComponentes();
  const { perifericos } = usePerifericos();

  const filteredPerifericos = perifericos.filter(
    (p) =>
      p?.nombre.toLowerCase() !== "computadora" &&
      p?.nombre.toLowerCase() !== "laptop"
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (equipo) {
      setSelectedInventarioInv(equipo.inventario);
      setCurrentImagePath(equipo.imagenRuta);
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipo.id_marca) || null
      );
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipo.id_modelo) || null
      );
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipo.id_serie) || null
      );
      setSelectedSO(
        sistemasOperativos.find(
          (so) => so?.id_sistemaoperativo === equipo.id_sistemaoperativo
        ) || null
      );
      setSelectedVersionSO(
        versionesSO.find(
          (version) => version?.id_versionso === equipo.id_versionso
        ) || null
      );
      setSelectedRAM(
        ram.find((ramItem) => ramItem?.id_ram === equipo.id_ram) || null
      );
      setSelectedDisco(
        discos.find((disco) => disco?.id_disco === equipo.id_disco) || null
      );
      setSelectedProcesador(
        procesadores.find(
          (procesador) => procesador?.id_procesador === equipo.id_procesador
        ) || null
      );
      setSelectedDominio(
        dominios.find((dominio) => dominio?.id_dominio === equipo.id_dominio) ||
          null
      );
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio?.id_edificio === equipo.id_edificio
        ) || null
      );
      setSelectedUbicacion(
        ubicaciones.find(
          (ubicacion) => ubicacion?.id_ubicacion === equipo.id_ubicacion
        ) || null
      );
      setSelectedVersionOffice(
        versionesOffice.find(
          (version) => version?.id_versionoffice === equipo.id_versionoffice
        ) || null
      );
      setSelectedAntivirus(
        antivirus.find(
          (av) => Number(av.id_antivirus) === equipo.id_antivirus
        ) || null
      );
      setNombreEquipo(equipo.nombre_equipo);
      setDireccionIP(equipo.direccion_ip);
      setProtocolo(equipo.direccion_ip ? "0" : "1");
      setNewObservation(equipo.observacion);
      equipo.inventario.length === 10
        ? setEmpresa("EspolTech")
        : setEmpresa("Espol");
    }
  }, [
    equipo,
    marcas,
    modelos,
    series,
    ram,
    discos,
    procesadores,
    dominios,
    versionesOffice,
  ]);

  const handleAddComponente = () => {
    if (
      nuevoComponente.periferico &&
      nuevoComponente.marca &&
      nuevoComponente.modelo &&
      nuevoComponente.serie &&
      nuevoComponente.inventario
    ) {
      const newComponent = { ...nuevoComponente };
      setComponentesState([...componentesState, newComponent]);
      setNuevoComponente({
        id_componente: undefined,
        periferico: null,
        marca: null,
        modelo: null,
        serie: null,
        inventario: "",
      });
    } else {
      alert(
        "Por favor, complete todos los campos antes de agregar el componente."
      );
    }
  };

  const eliminarComponente = (index: number) => {
    const updatedComponentes = componentesState.filter((_, i) => i !== index);
    setComponentesState(updatedComponentes);
  };

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
        alert("Error al cargar la imagen.");
        return;
      }
    }

    const payload = {
      tipo: "activo",
      id_ram: selectedRAM?.id_ram ?? "",
      id_disco: selectedDisco?.id_disco ?? "",
      id_procesador: selectedProcesador?.id_procesador ?? "",
      id_versionso: selectedVersionSO?.id_versionso ?? "",
      id_versionoffice: selectedVersionOffice?.id_versionoffice ?? "",
      id_antivirus: selectedAntivirus?.id_antivirus ?? "",
      id_dominio: selectedDominio?.id_dominio ?? "",
      id_serie: selectedInventarioSerie?.id_serie ?? "",
      inventario: selectedInventarioInv,
      nombre_equipo: nombreEquipo,
      direccion_ip: protocolo === "0" ? direccionIP : "",
      id_usuario: idUsuario ?? "",
      id_ubicacion: selectedUbicacion?.id_ubicacion ?? "",
      imagenRuta: image ? nuevaImagen : "",
      observacion: observationValue,
    };
    try {
      await editarActivo(equipo.id_equipo, payload);

      if (componentesState.length > 0 && equipo.id_equipo) {
        await gestionarComponentes({
          tipo: "activo",
          equipoId: Number(equipo.id_equipo),
          componentes: componentesState.map((comp) => ({
            id_componente: comp.id_componente,
            inventario: comp.inventario,
            serieId: Number(comp.serie?.id_serie) ?? 0,
          })),
          ubicacionId: Number(selectedUbicacion?.id_ubicacion) ?? 0,
          usuarioId: parseInt(idUsuario ?? "", 10),
          imagenRuta: nuevaImagen ?? "",
        });
        setShowSuccessMessage(true);
        navigate("/activos", { state: { equipoEditado: true } });
      } else {
        setShowSuccessMessage(true);
        navigate("/activos", { state: { equipoEditado: true } });
      }
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
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
      !selectedInventarioSerie ||
      !nombreEquipo ||
      !selectedVersionSO ||
      !selectedVersionOffice ||
      !selectedRAM ||
      !selectedDisco ||
      !selectedProcesador ||
      !selectedDominio ||
      !selectedUbicacion ||
      !(protocolo === "0" ? validateIP(direccionIP) : true)
    ) {
      setErrorMensajeEquipo("Por favor, complete todos los campos del equipo.");
      return false;
    }
    setErrorMensajeEquipo(null);
    return true;
  };
  const handleIP = (value: string) => {
    setDireccionIP(value);
    if (!validateIP(value) && protocolo === "0") {
      setErrorDireccionIP(true);
    } else {
      setErrorDireccionIP(false);
    }
  };
  const handleProtocolo = (value: string) => {
    setProtocolo(value);
    if (value === "0" && !validateIP(direccionIP)) {
      setErrorDireccionIP(true);
    } else {
      setErrorDireccionIP(false);
      setDireccionIP("");
    }
  };

  const handleObservation = (newObservation: string) => {
    setNewObservation(newObservation);
    if (!(newObservation.length <= 200)) {
      setErrorMensajeComponente(
        "La observación no puede tener más de 200 caracteres."
      );
    } else {
      setErrorMensajeComponente("");
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
  const handleChangeEmpresaNuevoComponente = (
    newEmpresaNuevoComponente: string | null
  ) => {
    setEmpresaNuevoComponente(newEmpresaNuevoComponente);
    if (newEmpresaNuevoComponente === null) {
      setErrorEmpresaNuevoComponente(true);
      setNuevoComponente({
        ...nuevoComponente,
        inventario: "",
      });
      setErrorNuevoComponenteInventario(true);
    } else {
      setErrorEmpresaNuevoComponente(false);
      !validateInventario(nuevoComponente.inventario, newEmpresaNuevoComponente)
        ? setErrorNuevoComponenteInventario(true)
        : setErrorNuevoComponenteInventario(false);
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
  const handleChangeNuevoComponenteInventario = (
    nuevoComponenteInventario: string
  ) => {
    setNuevoComponente({
      ...nuevoComponente,
      inventario: nuevoComponenteInventario,
    });
    if (empresaNuevoComponente === "Espol") {
      !validateInventario(
        nuevoComponenteInventario ? nuevoComponenteInventario : "",
        empresaNuevoComponente
      )
        ? setErrorNuevoComponenteInventario(true)
        : setErrorNuevoComponenteInventario(false);
    } else if (empresaNuevoComponente === "EspolTech") {
      !validateInventario(
        nuevoComponenteInventario ? nuevoComponenteInventario : "",
        empresaNuevoComponente
      )
        ? setErrorNuevoComponenteInventario(true)
        : setErrorNuevoComponenteInventario(false);
    }
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
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
      >
        <Alert severity="success">Equipo agregado exitosamente</Alert>
      </Snackbar>
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
          disabled
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
          disabled
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
          disabled
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
            onChange={(event, newValue) => {
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
            onChange={(e) => handleChangeInventario(e.target.value)}
            disabled={empresa === ""}
          />
        </Box>
      </div>

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Autocomplete
          size="small"
          disablePortal
          options={sistemasOperativos}
          value={selectedSO}
          onChange={(_, newValue) => {
            setSelectedSO(newValue);
            setSelectedVersionSO(null);
          }}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sistema Operativo"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Autocomplete
          size="small"
          disablePortal
          options={versionesSO}
          value={selectedVersionSO}
          onChange={(_, newValue) => setSelectedVersionSO(newValue)}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Versión SO"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!selectedSO}
        />

        <Autocomplete
          size="small"
          disablePortal
          options={antivirus}
          value={selectedAntivirus}
          onChange={(_, newValue) => setSelectedAntivirus(newValue)}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Antivirus"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={versionesOffice}
          value={selectedVersionOffice}
          onChange={(_, newValue) => setSelectedVersionOffice(newValue)}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Versión Office"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={ram}
          value={selectedRAM}
          onChange={(_, newValue) => setSelectedRAM(newValue)}
          getOptionLabel={(option) => `${option?.capacidad} - ${option?.tipo}`}
          renderInput={(params) => (
            <TextField {...params} label="RAM" variant="outlined" fullWidth />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={discos}
          value={selectedDisco}
          onChange={(_, newValue) => setSelectedDisco(newValue)}
          getOptionLabel={(option) => (option ? option.capacidad : "")}
          renderInput={(params) => (
            <TextField {...params} label="Disco" variant="outlined" fullWidth />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={procesadores}
          value={selectedProcesador}
          onChange={(_, newValue) => setSelectedProcesador(newValue)}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Procesador"
              variant="outlined"
              fullWidth
            />
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
            options={protocolos}
            value={protocolos.find((p) => p.id === protocolo) || null}
            onChange={(_, newValue) => handleProtocolo(newValue?.id || "1")}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Protocolo"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <TextField
            label="Dirección IP"
            placeholder="Dirección IP"
            variant="outlined"
            fullWidth
            size="small"
            value={direccionIP}
            error={!!errorDireccionIP}
            onChange={(e) => {
              handleIP(e.target.value);
            }}
            disabled={protocolo !== "0"}
            sx={{ marginRight: 4, width: "50%" }}
          />
          {errorDireccionIP && (
            <FormHelperText error sx={{ marginLeft: "auto", color: "green" }}>
              Por favor escribir una dirección IP válida
            </FormHelperText>
          )}
        </Box>
        <TextField
          size="small"
          label="Nombre Equipo"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Autocomplete
          size="small"
          disablePortal
          options={dominios}
          value={selectedDominio}
          onChange={(_, newValue) => setSelectedDominio(newValue)}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dominio"
              variant="outlined"
              fullWidth
            />
          )}
        />
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
            ) : equipo.imagenRuta ? (
              <img
                src={`http://localhost:5000${equipo.imagenRuta}`}
                alt="Imagen del equipo"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">Haz clic para cargar una imagen</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-10">Componentes</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 border">Periférico</th>
                  <th className="py-2 px-4 border">Marca</th>
                  <th className="py-2 px-4 border">Modelo</th>
                  <th className="py-2 px-4 border">Serie</th>
                  <th className="py-2 px-4 border">Inventario</th>
                  <th className="py-2 px-1 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {componentesState.map((comp, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">
                      {comp.periferico?.nombre}
                    </td>
                    <td className="py-2 px-4 border">{comp.marca?.nombre}</td>
                    <td className="py-2 px-4 border">{comp.modelo?.nombre}</td>
                    <td className="py-2 px-4 border">{comp.serie?.nombre}</td>
                    <td className="py-2 px-4 border">{comp.inventario}</td>
                    <td className="py-2 px-1 border">
                      <Icon
                        icon="fluent-mdl2:disconnect-virtual-machine"
                        width="25"
                        height="25"
                        onClick={() => eliminarComponente(index)}
                        className="cursor-pointer mx-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex-1 space-y-4">
            <Autocomplete
              size="small"
              disablePortal
              options={filteredPerifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, periferico: newValue })
              }
              value={nuevoComponente.periferico}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periferico"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={marcasComponente}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, marca: newValue })
              }
              value={nuevoComponente.marca}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marca"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={modelosComponente}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, modelo: newValue })
              }
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
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, serie: newValue })
              }
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
                value={empresaNuevoComponente}
                onChange={(event, newValue) => {
                  handleChangeEmpresaNuevoComponente(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empresa"
                    variant="outlined"
                    error={!!errorEmpresaNuevoComponente}
                    helperText={
                      errorEmpresaNuevoComponente
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
                error={!!errorNuevoComponenteInventario}
                helperText={
                  errorNuevoComponenteInventario
                    ? "Por favor escribir un inventario válido"
                    : ""
                }
                onChange={(e) =>
                  handleChangeNuevoComponenteInventario(e.target.value)
                }
                disabled={empresa === ""}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComponente}
              fullWidth
            >
              Agregar Componente
            </Button>
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
          minRows={4}
          value={newObservation}
          onChange={(e) => {
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
          Editar Activo
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

export default EditarComputadoraActivo;
