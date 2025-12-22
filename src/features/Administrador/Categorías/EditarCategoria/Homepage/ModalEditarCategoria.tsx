import { FC, useState, useEffect } from "react";
import { Dialog, TextField, Tooltip, Autocomplete } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import useUsos from "@hooks/useUsos";
import useDiscos from "@hooks/useDiscos";
import useMarcas from "@hooks/useMarcas";
import useModelos from "@hooks/useModelos";
import usePerifericos from "@hooks/usePerifericos";
import useEdificios from "@hooks/useEdificios";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
import useRam from "@hooks/useRam";
import useProcesadores from "@hooks/useProcesadores";
import useVersionesOffice from "@hooks/useVersionesOffice";
import useDominios from "@hooks/useDominios";
import useVersionesCompletasSO from "@hooks/useVersionesCompletasSO";
import useUbicacionesCompletas from "@hooks/useUbicacionesCompletas";
import {
  Disco,
  Uso,
  Marca,
  Modelo,
  Periferico,
  Edificio,
  SistemaOperativo,
  VersionOffice,
  VersionSO,
  Ubicacion,
  Dominio,
  Procesador,
  RAM,
  Lampara,
} from "../../../../../types/index";
import { useEditarDominio } from "../../AgregarCategoria/hooks/useEditarDominio";
import { useEditarPeriferico } from "../../AgregarCategoria/hooks/useEditarPeriferico";
import { useEditarUso } from "../../AgregarCategoria/hooks/useEditarUso";
import { useEditarDisco } from "../../AgregarCategoria/hooks/useEditarDisco";
import { useEditarMarca } from "../../AgregarCategoria/hooks/useEditarMarca";
import { useEditarModelo } from "../../AgregarCategoria/hooks/useEditarModelo";
import { useEditarSistemaOperativo } from "../../AgregarCategoria/hooks/useEditarSistemaOperativo";
import { useEditarEdificio } from "../../AgregarCategoria/hooks/useEditarEdificio";
import { useEditarUbicacion } from "../../AgregarCategoria/hooks/useEditarUbicacion";
import { useEditarVersionSO } from "../../AgregarCategoria/hooks/useEditarVersionSO";
import { useEditarProcesador } from "../../AgregarCategoria/hooks/useEditarProcesador";
import { useEditarVersionOffice } from "../../AgregarCategoria/hooks/useEditarVersionOffice";
import { useEliminarDominio } from "../../AgregarCategoria/hooks/useEliminarDominio";
import { useEliminarPeriferico } from "../../AgregarCategoria/hooks/useEliminarPeriferico";
import { useEliminarUso } from "../../AgregarCategoria/hooks/useEliminarUso";
import { useEliminarDisco } from "../../AgregarCategoria/hooks/useEliminarDisco";
import { useEliminarMarca } from "../../AgregarCategoria/hooks/useEliminarMarca";
import { useEliminarSistemaOperativo } from "../../AgregarCategoria/hooks/useEliminarSistemaOperativo";
import { useEliminarEdificio } from "../../AgregarCategoria/hooks/useEliminarEdificio";
import { useEliminarUbicacion } from "../../AgregarCategoria/hooks/useEliminarUbicacion";
import { useEliminarVersionSO } from "../../AgregarCategoria/hooks/useEliminarVersionSO";
import { useEliminarProcesador } from "../../AgregarCategoria/hooks/useEliminarProcesador";
import { useEliminarVersionOffice } from "../../AgregarCategoria/hooks/useEliminarVersionOffice";
import { useEliminarModelo } from "../../AgregarCategoria/hooks/useEliminarModelo";
import useLamparas from "@hooks/useLamparas";
import { useEditarLampara } from "../../AgregarCategoria/hooks/useEditarLampara";
import { useEliminarLampara } from "../../AgregarCategoria/hooks/useEliminarLampara";
import { useEditarRAM } from "../../AgregarCategoria/hooks/useEditarRAM";
import { useEliminarRAM } from "../../AgregarCategoria/hooks/useEliminarRAM";
import { useObtenerMarcaDetalle } from "../../AgregarCategoria/hooks/useObtenerMarcaDetalle";
import { useObtenerModeloDetalle } from "../../AgregarCategoria/hooks/useObtenerModeloDetalle";
import { useSnackbar } from "@context/SnackbarContext";
import Loader from "@pages/Loader";
import { useObtenerTodasActividadesMantenimiento } from "@hooks/useObtenerTodasActividadesMantenimiento";
import { useEditarActividadMantenimiento } from "@hooks/useEditarActividadMantenimiento";
import { useEliminarActividadMantenimiento } from "@hooks/useEliminarActividadMantenimiento";

interface Actividad {
  id: number;
  actividad: string;
  tipo: string;
}

type Opcion =
  | Uso
  | Disco
  | Marca
  | Modelo
  | Periferico
  | Lampara
  | Dominio
  | Edificio
  | Ubicacion
  | SistemaOperativo
  | VersionOffice
  | VersionSO
  | Procesador
  | RAM
  | Actividad;

interface ModalEditarCategoriaProps {
  open: boolean;
  onClose: () => void;
  selectedCategoria: string | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

// Type guards corregidos con null checks
const isRAM = (obj: Opcion | null): obj is RAM =>
  obj !== null && "id_ram" in obj;
const isDisco = (obj: Opcion | null): obj is Disco =>
  obj !== null && "id_disco" in obj;
const isDominio = (obj: Opcion | null): obj is Dominio =>
  obj !== null && "id_dominio" in obj;
const isPeriferico = (obj: Opcion | null): obj is Periferico =>
  obj !== null && "id_periferico" in obj;
const isUso = (obj: Opcion | null): obj is Uso =>
  obj !== null && "id_uso" in obj;
const isMarca = (obj: Opcion | null): obj is Marca =>
  obj !== null && "id_marca" in obj;
const isModelo = (obj: Opcion | null): obj is Modelo =>
  obj !== null && "id_modelo" in obj;
const isLampara = (obj: Opcion | null): obj is Lampara =>
  obj !== null && "id_lampara" in obj;
const isSistemaOperativo = (obj: Opcion | null): obj is SistemaOperativo =>
  obj !== null && "id_sistemaoperativo" in obj;
const isEdificio = (obj: Opcion | null): obj is Edificio =>
  obj !== null && "id_edificio" in obj;
const isUbicacion = (obj: Opcion | null): obj is Ubicacion =>
  obj !== null && "id_ubicacion" in obj;
const isVersionSO = (obj: Opcion | null): obj is VersionSO =>
  obj !== null && "id_versionso" in obj;
const isProcesador = (obj: Opcion | null): obj is Procesador =>
  obj !== null && "id_procesador" in obj;
const isVersionOffice = (obj: Opcion | null): obj is VersionOffice =>
  obj !== null && "id_versionoffice" in obj;
const isActividad = (obj: Opcion | null): obj is Actividad =>
  obj !== null && "id" in obj && "actividad" in obj && "tipo" in obj;

const ModalEditarCategoria: FC<ModalEditarCategoriaProps> = ({
  open,
  onClose,
  selectedCategoria,
}) => {
  const { showMessage } = useSnackbar();
  const { usos } = useUsos();
  const { discos } = useDiscos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { perifericos } = usePerifericos();
  const { lamparasTotales } = useLamparas();
  const { edificios } = useEdificios();
  const { sistemasOperativos } = useSistemasOperativos();
  const { ubicaciones } = useUbicacionesCompletas();
  const { versionesSO } = useVersionesCompletasSO();
  const { dominios } = useDominios();
  const { ram } = useRam();
  const { procesadores } = useProcesadores();
  const { versionesOffice } = useVersionesOffice();
  const { actividades } = useObtenerTodasActividadesMantenimiento();

  const { editarDominio } = useEditarDominio();
  const { editarPeriferico } = useEditarPeriferico();
  const { editarUso } = useEditarUso();
  const { editarDisco } = useEditarDisco();
  const { editarMarca } = useEditarMarca();
  const { editarModelo } = useEditarModelo();
  const { editarLampara } = useEditarLampara();
  const { editarSistemaOperativo } = useEditarSistemaOperativo();
  const { editarEdificio } = useEditarEdificio();
  const { editarUbicacion } = useEditarUbicacion();
  const { editarVersionSO } = useEditarVersionSO();
  const { editarProcesador } = useEditarProcesador();
  const { editarVersionOffice } = useEditarVersionOffice();
  const { editarRAM } = useEditarRAM();
  const { editarActividad } = useEditarActividadMantenimiento();

  const { eliminarDominio } = useEliminarDominio();
  const { eliminarPeriferico } = useEliminarPeriferico();
  const { eliminarUso } = useEliminarUso();
  const { eliminarDisco } = useEliminarDisco();
  const { eliminarMarca } = useEliminarMarca();
  const { eliminarModelo } = useEliminarModelo();
  const { eliminarLampara } = useEliminarLampara();
  const { eliminarSistemaOperativo } = useEliminarSistemaOperativo();
  const { eliminarEdificio } = useEliminarEdificio();
  const { eliminarUbicacion } = useEliminarUbicacion();
  const { eliminarVersionSO } = useEliminarVersionSO();
  const { eliminarProcesador } = useEliminarProcesador();
  const { eliminarVersionOffice } = useEliminarVersionOffice();
  const { eliminarRAM } = useEliminarRAM();
  const { eliminarActividad } = useEliminarActividadMantenimiento();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Opcion | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [editedTipo, setEditedTipo] = useState<string>("");
  const [selectedPerifericosIds, setSelectedPerifericosIds] = useState<number[]>([]);
  const [marcaIdForDetalle, setMarcaIdForDetalle] = useState<number | null>(null);
  const [selectedMarcasIds, setSelectedMarcasIds] = useState<number[]>([]);
  const [modeloIdForDetalle, setModeloIdForDetalle] = useState<number | null>(null);
  
  const { marcaDetalle, loading: loadingMarcaDetalle } = useObtenerMarcaDetalle(marcaIdForDetalle);
  const { modeloDetalle, loading: loadingModeloDetalle } = useObtenerModeloDetalle(modeloIdForDetalle);

  const elementos: Opcion[] =
    selectedCategoria === "Uso"
      ? usos
      : selectedCategoria === "Disco"
      ? discos
      : selectedCategoria === "Marca"
      ? marcas
      : selectedCategoria === "Modelo"
      ? modelos
      : selectedCategoria === "Lampara"
      ? lamparasTotales
      : selectedCategoria === "Periférico"
      ? perifericos
      : selectedCategoria === "Edificio"
      ? edificios
      : selectedCategoria === "Ubicación"
      ? ubicaciones
      : selectedCategoria === "Versión SO"
      ? versionesSO
      : selectedCategoria === "Sistema Operativo"
      ? sistemasOperativos
      : selectedCategoria === "Dominio"
      ? dominios
      : selectedCategoria === "RAM"
      ? ram
      : selectedCategoria === "Procesador"
      ? procesadores
      : selectedCategoria === "Versión Office"
      ? versionesOffice
      : selectedCategoria === "Actividad de Mantenimiento"
      ? actividades
      : [];

  const handleEditarCategoria = (elemento: Opcion) => {
    setSelectedOption(elemento);
    if (selectedCategoria === "RAM" && isRAM(elemento)) {
      setEditedValue(elemento?.capacidad || "");
      setEditedTipo(elemento?.tipo || "");
    } else if (selectedCategoria === "Disco" && isDisco(elemento)) {
      setEditedValue(elemento?.capacidad || "");
    } else if (selectedCategoria === "Actividad de Mantenimiento" && isActividad(elemento)) {
      setEditedValue(elemento?.actividad || "");
      setEditedTipo(elemento?.tipo || "");
    } else if (elemento && "nombre" in elemento) {
      setEditedValue(elemento.nombre || "");
    }
    
    if (selectedCategoria === "Marca" && isMarca(elemento) && elemento) {
      setMarcaIdForDetalle(Number(elemento.id_marca));
    } else {
      setMarcaIdForDetalle(null);
      setSelectedPerifericosIds([]);
    }
    
    if (selectedCategoria === "Modelo" && isModelo(elemento) && elemento) {
      setModeloIdForDetalle(Number(elemento.id_modelo));
    } else {
      setModeloIdForDetalle(null);
      setSelectedMarcasIds([]);
    }
    
    setOpenEditModal(true);
  };
  
  useEffect(() => {
    if (marcaDetalle && marcaDetalle.perifericos) {
      setSelectedPerifericosIds(marcaDetalle.perifericos);
    }
  }, [marcaDetalle]);
  
  useEffect(() => {
    if (modeloDetalle && modeloDetalle.marcas) {
      setSelectedMarcasIds(modeloDetalle.marcas);
    }
  }, [modeloDetalle]);

  const handleSaveEdit = () => {
    if (selectedOption) {
      try {
        switch (selectedCategoria) {
          case "Dominio":
            if (isDominio(selectedOption)) {
              editarDominio({
                id_dominio: Number(selectedOption.id_dominio),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "RAM":
            if (isRAM(selectedOption)) {
              editarRAM({
                id_ram: Number(selectedOption.id_ram),
                tipo: editedTipo,
                capacidad: editedValue,
              });
            }
            break;
          case "Periférico":
            if (isPeriferico(selectedOption)) {
              editarPeriferico({
                id_periferico: Number(selectedOption.id_periferico),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Uso":
            if (isUso(selectedOption)) {
              editarUso({
                id_uso: Number(selectedOption.id_uso),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Disco":
            if (isDisco(selectedOption)) {
              editarDisco({
                id_disco: Number(selectedOption.id_disco),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Marca":
            if (isMarca(selectedOption)) {
              editarMarca({
                id_marca: Number(selectedOption.id_marca),
                nuevoNombre: editedValue,
                perifericosIds: selectedPerifericosIds,
              });
            }
            break;
          case "Modelo":
            if (isModelo(selectedOption)) {
              editarModelo({
                id_modelo: Number(selectedOption.id_modelo),
                nuevoNombre: editedValue,
                marcasIds: selectedMarcasIds,
              });
            }
            break;
          case "Lampara":
            if (isLampara(selectedOption)) {
              editarLampara({
                id_lampara: Number(selectedOption.id_lampara),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Sistema Operativo":
            if (isSistemaOperativo(selectedOption)) {
              editarSistemaOperativo({
                id_sistemaoperativo: Number(selectedOption.id_sistemaoperativo),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Edificio":
            if (isEdificio(selectedOption)) {
              editarEdificio({
                id_edificio: Number(selectedOption.id_edificio),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Ubicación":
            if (isUbicacion(selectedOption)) {
              editarUbicacion({
                id_ubicacion: Number(selectedOption.id_ubicacion),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Versión SO":
            if (isVersionSO(selectedOption)) {
              editarVersionSO({
                id_versionso: Number(selectedOption.id_versionso),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Procesador":
            if (isProcesador(selectedOption)) {
              editarProcesador({
                id_procesador: Number(selectedOption.id_procesador),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Versión Office":
            if (isVersionOffice(selectedOption)) {
              editarVersionOffice({
                id_versionoffice: Number(selectedOption.id_versionoffice),
                nuevoNombre: editedValue,
              });
            }
            break;
          case "Actividad de Mantenimiento":
            if (isActividad(selectedOption)) {
              editarActividad(selectedOption.id, {
                nombre: editedValue,
              });
            }
            break;
          default:
            showMessage(
              `No se puede editar la categoría ${selectedCategoria}`, "error")
            break;
        }

        showMessage("Subcategoría editada correctamente", "success");
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        showMessage("Error al editar la subcategoría", "error");
      }
    }
    setOpenEditModal(false);
  };

  const handleEliminarCategoria = async (elemento: Opcion) => {
    if (elemento) {
      try {
        switch (selectedCategoria) {
          case "Dominio":
            if (isDominio(elemento)) {
              await eliminarDominio(Number(elemento.id_dominio));
            }
            break;
          case "Periférico":
            if (isPeriferico(elemento)) {
              await eliminarPeriferico(Number(elemento.id_periferico));
            }
            break;
          case "Uso":
            if (isUso(elemento)) {
              await eliminarUso(Number(elemento.id_uso));
            }
            break;
          case "Disco":
            if (isDisco(elemento)) {
              await eliminarDisco(Number(elemento.id_disco));
            }
            break;
          case "Marca":
            if (isMarca(elemento)) {
              await eliminarMarca(Number(elemento.id_marca));
            }
            break;
          case "Modelo":
            if (isModelo(elemento)) {
              await eliminarModelo(Number(elemento.id_modelo));
            }
            break;
          case "Sistema Operativo":
            if (isSistemaOperativo(elemento)) {
              await eliminarSistemaOperativo(
                Number(elemento.id_sistemaoperativo)
              );
            }
            break;
          case "Edificio":
            if (isEdificio(elemento)) {
              await eliminarEdificio(Number(elemento.id_edificio));
            }
            break;
          case "Ubicación":
            if (isUbicacion(elemento)) {
              await eliminarUbicacion(Number(elemento.id_ubicacion));
            }
            break;
          case "Versión SO":
            if (isVersionSO(elemento)) {
              await eliminarVersionSO(Number(elemento.id_versionso));
            }
            break;
          case "RAM":
            if (isRAM(elemento)) {
              await eliminarRAM(Number(elemento.id_ram));
            }
            break;
          case "Procesador":
            if (isProcesador(elemento)) {
              await eliminarProcesador(Number(elemento.id_procesador));
            }
            break;
          case "Versión Office":
            if (isVersionOffice(elemento)) {
              await eliminarVersionOffice(Number(elemento.id_versionoffice));
            }
            break;
          case "Lampara":
            if (isLampara(elemento)) {
              await eliminarLampara(Number(elemento.id_lampara));
            }
            break;
          case "Actividad de Mantenimiento":
            if (isActividad(elemento)) {
              const result = await eliminarActividad(elemento.id);
              if (result.enUso) {
                showMessage(
                  `No se puede eliminar la actividad porque está relacionada con ${result.cantidadMantenimientos} mantenimiento(s)`, 
                  "error"
                );
                return;
              }
            }
            break;
          default:
            showMessage(
              `No se puede eliminar la categoría ${selectedCategoria}`, "error")
            break;
        }
        showMessage("Subcategoría eliminada correctamente", "success");
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        showMessage("Desligue la subcategoría antes de eliminarla", "error");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <div className="py-5 px-10">
          <h2 className="text-xl font-semibold mb-4">
            Editar {selectedCategoria}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 border">Subcategoría</th>
                  {(selectedCategoria === "RAM" || selectedCategoria === "Actividad de Mantenimiento") ? (
                    <th className="py-2 px-4 border">Subcategoría Tipo</th>
                  ) : (
                    <></>
                  )}
                  <th className="py-2 px-4 border">Acción</th>
                </tr>
              </thead>
              <tbody>
                {elementos.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      No hay opciones para esta categoría.
                    </td>
                  </tr>
                ) : (
                  elementos.map((elemento, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">
                        {elemento &&
                        selectedCategoria === "RAM" &&
                        isRAM(elemento)
                          ? elemento.capacidad
                          : elemento &&
                            selectedCategoria === "Disco" &&
                            isDisco(elemento)
                          ? elemento.capacidad
                          : elemento &&
                            selectedCategoria === "Actividad de Mantenimiento" &&
                            isActividad(elemento)
                          ? elemento.actividad
                          : elemento && "nombre" in elemento
                          ? elemento.nombre
                          : ""}
                      </td>
                      {selectedCategoria === "RAM" ? (
                        <td className="py-2 px-4 border">
                          {elemento && isRAM(elemento) ? elemento.tipo : ""}
                        </td>
                      ) : selectedCategoria === "Actividad de Mantenimiento" ? (
                        <td className="py-2 px-4 border">
                          {elemento && isActividad(elemento) ? elemento.tipo : ""}
                        </td>
                      ) : (
                        <></>
                      )}
                      <td className="py-2 px-3 border flex gap-2 items-center">
                        <Tooltip title="Editar Subcategoría">
                          <span>
                            <Icon
                              icon="mage:edit"
                              width="25"
                              height="25"
                              className="cursor-pointer"
                              onClick={() => handleEditarCategoria(elemento)}
                            />
                          </span>
                        </Tooltip>
                        <Tooltip title="Eliminar Subcategoría">
                          <span>
                            <Icon
                              icon="weui:delete-outlined"
                              width="25"
                              height="25"
                              className="cursor-pointer"
                              onClick={() => handleEliminarCategoria(elemento)}
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
        </div>

        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4">Editar Subcategoría</h3>
            {selectedCategoria === "Marca" ? (
              <>
                <TextField
                  label="Nombre de Marca"
                  variant="outlined"
                  fullWidth
                  value={editedValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 100) {
                      setEditedValue(value);
                    }
                  }}
                  className="mb-4"
                />
                {loadingMarcaDetalle ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader />
                  </div>
                ) : (
                  <Autocomplete
                    multiple
                    options={perifericos}
                    value={perifericos.filter(p => p && selectedPerifericosIds.includes(Number(p.id_periferico)))}
                    getOptionLabel={(option) => option?.nombre || ""}
                    onChange={(_, newValue) => {
                      setSelectedPerifericosIds(newValue.filter(p => p).map(p => Number(p!.id_periferico)));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Periféricos Relacionados"
                        variant="outlined"
                        placeholder="Seleccionar periféricos"
                      />
                    )}
                    className="my-4"
                  />
                )}
              </>
            ) : selectedCategoria === "Modelo" ? (
              <>
                <TextField
                  label="Nombre de Modelo"
                  variant="outlined"
                  fullWidth
                  value={editedValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 100) {
                      setEditedValue(value);
                    }
                  }}
                  className="mb-4"
                />
                {loadingModeloDetalle ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader />
                  </div>
                ) : (
                  <Autocomplete
                    multiple
                    options={marcas}
                    value={marcas.filter(m => m && selectedMarcasIds.includes(Number(m.id_marca)))}
                    getOptionLabel={(option) => option?.nombre || ""}
                    onChange={(_, newValue) => {
                      setSelectedMarcasIds(newValue.filter(m => m).map(m => Number(m!.id_marca)));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Marcas Relacionadas"
                        variant="outlined"
                        placeholder="Seleccionar marcas"
                      />
                    )}
                    className="my-4"
                  />
                )}
              </>
            ) : selectedCategoria === "RAM" ? (
              <>
                <TextField
                  label="Nuevo Tipo"
                  variant="outlined"
                  fullWidth
                  value={editedTipo}
                  onChange={(e) => {
                  const value = e.target.value;
                  if (value !== null && value.length > 6) {
                    return;
                  }
                  setEditedTipo(e.target.value);
                  }}
                />
                <div style={{ marginBottom: "1rem" }}></div>
                <TextField
                  label="Nueva Capacidad"
                  variant="outlined"
                  fullWidth
                  value={editedValue}
                  onChange={(e) => {
                  const value = e.target.value;
                  if (value !== null && value.length > 6) {
                    return;
                  }
                  setEditedValue(e.target.value);
                  }}
                  className="mt-3"
                />
              </>
            ) : selectedCategoria === "Actividad de Mantenimiento" ? (
              <>
                <TextField
                  label="Nombre de la Actividad"
                  variant="outlined"
                  fullWidth
                  value={editedValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value !== null && value.length > 100) {
                      return;
                    }
                    setEditedValue(e.target.value);
                  }}
                />
                <div style={{ marginBottom: "1rem" }}></div>
                <TextField
                  label="Tipo (Preventivo/Correctivo)"
                  variant="outlined"
                  fullWidth
                  value={editedTipo}
                  disabled
                  className="mt-3"
                />
              </>
            ) : (
              <TextField
                label="Nuevo Valor"
                variant="outlined"
                fullWidth
                value={editedValue}
                onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 30) {
                return;
              }
              setEditedValue(e.target.value);
              }}
              />
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="py-2 px-4 bg-gray-300 rounded"
                onClick={() => setOpenEditModal(false)}
              >
                Cancelar
              </button>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded"
                onClick={handleSaveEdit}
              >
                Guardar
              </button>
            </div>
          </div>
        </Dialog>
      </Dialog>
    </>
  );
};

export default ModalEditarCategoria;