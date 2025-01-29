import { Alert, Autocomplete, Snackbar, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Link, useLocation } from "react-router-dom";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import {ModalAgregarActivo} from "../../../../features/Equipos/Activos/AgregarActivo/pages/ModalAgregarActivo.tsx";
import { Periferico, Marca, Modelo, Serie, Inventario } from "../../../../types";
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
    } else if (location.state && location.state.equipoEditado) {
      setSnackbarMessage("¡Equipo editado con éxito!");
      setOpenSnackbar(true);
    }
  }, [location.state]);

  const handleConfirm = async () => {
    try {
      await confirmAction();
      setSnackbarMessage("Operación completada con éxito.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error en la acción", error);
    }
    handleCloseModal();
  };

  const deleteEquipo = async (equipoId: string) => {
    if (equipoId) {
      await eliminarEquipo(equipoId);
      setShouldFetch(true);
    }
  };

  const deleteEquipos = async (equipoIds: string[]) => {
    try {
      for (const id of equipoIds) {
        await eliminarEquipo(id);
      }
      setShouldFetch(true);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error al eliminar los equipos", error);
    }
  };

  const pasarABodegaEquipo = async (equipoId: string) => {
    if (equipoId) {
      pasarActivoABodega(equipoId);
      setShouldFetch(true);
    }
  };

  const pasarABodegaEquipos = async (equipoIds: string[]) => {
    try {
      for (const id of equipoIds) {
        await pasarActivoABodega(id);
      }
      setShouldFetch(true);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error al pasar a bodega los equipos", error);
    }
  };

  const bajaEquipo = async (equipoId: string) => {
    if (equipoId) {
      try {
        await darDeBajaEquipo(equipoId,"activo");
        console.log(`Equipo con ID ${equipoId} dado de baja`);
        setShouldFetch(true);
      } catch (error) {
        console.error("Error al dar de baja el equipo", error);
      }
    }
  };

  const bajaEquipos = async (equipoIds: string[]) => {
    try {
      for (const id of equipoIds) {
        await darDeBajaEquipo(id, "baja");
      }
      setShouldFetch(true);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error al dar de baja los equipos", error);
    }
  };

  const handlePasarABodega = () => {
    if (selectedItems.length === 0) {
      console.log("Debe seleccionar al menos un elemento");
      return;
    }

    setModalContent({
      title: "Pasar a Bodega Equipos",
      message:
        "¿Estás seguro de que pasar a bodega los equipos seleccionados?",
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
      setSnackbarMessage("¡Equipos dados de baja con éxito!");
      setOpenSnackbar(true);
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      equipos.map(
        ({
          periferico,
          marca,
          modelo,
          serie,
          inventario,
          usuario,
          uso,
          edificio,
        }) => ({
          Periférico: periferico,
          Marca: marca,
          Modelo: modelo,
          Serie: serie,
          Inventario: inventario,
          Usuario: usuario,
          Uso: uso,
          Ubicación: edificio,
        })
      )
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    XLSX.writeFile(wb, "datos_equipos.xlsx");
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
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold my-5">Consulta de Activos</h1>
          
          <Icon
            icon="gridicons:add"
            width="30"
            height="30"
            className="text-green-900 hover:text-green-950"
            onClick={handleOpenActivos}
          />
          <ModalAgregarActivo
            open={openModalActivos}
            onClose={handleCloseActivos}
            title={modalContentActivos.title}
            perifericos={perifericos}
            usos={usos}
            edificios={edificios}
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
                  <td className="px-4 py-3 flex items-center gap-2 max-w-[15rem] truncate text-black">
                    <Icon
                      icon="ph:arrow-fat-down-light"
                      width="25"
                      height="25"
                      onClick={() =>
                        handleOpenModal(
                          equipo.id_equipo,
                          "Dar de baja equipo",
                          `¿Estás seguro de que deseas dar de baja el equipo ${equipo.id_equipo}?`,
                          bajaEquipo
                        )
                      }
                      className="cursor-pointer"
                    />
                    <Icon
                      icon="weui:delete-outlined"
                      width="25"
                      height="25"
                      onClick={() =>
                        handleOpenModal(
                          equipo.id_equipo,
                          "Eliminar equipo",
                          `¿Estás seguro de que deseas eliminar el equipo ${equipo.id_equipo}?`,
                          deleteEquipo
                        )
                      }
                      className="cursor-pointer"
                    />
                    <Link
                      to="/editarActivo"
                      state={{ equipoId: equipo.id_equipo, perifericos,equipoName: equipo.periferico }}
                    >
                      <Icon
                        icon="mage:edit"
                        width="25"
                        height="25"
                        className="cursor-pointer"
                      />
                    </Link>
                      <Icon
                        icon="lucide:warehouse"
                        width="25"
                        height="25"
                        className="cursor-pointer"
                        onClick={() =>
                          handleOpenModal(
                            equipo.id_equipo,
                            "Pasar equipo a bodega",
                            `¿Estás seguro de que deseas pasar el equipo a bodega ${equipo.id_equipo}?`,
                            pasarABodegaEquipo
                          )
                        }
                      />
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
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
          >
            <Icon icon="ph:export" width="20" height="20" />
          </button>
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
