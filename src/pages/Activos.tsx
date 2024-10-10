import { Alert, Autocomplete, Snackbar, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Link, useLocation } from "react-router-dom";
import ModalConfirmation from "../components/ModalConfirmation";
import { Periferico, Marca, Modelo, Serie, Inventario } from "../types";
import usePerifericos from "../hooks/usePerifericos";
import useMarcasPorPeriferico from "../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../hooks/useSeriesPorModelo";
import { useInventariosPorSerie } from "../hooks/useInventariosPorSerie";
import { useEquiposFiltrados } from "../hooks/useEquiposFiltrados";
import { filas } from "../data";
import { useTotalEquipos } from "../hooks/useTotalEquipos";
import { useEliminarComputadoraActivo } from "../hooks/useEliminarComputadoraActivo";
import { useDarDeBajaEquipo } from "../hooks/useDarDeBajaEquipo";

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

  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { perifericos } = usePerifericos();
  const { marcas } = useMarcasPorPeriferico(
    selectedPeriferico?.id_periferico ?? ""
  );
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedMarca?.id_marca ?? "",
    selectedPeriferico?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    selectedPeriferico?.id_periferico ?? "",
    selectedMarca?.id_marca ?? "",
    selectedModelo?.id_modelo ?? ""
  );
  const { inventarios } = useInventariosPorSerie(
    selectedPeriferico?.id_periferico ?? "",
    selectedMarca?.id_marca ?? "",
    selectedModelo?.id_modelo ?? "",
    selectedSerie?.id_serie ?? ""
  );

  const location = useLocation();
  const filtros = {
    perifericoId: selectedPeriferico?.id_periferico,
    marcaId: selectedMarca?.id_marca,
    modeloId: selectedModelo?.id_modelo,
    serieId: selectedSerie?.id_serie,
    inventario: selectedInventario?.inventario,
  };

  const { eliminarEquipo } = useEliminarComputadoraActivo();
  const { darDeBajaEquipo } = useDarDeBajaEquipo();
  const { equipos, loading, error } = useEquiposFiltrados(
    filtros,
    currentPage,
    rowsPerPage,
    shouldFetch
  );
  const { totalEquipos } = useTotalEquipos(filtros, shouldFetch);

  useEffect(() => {
    if (totalEquipos > 0 && rowsPerPage > 0) {
      setTotalPages(Math.ceil(totalEquipos / rowsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [totalEquipos, rowsPerPage]);

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

  const bajaEquipo = async (equipoId: string) => {
    if (equipoId) {
      try {
        await darDeBajaEquipo(equipoId);
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
        await darDeBajaEquipo(id);
      }
      setShouldFetch(true);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error al dar de baja los equipos", error);
    }
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
    setSelectedMarca(null);
    setSelectedModelo(null);
    setSelectedSerie(null);
    setSelectedInventario(null);
  };

  const handleMarcaChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Marca | null
  ) => {
    setSelectedMarca(newValue);
    setSelectedModelo(null);
    setSelectedSerie(null);
    setSelectedInventario(null);
  };

  const handleModeloChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null
  ) => {
    setSelectedModelo(newValue);
    setSelectedSerie(null);
    setSelectedInventario(null);
  };

  const handleSerieChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Serie | null
  ) => {
    setSelectedSerie(newValue);
    setSelectedInventario(null);
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
          <Link to={{ pathname: "/agregarActivo" }} state={{ perifericos }}>
            <Icon
              icon="gridicons:add"
              width="30"
              height="30"
              className="text-green-900 hover:text-green-950"
            />
          </Link>
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
            disabled={!selectedPeriferico}
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
            disabled={!selectedMarca}
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
            disabled={!selectedModelo}
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
            disabled={!selectedSerie}
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
                  Ubicación
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
                      state={{ equipoId: equipo.id_equipo, perifericos }}
                    >
                      <Icon
                        icon="mage:edit"
                        width="25"
                        height="25"
                        className="cursor-pointer"
                      />
                    </Link>
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
