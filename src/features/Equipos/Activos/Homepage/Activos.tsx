import { Alert, Autocomplete, Snackbar, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Link, useLocation } from "react-router-dom";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import { ModalAgregarActivo } from "../../../../features/Equipos/Activos/AgregarActivo/pages/ModalAgregarActivo.tsx";
import {
  Periferico,
  Marca,
  Modelo,
  Serie,
  Inventario,
} from "../../../../types";
import usePerifericos from "../../../../hooks/usePerifericos";
import { useEquiposFiltrados } from "../hooks/useEquiposFiltrados";
import { filas } from "../../../../data";
import { useDarDeBajaEquipo } from "../hooks/useDarDeBajaEquipo";
import { useEliminarComputadora } from "@hooks/useEliminarComputadora.ts";
import useEdificios from "@hooks/useEdificios.ts";
import useUsos from "@hooks/useUsos.ts";
import useMarcas from "@hooks/useMarcas.ts";
import useModelos from "@hooks/useModelos.ts";
import useSeries from "@hooks/useSeries.ts";
import { useInventario } from "@hooks/useInventario.ts";
import { usePasarActivoABodega } from "../hooks/usePasarActivoABodega.ts";
import { useExportarEquiposActivos } from "../hooks/useExportarComputadorasActivos.ts";
import {
  ExportarAP,
  ExportarComputadora,
  ExportarProyector,
  ExportarSimples,
  ExportarSwitch,
} from "../../../../types/Equipo/index.ts";
import { useNavigate } from "react-router-dom";

const Activos = () => {
  const [selectedPeriferico, setSelectedPeriferico] =
    useState<Periferico | null>(null);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<Modelo | null>(null);
  const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);
  const [selectedInventario, setSelectedInventario] =
    useState<Inventario | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalActivos, setOpenModalActivos] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({
    title: "Confirmar",
    message: "¿Estás seguro de que deseas realizar esta acción?",
  });

  const [modalContentActivos, setModalContentActivos] = useState<{
    title: string;
    message: string;
  }>({
    title: "Agregar Activos",
    message: "Seleccione el periférico a registrar",
  });

  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { perifericos } = usePerifericos();
  const { edificios } = useEdificios();
  const { usos } = useUsos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { series } = useSeries();
  const { inventarios } = useInventario();
  const { pasarActivoABodega } = usePasarActivoABodega();
  const { fetchTodosEquipos } = useExportarEquiposActivos();

  const location = useLocation();
  const filtros = {
    perifericoId: selectedPeriferico?.id_periferico,
    marcaId: selectedMarca?.id_marca,
    modeloId: selectedModelo?.id_modelo,
    serieId: selectedSerie?.id_serie,
    inventario: selectedInventario?.inventario,
  };

  const { eliminarEquipo } = useEliminarComputadora();
  const { darDeBajaEquipo } = useDarDeBajaEquipo();
  const { equipos, totalCount, loading, error } = useEquiposFiltrados(
    filtros,
    currentPage,
    rowsPerPage,
    shouldFetch
  );

  useEffect(() => {
    if (totalCount > 0 && rowsPerPage > 0) {
      setTotalPages(Math.ceil(totalCount / rowsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [totalCount, rowsPerPage]);

  useEffect(() => {
    if (shouldFetch) {
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (location.state && location.state.equipoAgregado) {
      setSnackbarMessage("¡Equipo agregado con éxito!");
      setOpenSnackbar(true);
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state && location.state.equipoEditado) {
      setSnackbarMessage("¡Equipo editado con éxito!");
      setOpenSnackbar(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const handleConfirm = async () => {
    try {
      await confirmAction();
    } catch (error) {
      alert("Error en la acción");
    }
    handleCloseModal();
  };

  const deleteEquipo = async (equipoId: string) => {
    if (equipoId) {
      const inventario = equipos.filter(
        (equipo) => equipoId === equipo.id_equipo
      )[0].inventario;
      try {
        const result = await eliminarEquipo(equipoId);
        if (result) {
          setShouldFetch(true);
          setSnackbarMessage(`Equipo con inventario ${inventario} eliminado.`);
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage(
            `No se puede eliminar el equipo con inventario ${inventario} porque está asociado a una computadora`
          );
          setSnackbarSeverity("error");
        }
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage(
          `Error al eliminar el equipo con inventario ${inventario}.`
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const deleteEquipos = async (equipoIds: string[]) => {
    try {
      const errorsInventarios = [];
      for (const id of equipoIds) {
        const result = await eliminarEquipo(id);
        const inventario = equipos.filter(
          (equipo) => id === equipo.id_equipo
        )[0].inventario;
        if (!result) {
          errorsInventarios.push(inventario);
        }
      }

      if (errorsInventarios.length === 0) {
        setSnackbarMessage("Operación completada con éxito");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(
          `No se pudieron eliminar los equipos: ${errorsInventarios.join(
            ", "
          )} ya que están relacionados a una computadora`
        );
        setSnackbarSeverity("error");
      }

      setShouldFetch(true);
      setSelectedItems([]);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Error al eliminar los equipos");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const pasarABodegaEquipo = async (equipoId: string) => {
    if (equipoId) {
      const inventario = equipos.filter(
        (equipo) => equipoId === equipo.id_equipo
      )[0].inventario;
      try {
        const result = await pasarActivoABodega(equipoId);
        if (result) {
          setShouldFetch(true);
          setSnackbarMessage(
            `Equipo con inventario ${inventario} pasado a bodega`
          );
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage(
            `No se puede pasar a bodega el equipo con inventario ${inventario}porque el equipo está asociado a una computadora`
          );
          setSnackbarSeverity("error");
        }
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage(
          `Error al pasar a bodega el equipo con inventario ${inventario}`
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const pasarABodegaEquipos = async (equipoIds: string[]) => {
    const errorsInventarios = [];
    try {
      for (const id of equipoIds) {
        const result = await pasarActivoABodega(id);
        const inventario = equipos.filter(
          (equipo) => id === equipo.id_equipo
        )[0].inventario;
        if (!result) {
          errorsInventarios.push(inventario);
        }
      }

      if (errorsInventarios.length === 0) {
        setSnackbarMessage("Operación completada con éxito");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(
          `No se pudieron pasar los equipos con inventarios: ${errorsInventarios.join(
            ", "
          )} a bodega ya que están relacionados a una computadora`
        );
        setSnackbarSeverity("error");
      }

      setShouldFetch(true);
      setSelectedItems([]);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Error al pasar a bodega los equipos");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const bajaEquipo = async (equipoId: string) => {
    if (equipoId) {
      const inventario = equipos.filter(
        (equipo) => equipoId === equipo.id_equipo
      )[0].inventario;
      try {
        const result = await darDeBajaEquipo(equipoId, "activo");
        if (result) {
          setShouldFetch(true);
          setSnackbarMessage(
            `Equipo con inventario ${inventario} dado de baja`
          );
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage(
            `No se puede dar de baja al equipo con inventario ${inventario} ya que está asociado a una computadora`
          );
          setSnackbarSeverity("error");
        }
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage(
          `Error al dar de baja al equipo con inventario ${inventario}`
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const bajaEquipos = async (equipoIds: string[]) => {
    const errorsInventarios = [];
    try {
      for (const id of equipoIds) {
        const result = await darDeBajaEquipo(id, "baja");
        const inventario = equipos.filter(
          (equipo) => id === equipo.id_equipo
        )[0].inventario;
        if (!result) {
          errorsInventarios.push(inventario);
        }
      }
      if (errorsInventarios.length === 0) {
        setShouldFetch(true);
        setSnackbarMessage("Operación completada con éxito");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(
          `Error al dar de baja los equipos con inventario ${errorsInventarios.join(
            ", "
          )} ya que están relacionados a una computadora`
        );
        setSnackbarSeverity("error");
      }
      setSelectedItems([]);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Error al dar de baja los equipos");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handlePasarABodega = () => {
    if (selectedItems.length === 0) {
      console.log("Debe seleccionar al menos un elemento");
      return;
    }

    setModalContent({
      title: "Pasar a Bodega Equipos",
      message: "¿Estás seguro de que pasar a bodega los equipos seleccionados?",
    });

    setConfirmAction(() => async () => {
      await pasarABodegaEquipos(selectedItems);
      setOpenModal(false);
    });

    setOpenModal(true);
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      console.log("Debe seleccionar al menos un elemento");
      return;
    }

    setModalContent({
      title: "Eliminar Equipos",
      message:
        "¿Estás seguro de que deseas eliminar los equipos seleccionados?",
    });

    setConfirmAction(() => async () => {
      await deleteEquipos(selectedItems);
      setOpenModal(false);
    });

    setOpenModal(true);
  };

  const handleOpenModal = (
    id: string,
    title: string,
    message: string,
    action: (id: string) => Promise<void>
  ) => {
    setModalContent({ title, message });
    setConfirmAction(() => () => action(id));
    setOpenModal(true);
  };
  const handleOpenActivos = () => setOpenModalActivos(true);
  const handleCloseActivos = () => setOpenModalActivos(false);

  const handleBaja = () => {
    setModalContent({
      title: "Dar de Baja Equipos",
      message:
        "¿Estás seguro de que deseas dar de baja los equipos seleccionados?",
    });
    setConfirmAction(() => async () => {
      if (selectedItems.length === 0) {
        console.log("Debe seleccionar al menos un elemento");
        return;
      }
      await bajaEquipos(selectedItems);
      setOpenModal(false);
    });
    setOpenModal(true);
  };

  const handlePerifericoChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Periferico | null
  ) => {
    setSelectedPeriferico(newValue);
  };

  const handleMarcaChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Marca | null
  ) => {
    setSelectedMarca(newValue);
  };

  const handleModeloChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null
  ) => {
    setSelectedModelo(newValue);
  };

  const handleSerieChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Serie | null
  ) => {
    setSelectedSerie(newValue);
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    setShouldFetch(true);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedItems(equipos.map((equipo) => equipo.id_equipo));
    } else {
      setSelectedItems([]);
    }
  };

  const handleRowsPerPageChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: { id: number; name: string } | null
  ) => {
    const rows = parseInt(newValue?.name || "10", 10);
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setShouldFetch(true);
    }
  };

  const exportToExcel = async () => {
    try {
      const allEquipos = await fetchTodosEquipos();

      if (!allEquipos) {
        console.warn("No hay equipos para exportar");
        return;
      }

      const addIDColumn = (equipos: any[]) => {
        return equipos.map((equipo, index) => ({
          id: index + 1,
          ...equipo,
        }));
      };

      const formatComputadora = (equipos: ExportarComputadora[]) => {
        return addIDColumn(
          equipos.map(
            ({
              empresa,
              edificio,
              ubicacion,
              uso,
              usuario,
              direccion_ip,
              nombre_equipo,
              dominio,
              sistema_operativo,
              version_sistema_operativo,
              procesador,
              tipo_ram,
              capacidad_ram,
              capacidad_disco,
              marca,
              modelo,
              serie,
              inventario,
              fecha_ultimo_cambio,
              observacion,
              mouse_marca,
              mouse_modelo,
              mouse_serie,
              mouse_inventario,
              teclado_marca,
              teclado_modelo,
              teclado_serie,
              teclado_inventario,
              monitor_marca,
              monitor_modelo,
              monitor_serie,
              monitor_inventario,
            }) => ({
              tipo: "Computadora",
              empresa,
              inventario,
              marca,
              modelo,
              serie,
              edificio,
              ubicacion,
              uso,
              usuario,
              direccion_ip,
              nombre_equipo,
              dominio,
              sistema_operativo,
              version_sistema_operativo,
              procesador,
              tipo_ram,
              capacidad_ram,
              capacidad_disco,
              fecha_ultimo_cambio: new Date(
                fecha_ultimo_cambio
              ).toLocaleString(),
              observacion,
              mouse_marca: mouse_marca || "",
              mouse_modelo: mouse_modelo || "",
              mouse_serie: mouse_serie || "",
              mouse_inventario: mouse_inventario || "",
              teclado_marca: teclado_marca || "",
              teclado_modelo: teclado_modelo || "",
              teclado_serie: teclado_serie || "",
              teclado_inventario: teclado_inventario || "",
              monitor_marca: monitor_marca || "",
              monitor_modelo: monitor_modelo || "",
              monitor_serie: monitor_serie || "",
              monitor_inventario: monitor_inventario || "",
            })
          )
        );
      };

      const formatSwitch = (equipos: ExportarSwitch[]) => {
        return addIDColumn(
          equipos.map(
            ({
              empresa,
              inventario,
              edificio,
              ubicacion,
              marca,
              modelo,
              serie,
              mac,
              puertos,
              puerto_ftp,
              nombre_equipo,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: "Switch",
              empresa,
              inventario,
              marca,
              modelo,
              serie,
              mac,
              edificio,
              ubicacion,
              "puertos-10-100-1000": puertos,
              puerto_ftp,
              nombre_equipo,
              fecha_ultimo_cambio: new Date(
                fecha_ultimo_cambio
              ).toLocaleString(),
              observacion,
            })
          )
        );
      };

      const formatAP = (equipos: ExportarAP[]) => {
        return addIDColumn(
          equipos.map(
            ({
              empresa,
              inventario,
              edificio,
              ubicacion,
              marca,
              modelo,
              serie,
              mac,
              nombre_equipo,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: "AP",
              empresa,
              inventario,
              marca,
              modelo,
              serie,
              mac,
              edificio,
              ubicacion,
              nombre_equipo,
              fecha_ultimo_cambio: new Date(
                fecha_ultimo_cambio
              ).toLocaleString(),
              observacion,
            })
          )
        );
      };

      const formatProyector = (equipos: ExportarProyector[]) => {
        return addIDColumn(
          equipos.map(
            ({
              empresa,
              inventario,
              edificio,
              ubicacion,
              marca,
              modelo,
              serie,
              lampara,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: "Proyector",
              empresa,
              inventario,
              marca,
              modelo,
              serie,
              lampara,
              edificio,
              ubicacion,
              fecha_ultimo_cambio: new Date(
                fecha_ultimo_cambio
              ).toLocaleString(),
              observacion,
            })
          )
        );
      };

      const formatEquiposSimples = (equipos: ExportarSimples[]) => {
        return addIDColumn(
          equipos.map(
            ({
              periferico,
              empresa,
              edificio,
              ubicacion,
              uso,
              usuario,
              marca,
              modelo,
              serie,
              inventario,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: periferico,
              empresa,
              inventario,
              marca,
              modelo,
              serie,
              edificio,
              ubicacion,
              uso,
              usuario,
              fecha_ultimo_cambio: new Date(
                fecha_ultimo_cambio
              ).toLocaleString(),
              observacion,
            })
          )
        );
      };

      const wsComputadoras = XLSX.utils.json_to_sheet(
        formatComputadora(allEquipos.Computadoras)
      );
      const wsAP = XLSX.utils.json_to_sheet(formatAP(allEquipos.AP));
      const wsSwitch = XLSX.utils.json_to_sheet(
        formatSwitch(allEquipos.Switch)
      );
      const wsProyector = XLSX.utils.json_to_sheet(
        formatProyector(allEquipos.Proyector)
      );
      const wsEquiposSimples = XLSX.utils.json_to_sheet(
        formatEquiposSimples(allEquipos.EquiposSimples)
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsComputadoras, "Computadoras");
      XLSX.utils.book_append_sheet(wb, wsAP, "AP");
      XLSX.utils.book_append_sheet(wb, wsSwitch, "Switch");
      XLSX.utils.book_append_sheet(wb, wsProyector, "Proyector");
      XLSX.utils.book_append_sheet(wb, wsEquiposSimples, "Equipos Simples");

      XLSX.writeFile(wb, "datos_equipos_activos.xlsx");
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="flex flex-col p-4">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          iconMapping={{
            success: (
              <Icon icon="fluent:checkmark-24-regular" width={20} height={20} />
            ),
            error: (
              <Icon
                icon="fluent:error-circle-24-regular"
                width={20}
                height={20}
              />
            ),
            warning: (
              <Icon icon="fluent:warning-24-regular" width={20} height={20} />
            ),
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold my-5">Consulta de Activos</h1>

          <div className="relative group">
            <Icon
              icon="gridicons:add"
              width="30"
              height="30"
              className="text-green-900 hover:text-green-950"
              onClick={handleOpenActivos}
            />
            <span className="absolute left-1/2 transform -translate-x-1/3 top-full mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              Agregar activo
            </span>
          </div>
          <ModalAgregarActivo
            open={openModalActivos}
            onClose={handleCloseActivos}
            title={modalContentActivos.title}
            perifericos={perifericos}
            usos={usos}
            edificios={edificios}
            steps={[]}
          />
        </div>
        <div className="flex flex-wrap gap-4 my-10">
          <Autocomplete
            size="small"
            disablePortal
            options={perifericos}
            getOptionLabel={(option) => option?.nombre || ""}
            onChange={handlePerifericoChange}
            value={selectedPeriferico}
            isOptionEqualToValue={(option, value) =>
              option?.id_periferico === value?.id_periferico
            }
            renderInput={(params) => (
              <TextField {...params} label="Periférico" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option) => option?.nombre || ""}
            onChange={handleMarcaChange}
            value={selectedMarca}
            isOptionEqualToValue={(option, value) =>
              option?.id_marca === value?.id_marca
            }
            renderInput={(params) => (
              <TextField {...params} label="Marca" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />
          <Autocomplete
            size="small"
            disablePortal
            options={modelos}
            getOptionLabel={(option) => option?.nombre || ""}
            onChange={handleModeloChange}
            value={selectedModelo}
            isOptionEqualToValue={(option, value) =>
              option?.id_modelo === value?.id_modelo
            }
            renderInput={(params) => (
              <TextField {...params} label="Modelo" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <Autocomplete
            size="small"
            disablePortal
            options={series}
            getOptionLabel={(option) => option?.nombre || ""}
            onChange={handleSerieChange}
            value={selectedSerie}
            isOptionEqualToValue={(option, value) =>
              option?.id_serie === value?.id_serie
            }
            renderInput={(params) => (
              <TextField {...params} label="Serie" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />
          <Autocomplete
            size="small"
            disablePortal
            options={inventarios}
            getOptionLabel={(option) => option.inventario || ""}
            onChange={(event, newValue) => setSelectedInventario(newValue)}
            value={selectedInventario}
            isOptionEqualToValue={(option, value) =>
              option.inventario === value?.inventario
            }
            renderInput={(params) => (
              <TextField {...params} label="Inventario" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <div className="flex flex-col w-full md:w-1/5 md:flex-row gap-4 md:gap-2 lg:ml-2">
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              onChange={handleRowsPerPageChange}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Filas" variant="outlined" />
              )}
              value={filas.find((option) => option.id === rowsPerPage)}
              className="w-full md:w-1/2"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full md:w-1/2"
              onClick={handleBuscar}
            >
              Buscar
            </button>
            <div className="relative group">
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center h-full py-1.5 px-2 leading-tight text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
              >
                <Icon icon="ph:export" width="20" height="20" />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/3 top-full mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Exportar a Excel
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {loading ? (
          <p>Cargando equipos...</p>
        ) : error ? (
          <p>Error al cargar los equipos</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
              <tr>
                <th scope="col" className="flex items-center gap-2 px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={selectedItems.length === equipos.length}
                    className="mr-2"
                  />
                  {selectedItems.length > 0 && (
                    <>
                      <Icon
                        icon="weui:delete-outlined"
                        width="20"
                        height="20"
                        onClick={handleDelete}
                        className="cursor-pointer"
                      />
                      <Icon
                        icon="ph:arrow-fat-down-light"
                        width="20"
                        height="20"
                        onClick={handleBaja}
                        className="cursor-pointer"
                      />
                      <Icon
                        icon="lucide:warehouse"
                        width="20"
                        height="20"
                        onClick={handlePasarABodega}
                        className="cursor-pointer"
                      />
                    </>
                  )}
                </th>
                <th scope="col" className="px-4 py-3">
                  Equipo
                </th>
                <th scope="col" className="px-4 py-3">
                  Marca
                </th>
                <th scope="col" className="px-4 py-3">
                  Modelo
                </th>
                <th scope="col" className="px-4 py-3">
                  Serie
                </th>
                <th scope="col" className="px-4 py-3">
                  Inventario
                </th>
                <th scope="col" className="px-4 py-3">
                  Usuario
                </th>
                <th scope="col" className="px-4 py-3">
                  Uso
                </th>
                <th scope="col" className="px-4 py-3">
                  Edificio
                </th>
                <th scope="col" className="px-4 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((equipo) => (
                <tr
                  key={equipo.id_equipo}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(equipo.id_equipo)}
                      onChange={() => handleCheckboxChange(equipo.id_equipo)}
                    />
                  </td>
                  <td className="px-4 py-2">{equipo.periferico}</td>
                  <td className="px-4 py-2">{equipo.marca}</td>
                  <td className="px-4 py-2">{equipo.modelo}</td>
                  <td className="px-4 py-2">{equipo.serie}</td>
                  <td className="px-4 py-2">{equipo.inventario}</td>
                  <td className="px-4 py-2">{equipo.usuario}</td>
                  <td className="px-4 py-2">{equipo.uso}</td>
                  <td className="px-4 py-2">{equipo.edificio}</td>
                  <td className="px-4 py-5 flex items-center gap-2 max-w-[15rem] truncate text-black">
                    <div className="relative group">
                      <Icon
                        icon="ph:arrow-fat-down-light"
                        width="25"
                        height="25"
                        onClick={() =>
                          handleOpenModal(
                            equipo.id_equipo,
                            "Dar de baja equipo",
                            `¿Estás seguro de que deseas dar de baja el equipo ${equipo.inventario}?`,
                            bajaEquipo
                          )
                        }
                        className="cursor-pointer"
                      />
                      <span className="absolute left-1/2 transform -translate-x-1/3 top-full mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Dar de baja
                      </span>
                    </div>
                    <div className="relative group">
                      <Icon
                        icon="weui:delete-outlined"
                        width="25"
                        height="25"
                        onClick={() =>
                          handleOpenModal(
                            equipo.id_equipo,
                            "Eliminar equipo",
                            `¿Estás seguro de que deseas eliminar el equipo con inventario ${equipo.inventario}?`,
                            deleteEquipo
                          )
                        }
                        className="cursor-pointer"
                      />
                      <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Eliminar
                      </span>
                    </div>
                    <div className="relative group">
                      <Link
                        to="/editarActivo"
                        state={{
                          equipoId: equipo.id_equipo,
                          perifericos,
                          equipoName: equipo.periferico,
                        }}
                      >
                        <Icon
                          icon="mage:edit"
                          width="25"
                          height="25"
                          className="cursor-pointer"
                        />
                      </Link>
                      <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Editar
                      </span>
                    </div>
                    <div className="relative group">
                      <Icon
                        icon="lucide:warehouse"
                        width="25"
                        height="25"
                        className="cursor-pointer"
                        onClick={() =>
                          handleOpenModal(
                            equipo.id_equipo,
                            "Pasar equipo a bodega",
                            `¿Estás seguro de que deseas pasar el equipo a bodega ${equipo.inventario}?`,
                            pasarABodegaEquipo
                          )
                        }
                      />
                      <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Pasar a bodega
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <nav
        className="flex flex-col md:flex-row justify-between items-center p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500"></span>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                <Icon icon="iconamoon:arrow-left-2" width="20" height="20" />
              </button>
            </li>
            <li>
              <div className="flex items-center justify-center text-sm py-2 px-5 leading-tight border border-gray-300 text-gray-900 bg-white">
                Página {currentPage} de {totalPages}
              </div>
            </li>
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                <Icon icon="iconamoon:arrow-right-2" width="20" height="20" />
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <ModalConfirmation
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={modalContent.title}
        message={modalContent.message}
      />
    </div>
  );
};

export default Activos;
