import {
  Autocomplete,
  TextField,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import usePerifericos from "../../../../hooks/usePerifericos";
import useMarcas from "@hooks/useMarcas.ts";
import useModelos from "@hooks/useModelos.ts";
import useSeries from "@hooks/useSeries.ts";
import { useInventario } from "@hooks/useInventario.ts";
import { filas } from "../../../../data";
import { useEquiposBodegaFiltrados } from "../hooks/useEquiposBodegaFiltrados";
import { ModalAgregarBodega } from "../../../../features/Equipos/Bodega/Pages/ModalAgregarBodega";
import ModalPasarAActivo from "../Pages/ModalPasarAActivo";
import { useEliminarComputadora } from "@hooks/useEliminarComputadora.ts";
import { useDarDeBajaEquipo } from "../../Activos/hooks/useDarDeBajaEquipo";
import { useExportarEquiposBodega } from "../hooks/useExportarEquiposBodega";
import {
  ExportarAP,
  ExportarComputadora,
  ExportarProyector,
  ExportarSimples,
  ExportarSwitch,
} from "../../../../types/Equipo/index";
import { useSnackbar } from "@context/SnackbarContext";

const Bodega = () => {
  const [inputPeriferico, setInputPeriferico] = useState("");
  const [inputMarca, setInputMarca] = useState("");
  const [inputModelo, setInputModelo] = useState("");
  const [inputSerie, setInputSerie] = useState("");
  const [inputInventario, setInputInventario] = useState("");
  const [openModalBodega, setOpenModalBodega] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [modalContentBodega, _] = useState<{
    title: string;
    message: string;
  }>({
    title: "Agregar Bodega",
    message: "Seleccione el periférico a registrar",
  });
  const { eliminarEquipo } = useEliminarComputadora();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({
    title: "Confirmar",
    message: "¿Estás seguro de que deseas realizar esta acción?",
  });

  const [openModalPasarAActivo, setOpenModalPasarAActivo] =
    useState<boolean>(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState<string | null>(null);

  const { showMessage } = useSnackbar();
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const handleOpenBodega = () => setOpenModalBodega(true);
  const handleCloseBodega = () => setOpenModalBodega(false);

  const { perifericos } = usePerifericos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { series } = useSeries();
  const { inventarios } = useInventario();

  const { darDeBajaEquipo } = useDarDeBajaEquipo();
  const { fetchTodosEquipos } = useExportarEquiposBodega();


  const filtros = {
    perifericoId: inputPeriferico || "",
    marcaId: inputMarca || "",
    modeloId: inputModelo || "",
    serieId: inputSerie || "",
    inventario: inputInventario || "",
  };

  const { equiposBodega, totalCount, loading, error } =
    useEquiposBodegaFiltrados(filtros, currentPage, rowsPerPage, shouldFetch);

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

  const handleConfirm = async () => {
    try {
      await confirmAction();
      showMessage("Operación completada con éxito.", "success");
    } catch (error) {
      showMessage("Error en la acción", "error");
    }
    handleCloseModal();
  };

  const handleOpenModalPasarAActivo = (equipoId: string) => {
    setSelectedEquipoId(equipoId);
    setOpenModalPasarAActivo(true);
  };

  const handleCloseModalPasarAActivo = () => {
    setOpenModalPasarAActivo(false);
    setSelectedEquipoId(null);
  };

  const deleteEquipo = async (equipoId: string) => {
    if (equipoId) {
      const inventario = equiposBodega.filter(
        (equipo) => equipoId === equipo.id_equipo
      )[0].inventario;
      try {
        const result = await eliminarEquipo(equipoId);
        if (result) {
          setShouldFetch(true);
          showMessage(`Equipo con inventario ${inventario} eliminado.`, "success");
        } else {
          showMessage(
            `No se puede eliminar el equipo con inventario ${inventario} porque está asociado a una computadora`, "error");
        }
      } catch (error) {
        showMessage(
          `Error al eliminar el equipo con inventario ${inventario}.`, "error");
      }
    }
  };

  const deleteEquipos = async (equipoIds: string[]) => {
    const errorsInventarios = [];
    try {
      for (const id of equipoIds) {
        const result = await eliminarEquipo(id);
        const inventario = equiposBodega.filter(
          (equipo) => id === equipo.id_equipo
        )[0].inventario;
        if (!result) {
          errorsInventarios.push(inventario);
        }
      }

      if (errorsInventarios.length === 0) {
        showMessage("Operación completada con éxito", "success");
      } else {
        showMessage(
          `No se pudieron eliminar los equipos: ${errorsInventarios.join(
            ", "
          )} ya que están relacionados a una computadora`, "error");
      }

      setSelectedItems([]);
    } catch (error) {
      showMessage("Error al eliminar el equipo.", "error");
    }
  };

  const bajaEquipo = async (equipoId: string) => {
    if (equipoId) {
      const inventario = equiposBodega.filter(
        (equipo) => equipoId === equipo.id_equipo
      )[0].inventario;
      try {
        const result = await darDeBajaEquipo(equipoId, "bodega");
        if (result) {
          setShouldFetch(true);
          showMessage(
            `Equipo con inventario ${inventario} dado de baja`, "success");
        } else {
          showMessage(
            `No se puede dar de baja al equipo con inventario ${inventario} ya que está asociado a una computadora`, "error");
        }
      } catch (error) {
        showMessage(
          `Error al dar de baja al equipo con inventario ${inventario}`, "error");
      }
    }
  };

  const bajaEquipos = async (equipoIds: string[]) => {
    const errorsInventarios = [];
    try {
      for (const id of equipoIds) {
        const result = await darDeBajaEquipo(id, "baja");
        const inventario = equiposBodega.filter(
          (equipo) => id === equipo.id_equipo
        )[0].inventario;
        if (!result) {
          errorsInventarios.push(inventario);
        }
      }
      if (errorsInventarios.length === 0) {
        setShouldFetch(true);
        showMessage("Operación completada con éxito", "success");
      } else {
        showMessage(
          `Error al dar de baja los equipos con inventario ${errorsInventarios.join(
            ", "
          )} ya que están relacionados a una computadora`, "error");
      }
      setSelectedItems([]);
    } catch (error) {
      showMessage("Error al dar de baja a los equipos.", "error");
    }
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      showMessage("Debe seleccionar al menos un elemento", "warning");
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
        showMessage("Debe seleccionar al menos un elemento", "warning");
        return;
      }
      await bajaEquipos(selectedItems);
      showMessage("¡Equipos dados de baja con éxito!", "success");
      setOpenModal(false);
    });
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
      setSelectedItems(equiposBodega.map((equipo) => equipo.id_equipo));
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
              direccion_ip,
              nombre_equipo,
              dominio,
              sistema_operativo,
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
              direccion_ip,
              nombre_equipo,
              dominio,
              sistema_operativo,
              procesador,
              tipo_ram,
              capacidad_ram,
              capacidad_disco,
              marca,
              modelo,
              serie,
              inventario,
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
              puertos,
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
              marca,
              modelo,
              serie,
              inventario,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: periferico,
              marca,
              modelo,
              serie,
              inventario,
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

      XLSX.writeFile(wb, "datos_equipos.xlsx");
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold my-5">Consulta de Bodega</h1>
          <Tooltip title="Agregar Equipo">
            <span>
              <Icon
                icon="gridicons:add"
                width="30"
                height="30"
                className="text-green-900 hover:text-green-950"
                onClick={handleOpenBodega}
              />
            </span>
          </Tooltip>
          <ModalAgregarBodega
            open={openModalBodega}
            onClose={handleCloseBodega}
            title={modalContentBodega.title}
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
                      checked={selectedItems.length === equiposBodega.length}
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
                      <Tooltip title="Dar de Baja Equipos">
                        <span>
                          <Icon
                            icon="ph:arrow-fat-down-light"
                            width="20"
                            height="20"
                            onClick={handleBaja}
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
              {equiposBodega.map((equipo) => (
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
                    <Tooltip title="Dar de baja equipo">
                      <span>
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
                      </span>
                    </Tooltip>
                    <Tooltip title="Eliminar equipo">
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
                    <Link
                      to="/editarBodega"
                      state={{
                        equipoId: equipo.id_equipo,
                        perifericos,
                        equipoName: equipo.periferico,
                      }}
                    >
                      <Tooltip title="Editar equipo">
                        <span>
                          <Icon
                            icon="mage:edit"
                            width="25"
                            height="25"
                            className="cursor-pointer"
                          />
                        </span>
                      </Tooltip>
                    </Link>
                    <Tooltip title="Pasar a Activo">
                      <span>
                        <Icon
                          icon="icon-park-outline:upload-computer"
                          width="25"
                          height="25"
                          className="cursor-pointer"
                          onClick={() =>
                            handleOpenModalPasarAActivo(equipo.id_equipo)
                          }
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
                    <Icon
                      icon="iconamoon:arrow-left-2"
                      width="20"
                      height="20"
                    />
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
                    <Icon
                      icon="iconamoon:arrow-right-2"
                      width="20"
                      height="20"
                    />
                  </span>
                </Tooltip>
              </button>
            </li>
          </ul>
          <Tooltip title="Exportar a Excel">
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
            >
              <span>
                <Icon icon="ph:export" width="20" height="20" />
              </span>
            </button>
          </Tooltip>
        </div>
      </nav>
      <ModalPasarAActivo
        equipoId={selectedEquipoId}
        open={openModalPasarAActivo}
        onClose={handleCloseModalPasarAActivo}
      />
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

export default Bodega;
