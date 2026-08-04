import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
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
import { useUser } from "@context/userContext";
import Loader from "@pages/Loader";
import {
  ImportarEquiposResultado,
  useImportarEquipoBodega,
} from "../hooks/useImportarEquipoBodega";
import ImportResultDialog from "../../shared/ImportResultDialog.tsx";
import ImportPreviewDialog, {
  ImportPreviewData,
} from "../../shared/ImportPreviewDialog.tsx";
import {
  downloadImportTemplate,
  formatAnioCompra,
  isValidPrinterImportType,
  isValidCameraImportType,
  transformImpresoraRow,
  transformCamaraRow,
  transformUpsRow,
  transformComputadoraRow,
} from "../../shared/excelImport.ts";

const Bodega = () => {
  const [inputPeriferico, setInputPeriferico] = useState(() => {
    return sessionStorage.getItem("bodega_filter_periferico") || "";
  });
  const [inputMarca, setInputMarca] = useState(() => {
    return sessionStorage.getItem("bodega_filter_marca") || "";
  });
  const [inputModelo, setInputModelo] = useState(() => {
    return sessionStorage.getItem("bodega_filter_modelo") || "";
  });
  const [inputSerie, setInputSerie] = useState(() => {
    return sessionStorage.getItem("bodega_filter_serie") || "";
  });
  const [inputInventario, setInputInventario] = useState(() => {
    return sessionStorage.getItem("bodega_filter_inventario") || "";
  });
  const [openModalBodega, setOpenModalBodega] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<
    () => Promise<{ success: boolean; message: string }>
  >(() => async () => ({ success: false, message: "" }));

  const [modalContentBodega] = useState<{
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
  const [openImportResult, setOpenImportResult] = useState(false);
  const [importResult, setImportResult] = useState<ImportarEquiposResultado | null>(null);
  const [openImportPreview, setOpenImportPreview] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreviewData | null>(null);

  const { showMessage } = useSnackbar();
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);
  const handleOpenBodega = () => setOpenModalBodega(true);
  const handleCloseBodega = () => setOpenModalBodega(false);

  const { perifericos } = usePerifericos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { series } = useSeries();
  const { inventarios } = useInventario();

  const { darDeBajaEquipo } = useDarDeBajaEquipo();
  const { fetchTodosEquipos } = useExportarEquiposBodega();
  const { importarEquiposBodega, loading: importLoading } = useImportarEquipoBodega();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { rol, user } = useUser();
  const unableAction = rol !== "administrador" && rol !== "editor";
  const unableActionEditor = rol !== "administrador";

  const filtros = {
    perifericoId: inputPeriferico || "",
    marcaId: inputMarca || "",
    modeloId: inputModelo || "",
    serieId: inputSerie || "",
    inventario: inputInventario || "",
  };
  const { equiposBodega, totalCount, loading, error } =
    useEquiposBodegaFiltrados(filtros, currentPage, rowsPerPage, shouldFetch, sortBy, sortDir);

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setCurrentPage(1);
    setShouldFetch(true);
  };

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

  useEffect(() => {
    sessionStorage.setItem("bodega_filter_periferico", inputPeriferico);
  }, [inputPeriferico]);

  useEffect(() => {
    sessionStorage.setItem("bodega_filter_marca", inputMarca);
  }, [inputMarca]);

  useEffect(() => {
    sessionStorage.setItem("bodega_filter_modelo", inputModelo);
  }, [inputModelo]);

  useEffect(() => {
    sessionStorage.setItem("bodega_filter_serie", inputSerie);
  }, [inputSerie]);

  useEffect(() => {
    sessionStorage.setItem("bodega_filter_inventario", inputInventario);
  }, [inputInventario]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirm = async () => {
    try {
      const result = await confirmAction();

      if (result.success) {
        showMessage(result.message, "success");
        setShouldFetch(true);
      } else {
        showMessage(result.message, "error");
      }
    } catch {
      showMessage("Error al ejecutar la acción", "error");
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenModalPasarAActivo = (equipoId: string) => {
    setSelectedEquipoId(equipoId);
    setOpenModalPasarAActivo(true);
  };

  const handleCloseModalPasarAActivo = () => {
    setOpenModalPasarAActivo(false);
    setSelectedEquipoId(null);
  };

  const handlePasarAActivoSuccess = () => {
    setShouldFetch(true);
  };

  const deleteEquipo = async (
    equipoId: string
  ): Promise<{ success: boolean; message: string }> => {
    const equipo = equiposBodega.find(
      (equipo) => equipoId === equipo.id_equipo
    );
    const inventario = equipo?.inventario ?? "N/A";

    try {
      const result = await eliminarEquipo(equipoId);
      if (result) {
        return {
          success: true,
          message: `Equipo con inventario ${inventario} eliminado.`,
        };
      } else {
        return {
          success: false,
          message: `No se puede eliminar el equipo con inventario ${inventario} porque está asociado a una computadora.`,
        };
      }
    } catch {
      return {
        success: false,
        message: `Error al eliminar el equipo con inventario ${inventario}.`,
      };
    }
  };

  const bajaEquipo = async (
    equipoId: string
  ): Promise<{ success: boolean; message: string }> => {
    const equipo = equiposBodega.find(
      (equipo) => equipoId === equipo.id_equipo
    );
    const inventario = equipo?.inventario ?? "N/A";

    try {
      const result = await darDeBajaEquipo(equipoId, "bodega");
      if (result) {
        return {
          success: true,
          message: `Equipo con inventario ${inventario} dado de baja.`,
        };
      } else {
        return {
          success: false,
          message: `No se puede dar de baja al equipo con inventario ${inventario} ya que está asociado a una computadora.`,
        };
      }
    } catch {
      return {
        success: false,
        message: `Error al dar de baja al equipo con inventario ${inventario}.`,
      };
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
      try {
        const errores: string[] = [];

        for (const id of selectedItems) {
          const { success, message } = await deleteEquipo(id);
          if (!success) {
            errores.push(message);
          }
        }

        if (errores.length === 0) {
          setShouldFetch(true);
          setSelectedItems([]);
          return {
            success: true,
            message: "Todos los equipos fueron eliminados correctamente.",
          };
        } else {
          return { success: false, message: `Errores:\n${errores.join("\n")}` };
        }
      } catch (error) {
        return {
          success: false,
          message: "Ocurrió un error inesperado al eliminar los equipos.",
        };
      } finally {
        setOpenModal(false);
      }
    });

    setOpenModal(true);
  };

  const handleOpenModal = (
    id: string,
    title: string,
    message: string,
    action: (id: string) => Promise<{ success: boolean; message: string }>
  ) => {
    setModalContent({ title, message });
    setConfirmAction(() => () => action(id));
    setOpenModal(true);
  };

  const handleBaja = () => {
    if (selectedItems.length === 0) {
      showMessage("Debe seleccionar al menos un elemento", "warning");
      return;
    }

    setModalContent({
      title: "Dar de Baja Equipos",
      message:
        "¿Estás seguro de que deseas dar de baja los equipos seleccionados?",
    });

    setConfirmAction(() => async () => {
      try {
        const errores: string[] = [];

        for (const id of selectedItems) {
          const { success, message } = await bajaEquipo(id);
          if (!success) {
            errores.push(message);
          }
        }

        if (errores.length === 0) {
          setShouldFetch(true);
          setSelectedItems([]);
          return {
            success: true,
            message: "Todos los equipos fueron dados de baja correctamente.",
          };
        } else {
          return { success: false, message: `Errores:\n${errores.join("\n")}` };
        }
      } catch (error) {
        return {
          success: false,
          message: "Ocurrió un error inesperado al dar de baja los equipos.",
        };
      } finally {
        setOpenModal(false);
      }
    });

    setOpenModal(true);
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    setShouldFetch(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const esFormatoImpresoras = (jsonData: unknown[]) => {
    if (!jsonData.length || typeof jsonData[0] !== "object" || !jsonData[0]) {
      return false;
    }

    const normalizarColumna = (valor: string) =>
      valor
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
    const columnas = Object.keys(jsonData[0] as Record<string, unknown>).map(
      normalizarColumna
    );

    return ["bloque", "ubicacion referencia", "nombre etiqueta", "n serie"].every(
      (columna) => columnas.includes(columna)
    );
  };

  const esFormatoCamaras = (jsonData: unknown[]) => {
    if (!jsonData.length || typeof jsonData[0] !== "object" || !jsonData[0]) return false;
    const columnas = Object.keys(jsonData[0] as Record<string, unknown>).map((columna) =>
      columna.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
    return columnas.includes("serie equipo principal") && columnas.includes("inventario equipo principal");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformarFilaExcel(row: any, filaExcel: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalize = (val: any) =>
      val === undefined || val === null
        ? "S/N"
        : String(val).trim() === "S/N"
        ? "S/N"
        : String(val).trim();

    void normalize;
    return transformComputadoraRow(row, "bodega", filaExcel);

    return {
      tipo: normalize(row["Tipo"]),
      tipo_inventario: "bodega",
      inventario: String(row["Inventario CPU"] ?? ""),
      anio_compra: formatAnioCompra(row["Año Adq"]),
      serie: normalize(row["Serie CPU"]),
      modelo: normalize(row["Modelo Case"]),
      marca: normalize(row["Marca Case"]),
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
      observacion: row["Observación"] !== "S/N" ? row["Observación"] : "",
      empresa: normalize(row["Empresa"]),
      componentes: [
        {
          tipo: "Monitor",
          modelo: normalize(row["Modelo monitor"]),
          serie: normalize(row["Serie monitor"]),
          marca: normalize(row["Marca monitor"]),
          inventario: String(row["Inventario Monitor"] ?? ""),
        },
        {
          tipo: "Teclado",
          modelo: normalize(row["Modelo teclado"]),
          serie: normalize(row["Serie teclado"]),
          marca: normalize(row["Marca teclado"]),
          inventario: String(row["Inventario Teclado"] ?? ""),
        },
        {
          tipo: "Mouse",
          modelo: normalize(row["Modelo mouse"]),
          serie: normalize(row["Serie mouse"]),
          marca: normalize(row["Marca mouse"]),
          inventario: String(row["Inventario Mouse"] ?? ""),
        },
      ],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformarFilaSwitch(row: any, filaExcel: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalize = (val: any) =>
      val === undefined || val === null
        ? "S/N"
        : String(val).trim() === "S/N"
        ? "S/N"
        : String(val).trim();

    return {
      hojaExcel: "Switch",
      filaExcel,
      tipo: "Switch",
      tipo_inventario: "bodega",
      nombre: normalize(row["Nombre"]),
      inventario: String(row["Inventario"] ?? ""),
      anio_compra: formatAnioCompra(row["Año Adq"]),
      marca: normalize(row["Marca"]),
      modelo: normalize(row["Modelo"]),
      serie: normalize(row["Serie"]),
      mac: normalize(row["MAC"]),
      puertos: normalize(row["Puertos"]),
      puerto_ftp: normalize(row["Puertos FTP"]),
      observacion: row["Observación"] !== "S/N" ? row["Observación"] : "",
      empresa: normalize(row["Empresa"]),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformarFilaAccessPoint(row: any, filaExcel: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalize = (val: any) =>
      val === undefined || val === null
        ? "S/N"
        : String(val).trim() === "S/N"
        ? "S/N"
        : String(val).trim();

    return {
      hojaExcel: "AccessPoint",
      filaExcel,
      tipo: "AccessPoint",
      tipo_inventario: "bodega",
      nombre: normalize(row["Nombre"]),
      inventario: String(row["Inventario"] ?? ""),
      anio_compra: formatAnioCompra(row["Año Adq"]),
      marca: normalize(row["Marca"]),
      modelo: normalize(row["Modelo"]),
      serie: normalize(row["Serie"]),
      mac: normalize(row["MAC"]),
      observacion: row["Observación"] !== "S/N" ? row["Observación"] : "",
      empresa: normalize(row["Empresa"]),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformarFilaProyector(row: any, filaExcel: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalize = (val: any) =>
      val === undefined || val === null
        ? "S/N"
        : String(val).trim() === "S/N"
        ? "S/N"
        : String(val).trim();

    return {
      hojaExcel: "Proyector",
      filaExcel,
      tipo: "Proyector",
      tipo_inventario: "bodega",
      inventario: String(row["Inventario"] ?? ""),
      anio_compra: formatAnioCompra(row["Año Adq"]),
      marca: normalize(row["Marca"]),
      modelo: normalize(row["Modelo"]),
      serie: normalize(row["Serie"]),
      lampara: normalize(row["Lámpara"]),
      categoria: normalize(row["Categoria"]),
      observacion: row["Observación"] !== "S/N" ? row["Observación"] : "",
      empresa: normalize(row["Empresa"]),
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
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const equiposImportTodos: any[] = [];
      const errores: string[] = [];

      if (workbook.SheetNames.includes("Computadora")) {
        const worksheet = workbook.Sheets["Computadora"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        if (jsonData && jsonData.length > 0) {
          const equiposComputadora = jsonData.map((row, index) =>
            transformarFilaExcel(row, index + 2)
          );
          equiposImportTodos.push(...equiposComputadora);
        }
      }

      if (workbook.SheetNames.includes("Switch")) {
        const worksheet = workbook.Sheets["Switch"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        if (jsonData && jsonData.length > 0) {
          const equiposSwitch = jsonData.map((row, index) =>
            transformarFilaSwitch(row, index + 2)
          );
          equiposImportTodos.push(...equiposSwitch);
        }
      }

      if (workbook.SheetNames.includes("AccessPoint")) {
        const worksheet = workbook.Sheets["AccessPoint"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        if (jsonData && jsonData.length > 0) {
          const equiposAP = jsonData.map((row, index) =>
            transformarFilaAccessPoint(row, index + 2)
          );
          equiposImportTodos.push(...equiposAP);
        }
      }

      if (workbook.SheetNames.includes("Proyector")) {
        const worksheet = workbook.Sheets["Proyector"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        if (jsonData && jsonData.length > 0) {
          const equiposProyector = jsonData.map((row, index) =>
            transformarFilaProyector(row, index + 2)
          );
          equiposImportTodos.push(...equiposProyector);
        }
      }

      if (workbook.SheetNames.includes("UPS")) {
        const worksheet = workbook.Sheets["UPS"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData && jsonData.length > 0) {
          const equiposUps = jsonData.map((row, index) =>
            transformUpsRow(row as Record<string, unknown>, "bodega", index + 2)
          );
          equiposImportTodos.push(...equiposUps);
        }
      }

      if (workbook.SheetNames.includes("Cámara")) {
        const worksheet = workbook.Sheets["Cámara"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        if (jsonData && jsonData.length > 0) {
          const filasInvalidas = jsonData
            .map((row, index) => (!isValidCameraImportType(row as Record<string, unknown>) ? index + 2 : null))
            .filter((fila): fila is number => fila !== null);
          if (filasInvalidas.length > 0) {
            errores.push(`Cámara - La columna Tipo debe contener únicamente "Cámara". Filas: ${filasInvalidas.join(", ")}`);
          } else {
            equiposImportTodos.push(...jsonData.map((row, index) =>
              transformCamaraRow(row as Record<string, unknown>, "bodega", index + 2)
            ));
          }
        }
      }

      if (workbook.SheetNames.includes("Impresora")) {
        const worksheet = workbook.Sheets["Impresora"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData && jsonData.length > 0) {
          const filasInvalidas = jsonData
            .map((row, index) => (!isValidPrinterImportType(row as Record<string, unknown>) ? index + 2 : null))
            .filter((fila): fila is number => fila !== null);

          if (filasInvalidas.length > 0) {
            errores.push(`Impresora - La columna Tipo debe contener únicamente "Impresora". Filas: ${filasInvalidas.join(", ")}`);
          } else {
            const impresoras = jsonData.map((row, index) =>
              transformImpresoraRow(row as Record<string, unknown>, "bodega", index + 2)
            );
            equiposImportTodos.push(...impresoras);
          }
        }
      }

      if (workbook.SheetNames.includes("Equipos Simples")) {
        const worksheet = workbook.Sheets["Equipos Simples"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData && esFormatoImpresoras(jsonData)) {
          const filasInvalidas = jsonData
            .map((row, index) => (!isValidPrinterImportType(row as Record<string, unknown>) ? index + 2 : null))
            .filter((fila): fila is number => fila !== null);

          if (filasInvalidas.length > 0) {
            errores.push(`Impresora - La columna Tipo debe contener únicamente "Impresora". Filas: ${filasInvalidas.join(", ")}`);
          } else {
            const impresoras = jsonData.map((row, index) =>
              transformImpresoraRow(row as Record<string, unknown>, "bodega", index + 2)
            );
            equiposImportTodos.push(...impresoras);
          }
        } else if (jsonData && esFormatoCamaras(jsonData)) {
          equiposImportTodos.push(...jsonData.map((row, index) =>
            transformCamaraRow(row as Record<string, unknown>, "bodega", index + 2)
          ));
        }
      }

      if (equiposImportTodos.length === 0 && errores.length === 0) {
        showMessage(
          "El archivo no contiene ninguna hoja válida (Computadora, Proyector, AccessPoint, Switch, Cámara, Impresora, UPS o Equipos Simples).",
          "warning"
        );
        return;
      }

      setImportPreview({
        fileName: file.name,
        sheets: workbook.SheetNames,
        equipment: equiposImportTodos,
        errors: errores,
      });
      setOpenImportPreview(true);
    };
    reader.readAsBinaryString(file);
  };

  const cancelarImportacion = () => {
    setOpenImportPreview(false);
    setImportPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmarImportacion = async () => {
    if (!importPreview || importLoading) return;

    setOpenImportPreview(false);
    try {
      const resultado = await importarEquiposBodega(importPreview.equipment, user?.email);
      setImportResult(resultado);
      setOpenImportResult(true);

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
    } finally {
      setImportPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
    if (!newValue) return;
    if (newValue.id === 0) {
      setRowsPerPage(0);
    } else {
      const rows = parseInt(newValue?.name || "10", 10) || 10;
      setRowsPerPage(rows);
    }
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              "Capacidad HDD": capacidad_hdd,
              "Tipo disco": tipo_disco,
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
              direccion_ip,
              nombre_equipo,
              dominio,
              sistema_operativo,
              procesador,
              tipo_ram,
              capacidad_ram,
              "Capacidad HDD": capacidad_hdd,
              "Tipo Disco": tipo_disco,
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
              marca,
              modelo,
              serie,
              mac,
              nombre_equipo,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: "AccessPoint",
              empresa,
              inventario,
              anio_compra,
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
              anio_compra,
              fecha_ultimo_cambio,
              observacion,
            }) => ({
              tipo: periferico,
              marca,
              modelo,
              serie,
              inventario,
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
      const wsAP = XLSX.utils.json_to_sheet(formatAP(allEquipos.AccessPoint));
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
      XLSX.utils.book_append_sheet(wb, wsAP, "AccessPoint");
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
          )}

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
          <Loader />
        ) : error ? (
          <p>Error al cargar los equipos</p>
        ) : equiposBodega.length === 0 ? (
          <p className="text-center text-gray-500 my-5">
            No hay datos disponibles. Presiona "Buscar" para cargar resultados.
          </p>
        ) : (
          <>
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs uppercase bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="flex items-center gap-2 px-4 py-3 w-16">
                    <Tooltip title="Seleccionar Todos">
                      <input
                        type="checkbox"
                        onChange={handleSelectAllChange}
                        checked={selectedItems.length === equiposBodega.length}
                        className="mr-2"
                        disabled={unableAction}
                      />
                    </Tooltip>
                    {selectedItems.length > 0 && (
                      <>
                        <Tooltip title="Eliminar Equipos">
                          <span
                            className={
                              unableActionEditor
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }
                          >
                            <Icon
                              icon="weui:delete-outlined"
                              width="20"
                              height="20"
                              onClick={
                                !unableActionEditor ? handleDelete : undefined
                              }
                              className="cursor-pointer"
                            />
                          </span>
                        </Tooltip>
                        <Tooltip title="Dar de Baja Equipos">
                          <span
                            className={
                              unableAction
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }
                          >
                            <Icon
                              icon="ph:arrow-fat-down-light"
                              width="20"
                              height="20"
                              onClick={!unableAction ? handleBaja : undefined}
                              className="cursor-pointer"
                            />
                          </span>
                        </Tooltip>
                      </>
                    )}
                  </th>
                  <th scope="col" className="px-4 py-3 w-14">
                    <button
                      type="button"
                      onClick={() => toggleSort("periferico")}
                      className="flex items-center gap-1"
                    >
                      Equipo
                      {sortBy === "periferico" ? (
                        sortDir === "asc" ? (
                          <Icon icon="mdi:sort-ascending" width="16" height="16" />
                        ) : (
                          <Icon icon="mdi:sort-descending" width="16" height="16" />
                        )
                      ) : (
                        <Icon icon="mdi:sort" width="16" height="16" className="opacity-60" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 w-36">
                    <button type="button" onClick={() => toggleSort("marca")} className="flex items-center gap-1">
                      Marca {sortBy === "marca" ? (
                        sortDir === "asc" ? (
                          <Icon icon="mdi:sort-ascending" width="16" height="16" />
                        ) : (
                          <Icon icon="mdi:sort-descending" width="16" height="16" />
                        )
                      ) : (
                        <Icon icon="mdi:sort" width="16" height="16" className="opacity-60" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 w-36">
                    <button type="button" onClick={() => toggleSort("modelo")} className="flex items-center gap-1">
                      Modelo {sortBy === "modelo" ? (
                        sortDir === "asc" ? (
                          <Icon icon="mdi:sort-ascending" width="16" height="16" />
                        ) : (
                          <Icon icon="mdi:sort-descending" width="16" height="16" />
                        )
                      ) : (
                        <Icon icon="mdi:sort" width="16" height="16" className="opacity-60" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 w-32">
                    <button type="button" onClick={() => toggleSort("serie")} className="flex items-center gap-1">
                      Serie {sortBy === "serie" ? (
                        sortDir === "asc" ? (
                          <Icon icon="mdi:sort-ascending" width="16" height="16" />
                        ) : (
                          <Icon icon="mdi:sort-descending" width="16" height="16" />
                        )
                      ) : (
                        <Icon icon="mdi:sort" width="16" height="16" className="opacity-60" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 w-28">
                    <button type="button" onClick={() => toggleSort("inventario")} className="flex items-center gap-1">
                      Inventario {sortBy === "inventario" ? (
                        sortDir === "asc" ? (
                          <Icon icon="mdi:sort-ascending" width="16" height="16" />
                        ) : (
                          <Icon icon="mdi:sort-descending" width="16" height="16" />
                        )
                      ) : (
                        <Icon icon="mdi:sort" width="16" height="16" className="opacity-60" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3 w-56">
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
                    <td className="px-4 py-2 w-16">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(equipo.id_equipo)}
                        onChange={() => handleCheckboxChange(equipo.id_equipo)}
                        disabled={unableAction}
                      />
                    </td>
                    <td className="px-4 py-2 w-14">{equipo.periferico}</td>
                    <td className="px-4 py-2 w-36">{equipo.marca}</td>
                    <td className="px-4 py-2 w-36">{equipo.modelo}</td>
                    <td className="px-4 py-2 w-32">{equipo.serie}</td>
                    <td className="px-4 py-2 w-28">{equipo.inventario}</td>
                    <td className="px-4 py-3 flex items-center gap-2 truncate text-black w-56">
                      <Tooltip title="Ver detalles">
                        <span>
                          <Link
                            to="/visualizarBodega"
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
                                `¿Estás seguro de que deseas eliminar el equipo ${equipo.inventario}?`,
                                deleteEquipo
                              )
                            : undefined
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
                        tabIndex={unableAction ? -1 : 0}
                        aria-disabled={unableAction}
                        style={
                          unableAction
                          ? { pointerEvents: "none", opacity: 0.5 }
                          : {}
                        }
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
                        <span
                          className={unableActionEditor ? "opacity-50 pointer-events-none" : ""}
                        >
                          <Icon
                          icon="icon-park-outline:upload-computer"
                          width="25"
                          height="25"
                          onClick={
                            !unableActionEditor
                            ? () =>
                              handleOpenModalPasarAActivo(
                                equipo.id_equipo
                              )
                            : undefined
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
          </>
        )}
        
        <nav
          className="flex flex-col md:flex-row justify-between items-center p-4"
          aria-label="Table navigation"
        >
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
              <button
                type="button"
                onClick={() => downloadImportTemplate("bodega")}
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
              >
                <Icon icon="mdi:file-download" width="20" height="20" />
              </button>
            </Tooltip>
          </div>
          {!loading && !error && equiposBodega.length > 0 && (
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
          )}
        </nav>
        
        {importLoading && (
          <div className="flex justify-center items-center my-8">
            <Loader />
            <span className="ml-4 text-lg font-semibold text-blue-700">
              Importando equipos, por favor espere...
            </span>
          </div>
        )}
      </div>
      <ModalPasarAActivo
        equipoId={selectedEquipoId}
        open={openModalPasarAActivo}
        onClose={handleCloseModalPasarAActivo}
        onSuccess={handlePasarAActivoSuccess}
      />
      <ModalConfirmation
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={modalContent.title}
        message={modalContent.message}
      />
      <ImportResultDialog
        open={openImportResult}
        onClose={() => setOpenImportResult(false)}
        result={importResult}
        title="Resultado de importación de bodega"
      />
      <ImportPreviewDialog
        open={openImportPreview}
        preview={importPreview}
        loading={importLoading}
        onCancel={cancelarImportacion}
        onConfirm={confirmarImportacion}
      />
    </div>
  );
};

export default Bodega;
