import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import { ModalAgregarActivo } from "../../../../features/Equipos/Activos/AgregarActivo/pages/ModalAgregarActivo.tsx";
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
  Equipo,
  ExportarAP,
  ExportarComputadora,
  ExportarProyector,
  ExportarSimples,
  ExportarSwitch,
} from "../../../../types/Equipo/index.ts";
import { useSnackbar } from "@context/SnackbarContext.tsx";
import { useUser } from "@context/userContext.tsx";
import Loader from "@pages/Loader.tsx";
import { useImportarEquipoActivo } from "../hooks/useImportarEquipoActivo.ts";
import { MantenimientoActivo } from "../MantenimientoActivo/Homepage/MantenimientoActivo.tsx";

const Activos = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalActivos, setOpenModalActivos] = useState<boolean>(false);
  const [openModalMantenimientos, setOpenModalMantenimientos] = useState(false);
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

  const [modalContentActivos, _] = useState<{
    title: string;
    message: string;
  }>({
    title: "Agregar Activos",
    message: "Seleccione el periférico a registrar",
  });
  

  const [inputPeriferico, setInputPeriferico] = useState("");
  const [inputMarca, setInputMarca] = useState("");
  const [inputModelo, setInputModelo] = useState("");
  const [inputSerie, setInputSerie] = useState("");
  const [inputInventario, setInputInventario] = useState("");

  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const { rol } = useUser();
  const unableAction = rol !== "administrador" && rol !== "editor";
  const unableActionEditor = rol !== "administrador";
  const { importarEquiposActivos, loading: importLoading } =
    useImportarEquipoActivo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { showMessage } = useSnackbar();
  const { perifericos } = usePerifericos();
  const { edificios } = useEdificios();
  const { usos } = useUsos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { series } = useSeries();
  const { inventarios } = useInventario();
  const { pasarActivoABodega } = usePasarActivoABodega();
  const { fetchTodosEquipos } = useExportarEquiposActivos();

  const filtros = {
    perifericoId: inputPeriferico || "",
    marcaId: inputMarca || "",
    modeloId: inputModelo || "",
    serieId: inputSerie || "",
    inventario: inputInventario || "",
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

  const handleConfirm = async () => {
    try {
      await confirmAction();
    } catch (error) {
      showMessage("Error al realizar la acción", "error");
    }
    handleCloseModal();
  };

  function columnasFaltantesExcel(jsonData: any[]): string[] {
    if (!jsonData || jsonData.length === 0) return [];
    const requiredColumns = [
      "Tipo",
      "Inventario CPU",
      "Serie CPU",
      "Modelo Case",
      "IP",
      "Capacidad Memoria",
      "Capacidad HDD",
      "Procesador",
      "Dominio",
      "Uso",
      "Usuario",
      "Edificio",
      "Nombre de equipo",
      "Año Adq",
      "Oficina",
      "Modelo monitor",
      "Serie monitor",
      "Inventario Monitor",
      "Modelo teclado",
      "Serie teclado",
      "Inventario Teclado",
      "Modelo mouse",
      "Serie mouse",
      "Inventario Mouse",
      "Tipo Disco"
    ];
    const firstRow = jsonData[0];
    return requiredColumns.filter((col) => !Object.keys(firstRow).includes(col));
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  function transformarFilaExcel(row: any) {
    const normalize = (val: any) =>
      val === undefined || val === null
        ? "S/N"
        : String(val).trim() === "S/N"
        ? "S/N"
        : String(val).trim();

    const ubicacion = row["Oficina"] !== "" ? row["Oficina"] : row["No. Aula"];
    return {
      tipo: normalize(row["Tipo"]),
      inventario: String(row["Inventario CPU"] ?? ""),
      anio_compra:
        row["Año Adq"] !== "S/N" && row["Año Adq"] !== undefined
          ? String(parseInt(row["Año Adq"]))
          : "S/N",
      serie: normalize(row["Serie CPU"]),
      modelo: normalize(row["Modelo Case"]),
      nombreEquipo: normalize(row["Nombre de equipo"]),
      direccionIp: normalize(row["IP"]).toLowerCase().replace("dhcp", ""),
      versionso: normalize(row["__EMPTY"]),
      ram: normalize(String(row["Capacidad Memoria"]).split(" ")[0]),
      tipo_ram: normalize(
        String(row["Capacidad Memoria"]).split(" ").slice(1).join(" ")
      ),
      disco: normalize(
        String(row["Capacidad HDD"]) + (row["Tipo Disco"] ?? "")
      ),
      procesador: normalize(row["Procesador"]),
      dominio: normalize(row["Dominio"]),
      uso: normalize(row["Uso"]),
      usuario: normalize(row["Usuario"]),
      edificio: normalize(row["Edificio"]),
      ubicacion: normalize(ubicacion),
      observacion: row["Observación"] !== "S/N" ? row["Observación"] : "",
      componentes: [
        {
          tipo: "Monitor",
          modelo: normalize(row["Modelo monitor"]),
          serie: normalize(row["Serie monitor"]),
          inventario: String(row["Inventario Monitor"] ?? ""),
        },
        {
          tipo: "Teclado",
          modelo: normalize(row["Modelo teclado"]),
          serie: normalize(row["Serie teclado"]),
          inventario: String(row["Inventario Teclado"] ?? ""),
        },
        {
          tipo: "Mouse",
          modelo: normalize(row["Modelo mouse"]),
          serie: normalize(row["Serie mouse"]),
          inventario: String(row["Inventario Mouse"] ?? ""),
        },
      ],
    };
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        showMessage("El archivo Excel está vacío.", "warning");
        return;
      }

      const faltantes = columnasFaltantesExcel(jsonData);
      if (faltantes.length > 0) {
        showMessage(
          `El formato del archivo Excel no es válido. Faltan las columnas: ${faltantes.join(", ")}`,
          "error"
        );
        return;
      }

      try {
        const equiposImport = jsonData.map(transformarFilaExcel);

        const resultado = await importarEquiposActivos(equiposImport);

        if (
          resultado?.resumen &&
          typeof resultado.resumen.registrados === "number" &&
          resultado.resumen.registrados > 0
        ) {
          showMessage(`Importación completada.`, "success");
        } else {
          showMessage("No se encontraron equipos nuevos para agregar.", "info");
        }

        setShouldFetch(true);
      } catch {
        showMessage("Error al importar equipos", "error");
      }
    };
    reader.readAsBinaryString(file);
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
          showMessage(
            `Equipo con inventario ${inventario} eliminado.`,
            "success"
          );
        } else {
          showMessage(
            `No se puede eliminar el equipo con inventario ${inventario} porque está asociado a una computadora`,
            "error"
          );
        }
      } catch (error) {
        showMessage(
          `Error al eliminar el equipo con inventario ${inventario}.`,
          "error"
        );
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
        showMessage("Operación completada con éxito", "success");
      } else {
        showMessage(
          `No se pudieron eliminar los equipos: ${errorsInventarios.join(
            ", "
          )} ya que están relacionados a una computadora`,
          "error"
        );
      }

      setShouldFetch(true);
      setSelectedItems([]);
    } catch (error) {
      showMessage("Error al eliminar los equipos", "error");
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
          showMessage(
            `Equipo con inventario ${inventario} pasado a bodega`,
            "success"
          );
        } else {
          showMessage(
            `No se puede pasar a bodega el equipo con inventario ${inventario} porque el equipo está asociado a una computadora`,
            "error"
          );
        }
      } catch (error) {
        showMessage(
          `Error al pasar a bodega el equipo con inventario ${inventario}`,
          "error"
        );
      }
    }
  };

  /** 
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
        showMessage("Operación completada con éxito", "success");
      } else {
        showMessage(
          `No se pudieron pasar los equipos con inventarios: ${errorsInventarios.join(
            ", "
          )} a bodega ya que están relacionados a una computadora`,
          "error"
        );
      }

      setShouldFetch(true);
      setSelectedItems([]);
    } catch (error) {
      showMessage("Error al pasar a bodega los equipos", "error");
    }
  };

  */
  const bajaEquipo = async (equipoId: string) => {
    if (equipoId) {
      const inventario = equipos.filter(
        (equipo) => equipoId === equipo.id_equipo
      )[0].inventario;
      try {
        const result = await darDeBajaEquipo(equipoId, "activo");
        if (result) {
          setShouldFetch(true);
          showMessage(
            `Equipo con inventario ${inventario} dado de baja`,
            "success"
          );
        } else {
          showMessage(
            `No se puede dar de baja al equipo con inventario ${inventario} ya que está asociado a una computadora`,
            "error"
          );
        }
      } catch (error) {
        showMessage(
          `Error al dar de baja al equipo con inventario ${inventario}`,
          "error"
        );
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
        showMessage("Operación completada con éxito", "success");
      } else {
        showMessage(
          `Error al dar de baja los equipos con inventario ${errorsInventarios.join(
            ", "
          )} ya que están relacionados a una computadora`,
          "error"
        );
      }
      setSelectedItems([]);
    } catch (error) {
      showMessage("Error al dar de baja los equipos", "error");
    }
  };
  /** 
  const handlePasarABodega = () => {
    if (selectedItems.length === 0) {
      showMessage("Debe seleccionar al menos un elemento", "warning");
      return;
    }

    setModalContent({
      title: "Pasar a Bodega Equipos",
      message: "¿Estás seguro de que pasar a bodega los equipos seleccionados?",
    });

    setConfirmAction(() => async () => {
      try {
        await pasarABodegaEquipos(selectedItems);
        showMessage("Equipo pasado a bodega con éxito", "success");
      } catch (error) {
        showMessage("Error al pasar equipo a bodega", "error");
      }
      setOpenModal(false);
    });

    setOpenModal(true);
  };
*/
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
  const handleOpenActivos = () => setOpenModalActivos(true);
  const handleCloseActivos = () => setOpenModalActivos(false);

  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo>();
  const [tipoEquipoSeleccionado, setTipoEquipoSeleccionado] = useState<string>("");

  const handleOpenMantenimientos = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    setTipoEquipoSeleccionado(equipo.periferico);
    setOpenModalMantenimientos(true);
  };
  const handleCloseMantenimientos = () => setOpenModalMantenimientos(false);

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
              edificio,
              ubicacion,
              uso,
              usuario,
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
              anio_compra,
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
              edificio,
              ubicacion,
              uso,
              usuario,
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
              anio_compra,
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
              anio_compra,
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
              anio_compra,
              edificio,
              ubicacion,
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
              anio_compra,
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
              anio_compra,
              edificio,
              ubicacion,
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
              anio_compra,
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
              anio_compra,
              edificio,
              ubicacion,
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
              edificio,
              ubicacion,
              uso,
              usuario,
              anio_compra,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: periferico,
              edificio,
              ubicacion,
              uso,
              usuario,
              anio_compra,
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
          <h1 className="text-2xl font-bold my-5">Consulta de Activos</h1>
          {unableAction ? (
            <span>
              <Icon
                icon="gridicons:add"
                width="30"
                height="30"
                className="text-green-900 opacity-50 pointer-events-none"
              />
            </span>
          ) : (
            <Tooltip title="Agregar activo">
              <span>
                <Icon
                  icon="gridicons:add"
                  width="30"
                  height="30"
                  className="text-green-900 hover:text-green-950"
                  onClick={handleOpenActivos}
                />
              </span>
            </Tooltip>
          )}
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
          <Loader />
        ) : error ? (
          <p>Error al cargar los equipos</p>
        ) : equipos.length === 0 ? (
          <p className="text-center text-gray-500 my-5">
            No hay datos disponibles. Presiona "Buscar" para cargar resultados.
          </p>
        ) : (
          <>
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs uppercase bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="flex items-center gap-2 px-4 py-3">
                    <Tooltip title="Seleccionar todos">
                      <input
                        type="checkbox"
                        onChange={handleSelectAllChange}
                        checked={selectedItems.length === equipos.length}
                        className="mr-2"
                        disabled={unableAction}
                      />
                    </Tooltip>
                    {selectedItems.length > 0 && (
                      <>
                        <Tooltip title="Eliminar activos">
                          <span>
                          <Icon
                            icon="weui:delete-outlined"
                            width="20"
                            height="20"
                            onClick={
                            !unableActionEditor ? handleDelete : undefined
                            }
                            className={`cursor-pointer ${
                            unableActionEditor
                              ? "opacity-50 pointer-events-none"
                              : ""
                            }`}
                          />
                          </span>
                        </Tooltip>
                        <Tooltip title="Dar de baja activos">
                          <span>
                          <Icon
                            icon="ph:arrow-fat-down-light"
                            width="20"
                            height="20"
                            onClick={!unableActionEditor ? handleBaja : undefined}
                            className={`cursor-pointer ${
                            unableActionEditor
                              ? "opacity-50 pointer-events-none"
                              : ""
                            }`}
                          />
                          </span>
                        </Tooltip>
                        {/*
                      <Tooltip title="Pasar activos a bodega">
                        <span>
                          <Icon
                            icon="lucide:warehouse"
                            width="20"
                            height="20"
                            onClick={
                              !unableAction ? handlePasarABodega : undefined
                            }
                            className={`cursor-pointer ${
                              unableAction
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                          />
                        </span>
                      </Tooltip>
                      */}
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
                        disabled={unableAction}
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
                      <Tooltip title="Ver detalles">
                        <span>
                          <Link
                            to="/visualizarActivo"
                            state={{
                              equipoId: equipo.id_equipo,
                              perifericos,
                              equipoName: equipo.periferico,
                            }}
                          >
                            <Icon
                              icon="basil:info-rect-outline"
                              width="25"
                              height="25"
                              className="cursor-pointer"
                            />
                          </Link>
                        </span>
                      </Tooltip>
                        <Tooltip title="Dar de baja equipo">
                        <span
                          className={
                          unableActionEditor ? "opacity-50 pointer-events-none" : ""
                          }
                        >
                          <Icon
                          icon="ph:arrow-fat-down-light"
                          width="25"
                          height="25"
                          onClick={
                            !unableActionEditor
                            ? () =>
                              handleOpenModal(
                                equipo.id_equipo,
                                "Dar de baja equipo",
                                `¿Estás seguro de que deseas dar de baja el equipo ${equipo.inventario}?`,
                                bajaEquipo
                              )
                            : undefined
                          }
                          className="cursor-pointer"
                          />
                        </span>
                        </Tooltip>
                        <Tooltip title="Eliminar equipo">
                        <span
                          className={
                          unableActionEditor
                            ? "opacity-50 pointer-events-none"
                            : ""
                          }
                        >
                          <Icon
                          icon="weui:delete-outlined"
                          width="25"
                          height="25"
                          onClick={
                            !unableActionEditor
                            ? () =>
                              handleOpenModal(
                                equipo.id_equipo,
                                "Eliminar equipo",
                                `¿Estás seguro de que deseas eliminar el equipo con inventario ${equipo.inventario}?`,
                                deleteEquipo
                              )
                            : undefined
                          }
                          className="cursor-pointer"
                          />
                        </span>
                        </Tooltip>
                        {!unableAction && (
                        <Tooltip title="Editar equipo">
                          <span>
                          <Link
                            to="/editarActivo"
                            state={{
                            equipoId: equipo.id_equipo,
                            perifericos,
                            equipoName: equipo.periferico,
                            }}
                            tabIndex={unableAction ? -1 : 0}
                            aria-disabled={unableAction}
                            style={
                            unableAction
                              ? { pointerEvents: "none", opacity: 0.5 }
                              : {}
                            }
                          >
                            <Icon
                            icon="mage:edit"
                            width="25"
                            height="25"
                            className="cursor-pointer"
                            />
                          </Link>
                          </span>
                        </Tooltip>
                        )}

                        <Tooltip title="Pasar a bodega">
                        <span
                          className={
                          unableActionEditor ? "opacity-50 pointer-events-none" : ""
                          }
                        >
                          <Icon
                          icon="lucide:warehouse"
                          width="25"
                          height="25"
                          onClick={
                            !unableActionEditor
                            ? () =>
                              handleOpenModal(
                                equipo.id_equipo,
                                "Pasar equipo a bodega",
                                `¿Estás seguro de que deseas pasar el equipo a bodega ${equipo.inventario}?`,
                                pasarABodegaEquipo
                              )
                            : undefined
                          }
                          className="cursor-pointer"
                          />
                        </span>
                        </Tooltip>
                      <Tooltip title="Mantenimientos">
                        <span className={unableAction ? "opacity-50 pointer-events-none" : ""}>
                          <Icon
                            icon="pajamas:issue-type-maintenance"
                            width="25"
                            height="25"
                            onClick={() => handleOpenMantenimientos(equipo)}
                            className="cursor-pointer"
                          />
                        </span>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                    <Icon icon="ph:export" width="20" height="20" />
                  </button>
                </Tooltip>
              </div>
            </nav>
          </>
        )}
        <div className="flex items-center gap-2">
          <Tooltip title="Importar desde Excel">
            <span>
              <button
                onClick={handleImportClick}
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
                disabled={importLoading}
                type="button"
              >
                <Icon icon="mdi:import" width="20" height="20" />
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </button>
            </span>
          </Tooltip>

          <Tooltip title="Descargar formato">
            <a
              href="/formato_importar_activo.xlsx"
              download="formato_activo.xlsx"
              className="flex items-center"
            >
              <button
                type="button"
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
              >
                <Icon icon="mdi:file-download" width="20" height="20" />
              </button>
            </a>
          </Tooltip>
        </div>
        {importLoading && (
          <div className="flex justify-center items-center my-8">
            <Loader />
            <span className="ml-4 text-lg font-semibold text-blue-700">
              Importando equipos, por favor espere...
            </span>
          </div>
        )}
      </div>

      <ModalConfirmation
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={modalContent.title}
        message={modalContent.message}
      />
     <MantenimientoActivo
  open={openModalMantenimientos}
  onClose={handleCloseMantenimientos}
  id_equipo={equipoSeleccionado?.id_equipo || ""}
  tipoEquipo={tipoEquipoSeleccionado}
/>
    </div>
  );
};

export default Activos;
