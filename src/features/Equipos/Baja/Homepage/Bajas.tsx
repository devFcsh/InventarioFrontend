import { Alert, Autocomplete, Snackbar, TextField, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import usePerifericos from "../../../../hooks/usePerifericos";
import { filas } from "../../../../data";
import { useEquiposBajaFiltrados } from "../hooks/useEquiposBajaFiltrados";
import { ModalAgregarBaja } from "../../Baja/Pages/ModalAgregarBaja";
import { useEliminarComputadora } from "@hooks/useEliminarComputadora.ts";
import { useNavigate } from "react-router-dom";
import useMarcas from "@hooks/useMarcas";
import useModelos from "@hooks/useModelos";
import useSeries from "@hooks/useSeries";
import { useInventario } from "@hooks/useInventario";

const Bajas = () => {
  const [inputPeriferico, setInputPeriferico] = useState("");
  const [inputMarca, setInputMarca] = useState("");
  const [inputModelo, setInputModelo] = useState("");
  const [inputSerie, setInputSerie] = useState("");
  const [inputInventario, setInputInventario] = useState("");
  const [openModalBajas, setOpenModalBajas] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({
    title: "Confirmar",
    message: "¿Estás seguro de que deseas realizar esta acción?",
  });
  const [modalContentBajas, _] = useState<{
    title: string;
    message: string;
  }>({
    title: "Agregar Bajas",
    message: "Seleccione el periférico a registrar",
  });
  const { eliminarEquipo } = useEliminarComputadora();
  const handleOpenBajas = () => setOpenModalBajas(true);
  const handleCloseBajas = () => setOpenModalBajas(false);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { perifericos } = usePerifericos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { series } = useSeries();
  const { inventarios } = useInventario();

  const navigate = useNavigate();
  const location = useLocation();

  const filtros = {
    perifericoId: inputPeriferico || "",
    marcaId: inputMarca || "",
    modeloId: inputModelo || "",
    serieId: inputSerie || "",
    inventario: inputInventario || "",
  };
  const { equiposBaja, totalCount, loading, error } = useEquiposBajaFiltrados(
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
      setSnackbarMessage("Operación completada con éxito.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error en la acción", error);
    }
    handleCloseModal();
  };

  const deleteEquipo = async (equipoId: string) => {
    if (equipoId) {
      const inventario = equiposBaja.filter(
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
      const errors = [];
      for (const id of equipoIds) {
        const result = await eliminarEquipo(id);
        if (!result) {
          errors.push(id);
        }
      }

      if (errors.length === 0) {
        setSnackbarMessage("Operación completada con éxito");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(
          `No se pudieron eliminar los equipos: ${errors.join(
            ", "
          )} ya que están relacionados a una computadora`
        );
        setSnackbarSeverity("error");
      }

      setShouldFetch(true);
      setSelectedItems([]);
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Error al eliminar el equipo.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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
      setSelectedItems(equiposBaja.map((equipo) => equipo.id_equipo));
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
      equiposBaja.map(({ periferico, marca, modelo, serie, inventario }) => ({
        Periférico: periferico,
        Marca: marca,
        Modelo: modelo,
        Serie: serie,
        Inventario: inventario,
      }))
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
          <h1 className="text-2xl font-bold my-5">Consulta de Bajas</h1>
          <Tooltip title="Agregar Equipo">
            <span>
          <Icon
            icon="gridicons:add"
            width="30"
            height="30"
            className="text-green-900 hover:text-green-950"
            onClick={handleOpenBajas}
          />
          </span>
          </Tooltip>
          <ModalAgregarBaja
            open={openModalBajas}
            onClose={handleCloseBajas}
            title={modalContentBajas.title}
            perifericos={perifericos}
            steps={[]}
          />
        </div>
        <div className="flex flex-wrap gap-4 my-10">
          <Autocomplete
            size="small"
            freeSolo
            options={perifericos}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option?.nombre || ""
            }
            inputValue={inputPeriferico}
            onInputChange={(_, newInputValue) => {
              setInputPeriferico(newInputValue);
            }}
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                setInputPeriferico(newValue);
              } else {
                setInputPeriferico(newValue?.nombre || "");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Periférico" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <Autocomplete
            size="small"
            freeSolo
            options={marcas}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option?.nombre || ""
            }
            inputValue={inputMarca}
            onInputChange={(_, newInputValue) => setInputMarca(newInputValue)}
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                setInputMarca(newValue);
              } else {
                setInputMarca(newValue?.nombre || "");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Marca" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <Autocomplete
            size="small"
            freeSolo
            options={modelos}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option?.nombre || ""
            }
            inputValue={inputModelo}
            onInputChange={(_, newInputValue) => setInputModelo(newInputValue)}
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                setInputModelo(newValue);
              } else {
                setInputModelo(newValue?.nombre || "");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Modelo" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <Autocomplete
            size="small"
            freeSolo
            options={series}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option?.nombre || ""
            }
            inputValue={inputSerie}
            onInputChange={(_, newInputValue) => setInputSerie(newInputValue)}
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                setInputSerie(newValue);
              } else {
                setInputSerie(newValue?.nombre || "");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Serie" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <Autocomplete
            size="small"
            freeSolo
            options={inventarios}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.inventario || ""
            }
            inputValue={inputInventario}
            onInputChange={(_, newInputValue) =>
              setInputInventario(newInputValue)
            }
            onChange={(_, newValue) => {
              if (typeof newValue === "string") {
                setInputInventario(newValue);
              } else {
                setInputInventario(newValue?.inventario || "");
              }
            }}
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
                  <Tooltip title="Seleccionar Todos">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={selectedItems.length === equiposBaja.length}
                    className="mr-2"
                  />
                  </Tooltip>
                  {selectedItems.length > 0 && (
                    <>
                    <Tooltip title="Eliminar Equipos">
                      <span>
                      <Icon
                        icon="weui:delete-outlined"
                        width="20"
                        height="20"
                        onClick={handleDelete}
                        className="cursor-pointer"
                      />
                      </span>
                    </Tooltip>
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
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {equiposBaja.map((equipo) => (
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
                  <td className="px-4 py-3 flex items-center gap-2 max-w-[15rem] truncate text-black">
                    {/* <Tooltip title="Editar Equipo">
                      <span>
                        <Icon
                          icon="gridicons:edit"
                          width="25"
                          height="25"
                          className="cursor-pointer"
                          onClick={() =>
                            navigate(`/equipos/baja/${equipo.id_equipo}`, {
                              state: { equipo },
                            })
                          }
                        />
                      </span>
                    </Tooltip> */}
                    <Tooltip title="Eliminar Equipo">
                      <span>
                    <Icon
                      icon="weui:delete-outlined"
                      width="25"
                      height="25"
                      onClick={() =>
                        handleOpenModal(
                          equipo.id_equipo,
                          "Eliminar equipo",
                          `¿Estás seguro de que deseas eliminar el equipo ${equipo.inventario}?`,
                          deleteEquipo
                        )
                      }
                      className="cursor-pointer"
                    />
                      </span>
                    </Tooltip>
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
                <Tooltip title="Página Anterior">
                  <span>
                <Icon icon="iconamoon:arrow-left-2" width="20" height="20" />
                  </span>
                </Tooltip>
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
                <Tooltip title="Siguiente Página">
                  <span>
                <Icon icon="iconamoon:arrow-right-2" width="20" height="20" />
                  </span>
                </Tooltip>
              </button>
            </li>
          </ul>
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
          >
            <Tooltip title="Exportar a Excel">
                  <span>
            <Icon icon="ph:export" width="20" height="20" />
                  </span>
            </Tooltip>
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

export default Bajas;
