import React, { useEffect, useState, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  FormHelperText,
  Tooltip,
} from "@mui/material";
import {
  Marca,
  Modelo,
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
import { antivirus, protocolos, API_BASE_URL } from "../../../../../data";
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
import { useSnackbar } from "@context/SnackbarContext.tsx";
import { useExisteInventario } from "../../../../../hooks/useExisteInventario";
import { useExisteSerie } from "../../../../../hooks/useExisteSerie";
import { useUser } from "@context/userContext.tsx";

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
    useState<string>("");
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [selectedInventarioAnio, setSelectedInventarioAnio] =
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
  const { showMessage } = useSnackbar();

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
    serie: "",
    inventario: "",
  });
  const [newObservation, setNewObservation] = useState<string>("");
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
    string | null
  >(null);
  const [empresa, setEmpresa] = useState<string | null>("");
  const [errorEmpresa, setErrorEmpresa] = useState<boolean>(false);
  const [errorNombreEquipo, setErrorNombreEquipo] = useState<boolean>(false);
  const [empresaNuevoComponente, setEmpresaNuevoComponente] = useState<
    string | null
  >("");
  const [errorEmpresaNuevoComponente, setErrorEmpresaNuevoComponente] =
    useState<boolean>(false);
  const [errorInventario, setErrorInventario] = useState<boolean>(false);
  const [errorAnio, setErrorAnio] = useState<boolean>(false);
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
  const { user } = useUser();
  const { existe: existeInventario, consultarInventario } = useExisteInventario();
  const { existe: existeSerie, consultarSerie } = useExisteSerie();

  const filteredPerifericos = perifericos.filter((p) => {
    const normalize = (s?: string) =>
      (s ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();

    const key = normalize(p?.nombre);

    const allowedLimits: Record<string, number> = {
      mouse: 1,
      teclado: 1,
      monitor: 2,
      camara: 2,
      "pantalla interactiva": 1,
      microfono: 4,
      televisor: 1,
      "barra polycom": 1,
    };

    const limit = allowedLimits[key];
    if (!limit) {
      return false;
    }

    const existingCount = componentesState.filter(
      (comp) => normalize(comp.periferico?.nombre) === key
    ).length;

    return existingCount < limit;
  });
  const { marcas: marcasComponente } = useMarcasPorPeriferico(
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const { modelos: modelosComponente } = useModelosPorMarcaPeriferico(
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.periferico?.id_periferico ?? ""
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (equipo && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipo.id_marca) || null
      );
    }
  }, [equipo, marcas]);

  useEffect(() => {
    if (equipo && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipo.id_modelo) || null
      );
    }
  }, [equipo, modelos]);

  useEffect(() => {
    if (equipo && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipo.id_serie)?.nombre ||
          ""
      );
    }
  }, [equipo, series]);

  useEffect(() => {
    if (equipo && sistemasOperativos.length > 0) {
      setSelectedSO(
        sistemasOperativos.find(
          (so) => so?.id_sistemaoperativo === equipo.id_sistemaoperativo
        ) || null
      );
    }
  }, [equipo, sistemasOperativos]);

  useEffect(() => {
    if (equipo && versionesSO.length > 0) {
      setSelectedVersionSO(
        versionesSO.find(
          (version) => version?.id_versionso === equipo.id_versionso
        ) || null
      );
    }
  }, [equipo, versionesSO]);

  useEffect(() => {
    if (equipo && ram.length > 0) {
      setSelectedRAM(
        ram.find((ramItem) => ramItem?.id_ram === equipo.id_ram) || null
      );
    }
  }, [equipo, ram]);

  useEffect(() => {
    if (equipo && discos.length > 0) {
      setSelectedDisco(
        discos.find((disco) => disco?.id_disco === equipo.id_disco) || null
      );
    }
  }, [equipo, discos]);

  useEffect(() => {
    if (equipo && procesadores.length > 0) {
      setSelectedProcesador(
        procesadores.find(
          (procesador) => procesador?.id_procesador === equipo.id_procesador
        ) || null
      );
    }
  }, [equipo, procesadores]);

  useEffect(() => {
    if (equipo && dominios.length > 0) {
      setSelectedDominio(
        dominios.find((dominio) => dominio?.id_dominio === equipo.id_dominio) ||
          null
      );
    }
  }, [equipo, dominios]);

  useEffect(() => {
    if (equipo && edificios.length > 0) {
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio?.id_edificio === equipo.id_edificio
        ) || null
      );
    }
  }, [equipo, edificios]);

  useEffect(() => {
    if (equipo && ubicaciones.length > 0) {
      setSelectedUbicacion(
        ubicaciones.find(
          (ubicacion) => ubicacion?.id_ubicacion === equipo.id_ubicacion
        ) || null
      );
    }
  }, [equipo, ubicaciones]);

  useEffect(() => {
    if (equipo && antivirus.length > 0) {
      setSelectedAntivirus(
        antivirus.find(
          (av) => Number(av.id_antivirus) === equipo.id_antivirus
        ) || null
      );
    }
  }, [equipo]);

  useEffect(() => {
    if (equipo && versionesOffice.length > 0) {
      setSelectedVersionOffice(
        versionesOffice.find(
          (version) => version?.id_versionoffice === equipo.id_versionoffice
        ) || null
      );
    }
  }, [equipo, versionesOffice]);

  useEffect(() => {
    if (equipo) {
      setSelectedInventarioInv(equipo.inventario);
      setSelectedInventarioAnio(equipo.anio_compra);
      setCurrentImagePath(equipo.imagenRuta);
      setNombreEquipo(equipo.nombre_equipo);
      setDireccionIP(equipo.direccion_ip);
      setProtocolo(equipo.direccion_ip ? "0" : "1");
      setNewObservation(equipo.observacion);
      
      // Normalizar empresa a minúsculas para comparación y ajustar formato
      const empresaNormalizada = equipo.empresa?.toLowerCase();
      if (empresaNormalizada === "espol") {
        setEmpresa("Espol");
      } else if (empresaNormalizada === "espoltech") {
        setEmpresa("EspolTech");
      } else {
        // Fallback al método anterior solo si no hay empresa
        equipo.inventario.length === 10 || equipo.inventario.length === 12
          ? setEmpresa("EspolTech")
          : setEmpresa("Espol");
      }
    }
  }, [equipo]);

  const handleAddComponente = () => {
    const nombre = nuevoComponente.periferico?.nombre?.toLowerCase();
    const cantidad = componentesState.filter(
      (comp) => comp.periferico?.nombre?.toLowerCase() === nombre
    ).length;

    if (
      (nombre === "teclado" && cantidad >= 1) ||
      (nombre === "mouse" && cantidad >= 1) ||
      (nombre === "monitor" && cantidad >= 2)
    ) {
      showMessage(
        nombre === "monitor"
          ? "Solo puedes agregar hasta 2 Monitores."
          : `Solo puedes agregar un ${
              nombre.charAt(0).toUpperCase() + nombre.slice(1)
            }.`,
        "error"
      );
      return;
    }

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
        serie: "",
        inventario: "",
      });
    } else {
      showMessage(
        "Por favor, complete todos los campos antes de agregar el componente.",
        "error"
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
        showMessage("Error al subir la imagen", "error");
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
      perifericoId: equipo?.id_periferico,
      serie: selectedInventarioSerie ?? "",
      modeloId: selectedInventarioModelo?.id_modelo ?? "",
      inventario: selectedInventarioInv,
      anio_compra: selectedInventarioAnio,
      nombre_equipo: nombreEquipo,
      direccion_ip: protocolo === "0" ? direccionIP : "",
      id_usuario: idUsuario ?? "",
      id_ubicacion: selectedUbicacion?.id_ubicacion ?? "",
      imagenRuta: image ? nuevaImagen : "",
      observacion: observationValue,
      empresa: empresa ?? "",
      editor: user?.email ?? undefined,
    };
    try {
      await editarActivo(equipo.id_equipo, payload);
      if (equipo.id_equipo) {
        await gestionarComponentes({
          tipo: "activo",
          equipoId: Number(equipo.id_equipo),
          componentes: componentesState.map((comp) => ({
            id_componente: comp.id_componente,
            inventario: comp.inventario,
            perifericoId: Number(comp.periferico?.id_periferico) ?? 0,
            serie: comp.serie,
            modeloId: Number(comp.modelo?.id_modelo) ?? 0,
          })),
          ubicacionId: Number(selectedUbicacion?.id_ubicacion) ?? 0,
          usuarioId: parseInt(idUsuario ?? "", 10),
          imagenRuta: nuevaImagen ?? "",
          editor: user?.email ?? undefined,
        });
      }
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

  const handleCancelar = () => {
    setOpenModalCancelar(false);
    navigate("/activos");
  };

  const handleConfirmCancelar = () => {
    setOpenModalCancelar(true);
  };
  const validarCamposEquipo = () => {
    if (!selectedInventarioInv) {
      setErrorMensajeEquipo("El campo Inventario es obligatorio.");
      return false;
    }
    if (errorInventario) {
      setErrorMensajeEquipo("El inventario no es válido.");
      return false;
    }
    if (!selectedInventarioAnio) {
      setErrorMensajeEquipo("El campo Año de Compra es obligatorio.");
      return false;
    }
    if (errorAnio) {
      setErrorMensajeEquipo("El año de compra no es válido.");
      return false;
    }
    if (!selectedInventarioSerie) {
      setErrorMensajeEquipo("El campo Serie es obligatorio.");
      return false;
    }
    if (!nombreEquipo) {
      setErrorMensajeEquipo("El campo Nombre Equipo es obligatorio.");
      return false;
    }
    if (errorNombreEquipo) {
      setErrorMensajeEquipo("El nombre de equipo no es válido.");
      return false;
    }
    if (!selectedVersionSO) {
      setErrorMensajeEquipo("Debe seleccionar una versión de SO.");
      return false;
    }
    if (!selectedVersionOffice) {
      setErrorMensajeEquipo("Debe seleccionar una versión de Office.");
      return false;
    }
    if (!selectedRAM) {
      setErrorMensajeEquipo("Debe seleccionar la RAM.");
      return false;
    }
    if (!selectedDisco) {
      setErrorMensajeEquipo("Debe seleccionar el Disco.");
      return false;
    }
    if (!selectedProcesador) {
      setErrorMensajeEquipo("Debe seleccionar el Procesador.");
      return false;
    }
    if (!selectedDominio) {
      setErrorMensajeEquipo("Debe seleccionar el Dominio.");
      return false;
    }
    if (!selectedUbicacion) {
      setErrorMensajeEquipo("Debe seleccionar la Ubicación.");
      return false;
    }
    if (protocolo === "0" && !validateIP(direccionIP)) {
      setErrorMensajeEquipo("La dirección IP no es válida.");
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
  const handleChangeEmpresaNuevoComponente = (
    newEmpresaNuevoComponente: string | null
  ) => {
    setEmpresaNuevoComponente(newEmpresaNuevoComponente);
    if (newEmpresaNuevoComponente === null) {
      setErrorEmpresaNuevoComponente(true);
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

  const handleNombreEquipo = (value: string) => {
    setNombreEquipo(value);
    if (value.length === 14) {
      setErrorNombreEquipo(false);
    } else {
      setErrorNombreEquipo(true);
    }
  };

  // Serie original
  const serieOriginal = series.find((serie) => serie?.id_serie === equipo.id_serie)?.nombre || "";

  // Inventario original
  const inventarioOriginal = equipo.inventario;

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
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <TextField
              label="Inventario"
              placeholder="Inventario"
              variant="outlined"
              fullWidth
              size="small"
              value={selectedInventarioInv}
              error={
                !!errorInventario ||
                (selectedInventarioInv !== "S/N" && existeInventario && selectedInventarioInv !== inventarioOriginal)
              }
              helperText={
                errorInventario && selectedInventarioInv !== "S/N"
                  ? "Por favor escribir un inventario válido"
                  : selectedInventarioInv !== "S/N" && existeInventario && selectedInventarioInv !== inventarioOriginal
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
                if (value && value !== "S/N" && value !== inventarioOriginal) {
                  await consultarInventario(value);
                }
              }}
              disabled={empresa === "" || selectedInventarioInv === "S/N"}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <input
                type="checkbox"
                id="sin-inventario-editar-computadora"
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
              />
              <label htmlFor="sin-inventario-editar-computadora">Sin inventario</label>
            </Box>
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
              const value = e.target.value;
              if (value !== null && value.length > 15) {
                return;
              }
              handleIP(value);
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
          error={!!errorNombreEquipo}
          helperText={
            errorNombreEquipo
              ? "Por favor escribir un nombre de equipo válido"
              : ""
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value !== null && value.length > 14) {
              return;
            }
            handleNombreEquipo(value);
          }}
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
                src={`${API_BASE_URL}${equipo.imagenRuta}`}
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
                {componentesState.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 px-4 text-gray-500"
                    >
                      No hay componentes disponibles.
                    </td>
                  </tr>
                ) : (
                  componentesState.map((comp, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">
                        {comp.periferico?.nombre}
                      </td>
                      <td className="py-2 px-4 border">{comp.marca?.nombre}</td>
                      <td className="py-2 px-4 border">
                        {comp.modelo?.nombre}
                      </td>
                      <td className="py-2 px-4 border">
                        {typeof comp.serie === "object" &&
                        comp.serie !== null &&
                        (comp.serie as { nombre?: string }).nombre !== undefined
                          ? (comp.serie as { nombre?: string }).nombre
                          : comp.serie}
                      </td>
                      <td className="py-2 px-4 border">{comp.inventario}</td>
                      <td className="py-2 px-1 border">
                        <Tooltip title="Desligar Componente">
                          <span>
                            <Icon
                              icon="fluent-mdl2:disconnect-virtual-machine"
                              width="25"
                              height="25"
                              onClick={() => eliminarComponente(index)}
                              className="cursor-pointer mx-auto"
                            />
                          </span>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex-1 space-y-4">
            <Autocomplete
              size="small"
              disablePortal
              options={filteredPerifericos}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(_, newValue) =>
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
              onChange={(_, newValue) =>
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
              onChange={(_, newValue) =>
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
            <TextField
              label="Serie"
              variant="outlined"
              fullWidth
              size="small"
              value={
                typeof nuevoComponente.serie === "string"
                  ? nuevoComponente.serie
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value !== null && value.length > 30) {
                  return;
                }
                setNuevoComponente({
                  ...nuevoComponente,
                  serie: value,
                });
              }}
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
                onChange={(_, newValue) => {
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
              <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <TextField
                  label="Inventario"
                  placeholder="Inventario"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={nuevoComponente.inventario}
                  error={!!errorNuevoComponenteInventario && nuevoComponente.inventario !== "S/N"}
                  helperText={
                    errorNuevoComponenteInventario && nuevoComponente.inventario !== "S/N"
                      ? "Por favor escribir un inventario válido"
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      empresaNuevoComponente === "Espol" &&
                      value !== null &&
                      value.length > 8
                    ) {
                      return;
                    } else if (
                      empresaNuevoComponente === "EspolTech" &&
                      value !== null &&
                      value.length > 25
                    ) {
                      return;
                    }
                    handleChangeNuevoComponenteInventario(value);
                  }}
                  disabled={empresa === "" || nuevoComponente.inventario === "S/N"}
                />
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <input
                    type="checkbox"
                    id="sin-inventario-componente"
                    checked={nuevoComponente.inventario === "S/N"}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNuevoComponente({
                          ...nuevoComponente,
                          inventario: "S/N"
                        });
                        setErrorNuevoComponenteInventario(false);
                      } else {
                        setNuevoComponente({
                          ...nuevoComponente,
                          inventario: ""
                        });
                        setErrorNuevoComponenteInventario(true);
                      }
                    }}
                    disabled={empresaNuevoComponente === ""}
                  />
                  <label htmlFor="sin-inventario-componente">Sin inventario</label>
                </Box>
              </Box>
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
            (existeInventario && selectedInventarioInv !== inventarioOriginal && selectedInventarioInv !== "S/N") ||
            (existeSerie && selectedInventarioSerie !== serieOriginal)
          }
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
