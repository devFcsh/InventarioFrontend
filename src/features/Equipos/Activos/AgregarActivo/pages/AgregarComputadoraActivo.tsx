import {
  Autocomplete,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import {
  Marca,
  Modelo,
  Serie,
  Periferico,
  SistemaOperativo,
  VersionSO,
  RAM,
  Disco,
  Dominio,
  VersionOffice,
  Ubicacion,
  Edificio,
  Antivirus,
} from "../../../../../types";
import { Componente } from "../../../../../types/Activo/Componente/index.ts";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import usePerifericos from "@hooks/usePerifericos";
import useDiscos from "@hooks/useDiscos";
import useDominios from "@hooks/useDominios";
import useRam from "@hooks/useRam";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
import useVersionesSO from "@hooks/useVersionesSO";
import { antivirus, protocolos } from "../../../../../data";
import { Icon } from "@iconify/react";
import useVersionesOffice from "@hooks/useVersionesOffice";
import useEdificios from "@hooks/useEdificios";
import useUbicaciones from "@hooks/useUbicaciones.ts";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";
import useSubirImagen from "@hooks/useSubirImagen";
import { useAgregarComputadoraActivo } from "../hooks/useAgregarComputadoraActivo";
import { useAgregarComponentes } from "../../../../../hooks/useAgregarComponentes.ts";

interface AgregarComputadoraActivoProps {
  periferico: string;
  idUso: string | null;
  idUsuario: string | null;
}

const AgregarComputadoraActivo = ({
  periferico,
  idUso,
  idUsuario,
}: AgregarComputadoraActivoProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] = useState<
    string | null
  >("");
  const [selectedSO, setSelectedSO] = useState<SistemaOperativo | null>(null);
  const [selectedVersionSO, setSelectedVersionSO] = useState<VersionSO | null>(
    null
  );
  const [selectedRAM, setSelectedRAM] = useState<RAM | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);
  const [selectedDominio, setSelectedDominio] = useState<Dominio | null>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null);
  const [selectedVersionOffice, setSelectedVersionOffice] =
    useState<VersionOffice | null>(null);
  const [selectedAntivirus, setSelectedAntivirus] = useState<Antivirus | null>(
    null
  );
  const [nombreEquipo, setNombreEquipo] = useState<string | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [direccionIP, setDireccionIP] = useState<string>("");

  const [nuevoComponente, setNuevoComponente] = useState<Componente>({
    periferico: null,
    marca: null,
    modelo: null,
    serie: null,
    inventario: "",
  });
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
    string | null
  >(null);
  const [errorMensajeEquipo, setErrorMensajeEquipo] = useState<string | null>(
    null
  );
  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { agregarComputadoraActivo } = useAgregarComputadoraActivo();
  const { agregarComponentes } = useAgregarComponentes();
  const { marcas } = useMarcasPorPeriferico(periferico);
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    periferico
  );
  const { series } = useSeriesPorModelo(
    periferico,
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );

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

  const { uploadImage } = useSubirImagen();
  const { versionesOffice } = useVersionesOffice();
  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");
  const { discos } = useDiscos();
  const { dominios } = useDominios();
  const { ram } = useRam();
  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO(selectedSO?.id_sistemaoperativo ?? "");

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

  const handleAgregarEquipo = async () => {
    if (!idUso || !idUsuario) {
      setErrorMensajeEquipo("Por favor, complete todos los campos del equipo.");
      return;
    }

    let imagePath = "";
    if (image) {
      try {
        imagePath = await uploadImage(image);
      } catch (error) {
        alert("Error al cargar la imagen.");
        return;
      }
    }

    if (!selectedInventarioInv) {
      alert("El campo de inventario no puede estar vacío.");
      return;
    }

    const equipoData = {
      tipo: "activo",
      inventario: selectedInventarioInv || "",
      serie: Number(selectedInventarioSerie?.id_serie) ?? 0,
      nombreEquipo: nombreEquipo || "",
      direccionIp: direccionIP,
      versionso: Number(selectedVersionSO?.id_versionso) ?? 0,
      versionoffice: Number(selectedVersionOffice?.id_versionoffice) ?? 0,
      ram: Number(selectedRAM?.id_ram) ?? 0,
      disco: Number(selectedDisco?.id_disco) ?? 0,
      antivirus: Number(selectedAntivirus?.id_antivirus) ?? 0,
      dominio: Number(selectedDominio?.id_dominio) ?? 0,
      idUbicacion: Number(selectedUbicacion?.id_ubicacion) ?? 0,
      idUsuario: parseInt(idUsuario, 10),
      imagenRuta: imagePath,
      observacion: "",
    };

    try {
      const equipoId = await agregarComputadoraActivo(equipoData);

      if (componentes.length > 0 && equipoId) {
        await agregarComponentes({
          tipo: "activo",
          equipoId: equipoId,
          componentes: componentes.map((comp) => ({
            inventario: comp.inventario,
            serieId: Number(comp.serie?.id_serie) ?? 0,
          })),
          ubicacionId: Number(selectedUbicacion?.id_ubicacion) ?? 0,
          usuarioId: parseInt(idUsuario, 10),
          imagenRuta: imagePath,
        });
      }

      setShowSuccessMessage(true);
      limpiarCampos();
      navigate("/activos", { state: { equipoAgregado: true } });
    } catch (error) {
      console.error("Error al agregar el equipo y componentes:", error);
      alert("Error al agregar el equipo y componentes.");
    }
  };

  const navigate = useNavigate();

  const handleCancelar = () => {
    limpiarCampos();
    setOpenModalCancelar(false);
    navigate("/activos");
  };

  const limpiarCampos = () => {
    setSelectedInventarioMarca(null);
    setSelectedInventarioModelo(null);
    setSelectedInventarioSerie(null);
    setSelectedInventarioInv("");
    setSelectedSO(null);
    setSelectedVersionSO(null);
    setSelectedRAM(null);
    setSelectedDisco(null);
    setSelectedDominio(null);
    setSelectedEdificio(null);
    setSelectedAntivirus(null);
    setSelectedUbicacion(null);
    setSelectedVersionOffice(null);
    setNombreEquipo("");
    setProtocolo(null);
    setDireccionIP("");
    setNuevoComponente({
      periferico: null,
      marca: null,
      modelo: null,
      serie: null,
      inventario: "",
    });
    setComponentes([]);
    setImage(null);
    setErrorMensajeEquipo(null);
    setErrorMensajeComponente(null);
  };

  useEffect(() => {
    setSelectedInventarioMarca(null);
    setSelectedInventarioModelo(null);
    setSelectedInventarioSerie(null);
  }, [periferico]);

  const handleMarcaChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Marca | null
  ) => {
    setSelectedInventarioMarca(newValue);
    setSelectedInventarioModelo(null);
    setSelectedInventarioSerie(null);
  };

  const handleModeloChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null
  ) => {
    setSelectedInventarioModelo(newValue);
    setSelectedInventarioSerie(null);
  };

  const handleSerieChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Serie | null
  ) => {
    setSelectedInventarioSerie(newValue);
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

  const eliminarComponente = (index: number) => {
    setComponentes(componentes.filter((_, i) => i !== index));
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleConfirmAgregarEquipo = () => {
    if (validarCamposEquipo()) {
      setOpenModalAgregar(true);
    }
  };

  const handleConfirmCancelar = () => {
    setOpenModalCancelar(true);
  };

  const handleModalConfirmAgregar = async () => {
    setOpenModalAgregar(false);
    await handleAgregarEquipo();
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
      !selectedDominio ||
      !selectedUbicacion
    ) {
      setErrorMensajeEquipo("Por favor, complete todos los campos del equipo.");
      return false;
    }
    setErrorMensajeEquipo(null);
    return true;
  };

  return (
    <>
      <ModalConfirmation
        open={openModalAgregar}
        onClose={() => setOpenModalAgregar(false)}
        onConfirm={handleModalConfirmAgregar}
        title="Confirmar Agregar Equipo"
        message="¿Está seguro de que desea agregar este equipo?"
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">
          Información de Inventario
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option: Marca) => option?.nombre || ""}
            onChange={handleMarcaChange}
            value={selectedInventarioMarca}
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
            options={modelos}
            getOptionLabel={(option: Modelo) => option?.nombre || ""}
            onChange={handleModeloChange}
            value={selectedInventarioModelo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Modelo"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={!selectedInventarioMarca}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={series}
            getOptionLabel={(option: Serie) => option?.nombre || ""}
            onChange={handleSerieChange}
            value={selectedInventarioSerie}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serie"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={!selectedInventarioModelo}
          />
          <TextField
            label="Inventario"
            placeholder="Inventario"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedInventarioInv}
            onChange={(e) => setSelectedInventarioInv(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Información General</h2>
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            size="small"
            disablePortal
            options={sistemasOperativos}
            getOptionLabel={(option) => option?.nombre || ""}
            value={selectedSO}
            onChange={(_, newValue) => setSelectedSO(newValue)}
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
            getOptionLabel={(option) => option?.nombre || ""}
            value={selectedVersionSO}
            onChange={(_, newValue) => setSelectedVersionSO(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Versión SO"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={antivirus}
            getOptionLabel={(option) => option.nombre}
            value={selectedAntivirus}
            onChange={(_, newValue) => setSelectedAntivirus(newValue)}
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
            getOptionLabel={(option) => option?.nombre || ""}
            value={selectedVersionOffice}
            onChange={(_, newValue) => setSelectedVersionOffice(newValue)}
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
            getOptionLabel={(option: RAM) =>
              `${option?.capacidad} - ${option?.tipo}`
            }
            value={selectedRAM}
            onChange={(_, newValue) => setSelectedRAM(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="RAM" variant="outlined" fullWidth />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={discos}
            getOptionLabel={(option) => option?.capacidad || ""}
            value={selectedDisco}
            onChange={(_, newValue) => setSelectedDisco(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Disco"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={protocolos}
            getOptionLabel={(option) => option.nombre}
            value={protocolos.find((p) => p.id === protocolo) || null}
            onChange={(_, newValue) => {
              if (newValue) {
                setProtocolo(newValue.id);
              } else {
                setProtocolo("1");
              }
            }}
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
            onChange={(e) => setDireccionIP(e.target.value)}
            disabled={protocolo !== "0"}
          />
          <TextField
            label="Nombre Equipo"
            placeholder="Nombre Equipo"
            variant="outlined"
            fullWidth
            size="small"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={dominios}
            getOptionLabel={(option) => option?.nombre || ""}
            value={selectedDominio}
            onChange={(_, newValue) => setSelectedDominio(newValue)}
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
            getOptionLabel={(option) => option?.nombre || ""}
            value={selectedEdificio}
            onChange={(_, newValue) => setSelectedEdificio(newValue)}
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
            getOptionLabel={(option) => option?.nombre || ""}
            value={selectedUbicacion}
            onChange={(_, newValue) => setSelectedUbicacion(newValue)}
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
                {componentes.map((comp, index) => (
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
                        icon="weui:delete-outlined"
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
            <Button
              variant="contained"
              color="primary"
              onClick={agregarComponente}
              fullWidth
            >
              Agregar Componente
            </Button>
            {errorMensajeComponente && (
              <div className="text-red-500 mb-4">{errorMensajeComponente}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmAgregarEquipo}
          fullWidth
        >
          Agregar Equipo
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleConfirmCancelar}
          fullWidth
        >
          Cancelar
        </Button>
      </div>
      {errorMensajeEquipo && (
        <div className="text-red-500 mt-2">{errorMensajeEquipo}</div>
      )}
    </>
  );
};

export default AgregarComputadoraActivo;
