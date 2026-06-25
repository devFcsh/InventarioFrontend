import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import { ModalAgregarActivo } from "../../../../features/Equipos/Activos/AgregarActivo/pages/ModalAgregarActivo.tsx";
import usePerifericos from "../../../../hooks/usePerifericos";
import useUsuarios from "../../../../hooks/useUsuarios";
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
import {
  ImportarEquiposResultado,
  useImportarEquipoActivo,
} from "../hooks/useImportarEquipoActivo.ts";
import { MantenimientoActivo } from "../MantenimientoActivo/Homepage/MantenimientoActivo.tsx";
import ImportResultDialog from "../../shared/ImportResultDialog.tsx";
import { transformComputadoraRow } from "../../shared/excelImport.ts";

const Activos = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalActivos, setOpenModalActivos] = useState<boolean>(false);
  const [openModalMantenimientos, setOpenModalMantenimientos] = useState(false);
  const [openImportResult, setOpenImportResult] = useState(false);
  const [importResult, setImportResult] = useState<ImportarEquiposResultado | null>(null);
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

  const [modalContentActivos] = useState<{
    title: string;
    message: string;
  }>({
    title: "Agregar Activos",
    message: "Seleccione el periférico a registrar",
  });
  

  const [inputPeriferico, setInputPeriferico] = useState(() => {
    return sessionStorage.getItem("activos_filter_periferico") || "";
  });
  const [inputMarca, setInputMarca] = useState(() => {
    return sessionStorage.getItem("activos_filter_marca") || "";
  });
  const [inputModelo, setInputModelo] = useState(() => {
    return sessionStorage.getItem("activos_filter_modelo") || "";
  });
  const [inputSerie, setInputSerie] = useState(() => {
    return sessionStorage.getItem("activos_filter_serie") || "";
  });
  const [inputInventario, setInputInventario] = useState(() => {
    return sessionStorage.getItem("activos_filter_inventario") || "";
  });
  const { usuarios } = useUsuarios();
  const [selectedUsuarioFilter, setSelectedUsuarioFilter] = useState<Record<string, unknown> | null>(() => {
    const saved = sessionStorage.getItem("activos_filter_usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const [shouldFetch, setShouldFetch] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const { rol, user } = useUser();
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
    usuarioId: selectedUsuarioFilter ? String(selectedUsuarioFilter.id_usuario ?? selectedUsuarioFilter.id ?? selectedUsuarioFilter) : "",
  };

  const { eliminarEquipo } = useEliminarComputadora();
  const { darDeBajaEquipo } = useDarDeBajaEquipo();
  const { equipos, totalCount, loading, error } = useEquiposFiltrados(
    filtros,
    currentPage,
    rowsPerPage,
    shouldFetch,
    sortBy,
    sortDir
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

  useEffect(() => {
    sessionStorage.setItem("activos_filter_periferico", inputPeriferico);
  }, [inputPeriferico]);

  useEffect(() => {
    sessionStorage.setItem("activos_filter_marca", inputMarca);
  }, [inputMarca]);

  useEffect(() => {
    sessionStorage.setItem("activos_filter_modelo", inputModelo);
  }, [inputModelo]);

  useEffect(() => {
    sessionStorage.setItem("activos_filter_serie", inputSerie);
  }, [inputSerie]);

  useEffect(() => {
    sessionStorage.setItem("activos_filter_inventario", inputInventario);
  }, [inputInventario]);

  useEffect(() => {
    if (selectedUsuarioFilter) {
      sessionStorage.setItem("activos_filter_usuario", JSON.stringify(selectedUsuarioFilter));
    } else {
      sessionStorage.removeItem("activos_filter_usuario");
    }
  }, [selectedUsuarioFilter]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function columnasFaltantesExcel(jsonData: any[], tipoEquipo: string): string[] {
    if (!jsonData || jsonData.length === 0) return [];
    
    let requiredColumns: string[] = [];
    
    switch(tipoEquipo) {
      case "Computadora":
        requiredColumns = [
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
          "Modelo monitor",
          "Serie monitor",
          "Inventario Monitor",
          "Modelo teclado",
          "Serie teclado",
          "Inventario Teclado",
          "Modelo mouse",
          "Serie mouse",
          "Inventario Mouse",
          "Tipo Disco",
          "Empresa"
        ];
        break;
      case "Switch":
        requiredColumns = [
          "Nombre",
          "Inventario",
          "Año Adq",
          "Bloque",
          "Ubicación",
          "Marca",
          "Modelo",
          "Serie",
          "MAC",
          "Puertos",
          "Puertos FTP",
          "Empresa"
        ];
        break;
      case "AccessPoint":
        requiredColumns = [
          "Nombre",
          "Inventario",
          "Año Adq",
          "Bloque",
          "Ubicación",
          "Marca",
          "Modelo",
          "Serie",
          "MAC",
          "Empresa"
        ];
        break;
      case "Proyector":
        requiredColumns = [
          "Inventario",
          "Año Adq",
          "Bloque",
          "Ubicación",
          "Marca",
          "Modelo",
          "Serie",
          "Lámpara",
          "Categoria",
          "Empresa"
        ];
        break;
      case "EquiposSimples":
        requiredColumns = [
          "Tipo",
          "Inventario",
          "Año Adq",
          "Serie",
          "Modelo",
          "Marca",
          "Uso",
          "Usuario",
          "Edificio",
          "Observación",
          "Empresa",
          "Serie Equipo Principal"
        ];
        break;
      default:
        return [];
    }
    
    if (tipoEquipo === "Computadora") {
      requiredColumns.push(
        "Marca Case",
        "No. Aula",
        "Oficina",
        "Año Adq",
        "Sistema Operativo",
        "Versión",
        "Observación"
      );
    }

    const normalizar = (str: string) => 
      str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    
    const firstRow = jsonData[0];
    const columnasExcel = Object.keys(firstRow);
    const columnasExcelNormalizadas = columnasExcel.map(normalizar);
    
    return requiredColumns.filter((col) => {
      const colNormalizada = normalizar(col);
      return !columnasExcelNormalizadas.includes(colNormalizada);
    });
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
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
    return transformComputadoraRow(row, "activo", filaExcel);

    const ubicacion = row["Oficina"] !== "" ? row["Oficina"] : row["No. Aula"];
    return {
      tipo: normalize(row["Tipo"]),
      tipo_inventario: "activo",
      inventario: String(row["Inventario CPU"] ?? ""),
      anio_compra:
        row["Año Adq"] !== "S/N" && row["Año Adq"] !== undefined
          ? String(parseInt(row["Año Adq"]))
          : "S/N",
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
      uso: normalize(row["Uso"]),
      usuario: normalize(row["Usuario"]),
      edificio: normalize(row["Edificio"]),
      ubicacion: normalize(ubicacion),
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
      tipo_inventario: "activo",
      nombre: normalize(row["Nombre"]),
      inventario: String(row["Inventario"] ?? ""),
      anio_compra:
        row["Año Adq"] !== "S/N" && row["Año Adq"] !== undefined
          ? String(parseInt(row["Año Adq"]))
          : "S/N",
      edificio: normalize(row["Bloque"]),
      ubicacion: normalize(row["Ubicación"]),
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
      tipo_inventario: "activo",
      nombre: normalize(row["Nombre"]),
      inventario: String(row["Inventario"] ?? ""),
      anio_compra:
        row["Año Adq"] !== "S/N" && row["Año Adq"] !== undefined
          ? String(parseInt(row["Año Adq"]))
          : "S/N",
      edificio: normalize(row["Bloque"]),
      ubicacion: normalize(row["Ubicación"]),
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
      tipo_inventario: "activo",
      inventario: String(row["Inventario"] ?? ""),
      anio_compra:
        row["Año Adq"] !== "S/N" && row["Año Adq"] !== undefined
          ? String(parseInt(row["Año Adq"]))
          : "S/N",
      edificio: normalize(row["Bloque"]),
      ubicacion: normalize(row["Ubicación"]),
      marca: normalize(row["Marca"]),
      modelo: normalize(row["Modelo"]),
      serie: normalize(row["Serie"]),
      lampara: normalize(row["Lámpara"]),
      categoria: normalize(row["Categoria"]),
      observacion: row["Observación"] !== "S/N" ? row["Observación"] : "",
      empresa: normalize(row["Empresa"]),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transformarFilaEquiposSimples(row: any, filaExcel: number) {
    const ubicacion = row["Oficina"] !== "" ? row["Oficina"] : row["No. Aula"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalize = (val: any) =>
      val === undefined || val === null
        ? "S/N"
        : String(val).trim() === "S/N"
        ? "S/N"
        : String(val).trim();

    return {
      hojaExcel: "Equipos Simples",
      filaExcel,
      tipo: normalize(row["Tipo"]),
      tipo_inventario: "activo",
      inventario: String(row["Inventario"] ?? ""),
      anio_compra:
        row["Año Adq"] !== "S/N" && row["Año Adq"] !== undefined
          ? String(parseInt(row["Año Adq"]))
          : "S/N",
      serie: normalize(row["Serie"]),
      modelo: normalize(row["Modelo"]),
      marca: normalize(row["Marca"]),
      uso: normalize(row["Uso"]),
      usuario: normalize(row["Usuario"]),
      edificio: normalize(row["Edificio"]),
      ubicacion: normalize(ubicacion),
      observacion: row["Observación"] !== "S/N" ? row["Observación"] : "",
      empresa: normalize(row["Empresa"]),
      serie_equipo_principal: normalize(row["Serie Equipo Principal"]),
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
          const faltantes = columnasFaltantesExcel(jsonData, "Computadora");
          if (faltantes.length > 0) {
            errores.push(`Computadora - Faltan columnas: ${faltantes.join(", ")}`);
          } else {
            const equiposComputadora = jsonData.map((row, index) =>
              transformarFilaExcel(row, index + 2)
            );
            equiposImportTodos.push(...equiposComputadora);
          }
        }
      }

      if (workbook.SheetNames.includes("Switch")) {
        const worksheet = workbook.Sheets["Switch"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData && jsonData.length > 0) {
          const faltantes = columnasFaltantesExcel(jsonData, "Switch");
          if (faltantes.length > 0) {
            errores.push(`Switch - Faltan columnas: ${faltantes.join(", ")}`);
          } else {
            const equiposSwitch = jsonData.map((row, index) =>
              transformarFilaSwitch(row, index + 2)
            );
            equiposImportTodos.push(...equiposSwitch);
          }
        }
      }

      if (workbook.SheetNames.includes("AccessPoint")) {
        const worksheet = workbook.Sheets["AccessPoint"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData && jsonData.length > 0) {
          const faltantes = columnasFaltantesExcel(jsonData, "AccessPoint");
          if (faltantes.length > 0) {
            errores.push(`AccessPoint - Faltan columnas: ${faltantes.join(", ")}`);
          } else {
            const equiposAP = jsonData.map((row, index) =>
              transformarFilaAccessPoint(row, index + 2)
            );
            equiposImportTodos.push(...equiposAP);
          }
        }
      }

      if (workbook.SheetNames.includes("Proyector")) {
        const worksheet = workbook.Sheets["Proyector"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData && jsonData.length > 0) {
          const faltantes = columnasFaltantesExcel(jsonData, "Proyector");
          if (faltantes.length > 0) {
            errores.push(`Proyector - Faltan columnas: ${faltantes.join(", ")}`);
          } else {
            const equiposProyector = jsonData.map((row, index) =>
              transformarFilaProyector(row, index + 2)
            );
            equiposImportTodos.push(...equiposProyector);
          }
        }
      }

      if (workbook.SheetNames.includes("Equipos Simples")) {
        const worksheet = workbook.Sheets["Equipos Simples"];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (jsonData && jsonData.length > 0) {
          const faltantes = columnasFaltantesExcel(jsonData, "EquiposSimples");
          if (faltantes.length > 0) {
            errores.push(`Equipos Simples - Faltan columnas: ${faltantes.join(", ")}`);
          } else {
            const equiposSimples = jsonData.map((row, index) =>
              transformarFilaEquiposSimples(row, index + 2)
            );
            equiposImportTodos.push(...equiposSimples);
          }
        }
      }

      if (equiposImportTodos.length === 0 && errores.length === 0) {
        showMessage(
          "El archivo no contiene ninguna hoja válida (Computadora, Switch, AccessPoint, Proyector, Equipos Simples).",
          "warning"
        );
        return;
      }

      if (errores.length > 0) {
        showMessage(
          `Error en formato: ${errores.join(" | ")}`,
          "error"
        );
        return;
      }

      try {
        const resultado = await importarEquiposActivos(equiposImportTodos, user?.email);
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
    if (!newValue) return;
    // if user selected 'Todos' option (id === 0) set rowsPerPage to 0
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
      const fillEmpty = (value: any) => {
        return value === undefined || value === null || value === "" ? "S/N" : value;
      };

      const formatComputadora = (equipos: ExportarComputadora[]) => {
        return equipos.map((equipo, index) => {
          const {
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
            "Capacidad HDD": capacidad_hdd,
            "Tipo disco": tipo_disco,
            marca,
            modelo,
            serie,
            inventario,
            anio_compra,
            observacion,
            empresa,
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
          } = equipo;

          // Determinar si es aula u oficina basado en el formato de ubicación
          const esAula = ubicacion && /^\d+$/.test(ubicacion.toString());
          
          return {
            "Id": index + 1,
            "Edificio": fillEmpty(edificio),
            "No. Aula": esAula ? fillEmpty(ubicacion) : "S/N",
            "Oficina": !esAula && ubicacion ? fillEmpty(ubicacion) : "S/N",
            "Usuario": fillEmpty(usuario),
            "Uso": fillEmpty(uso),
            "Tipo": "Computadora",
            "Empresa": fillEmpty(empresa),
            "Año Adq": fillEmpty(anio_compra),
            "IP": fillEmpty(direccion_ip),
            "Nombre de equipo": fillEmpty(nombre_equipo),
            "Dominio": fillEmpty(dominio),
            "Sistema Operativo": fillEmpty(sistema_operativo),
            "Versión": fillEmpty(version_sistema_operativo),
            "Procesador": fillEmpty(procesador),
            "Capacidad Memoria": (capacidad_ram && tipo_ram) ? `${capacidad_ram} ${tipo_ram}` : fillEmpty(capacidad_ram || tipo_ram),
            "Capacidad HDD": fillEmpty(capacidad_hdd),
            "Tipo Disco": fillEmpty(tipo_disco),
            "Marca Case": fillEmpty(marca),
            "Modelo Case": fillEmpty(modelo),
            "Serie CPU": fillEmpty(serie),
            "Marca monitor": fillEmpty(monitor_marca),
            "Modelo monitor": fillEmpty(monitor_modelo),
            "Serie monitor": fillEmpty(monitor_serie),
            "Marca teclado": fillEmpty(teclado_marca),
            "Modelo teclado": fillEmpty(teclado_modelo),
            "Serie teclado": fillEmpty(teclado_serie),
            "Marca mouse": fillEmpty(mouse_marca),
            "Modelo mouse": fillEmpty(mouse_modelo),
            "Serie mouse": fillEmpty(mouse_serie),
            "Inventario CPU": fillEmpty(inventario),
            "Inventario Monitor": fillEmpty(monitor_inventario),
            "Inventario Teclado": fillEmpty(teclado_inventario),
            "Inventario Mouse": fillEmpty(mouse_inventario),
            "Observación": fillEmpty(observacion),
          };
        });
      };

      const formatSwitch = (equipos: ExportarSwitch[]) => {
        return equipos.map((equipo, index) => {
          const {
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
            observacion,
            empresa,
          } = equipo;
          
          return {
            "N°": index + 1,
            "Año Adq": fillEmpty(anio_compra),
            "Empresa": fillEmpty(empresa),
            "Nombre": fillEmpty(nombre_equipo),
            "Inventario": fillEmpty(inventario),
            "Bloque": fillEmpty(edificio),
            "Ubicación": fillEmpty(ubicacion),
            "Marca": fillEmpty(marca),
            "Modelo": fillEmpty(modelo),
            "Serie": fillEmpty(serie),
            "MAC": fillEmpty(mac),
            "Puertos": fillEmpty(puertos),
            "Puertos FTP": fillEmpty(puerto_ftp),
            "Estado": "S/N",
            "Observación": fillEmpty(observacion),
          };
        });
      };

      const formatAP = (equipos: ExportarAP[]) => {
        return equipos.map((equipo, index) => {
          const {
            inventario,
            anio_compra,
            edificio,
            ubicacion,
            marca,
            modelo,
            serie,
            mac,
            nombre_equipo,
            observacion,
            empresa,
          } = equipo;
          
          return {
            "N°": index + 1,
            "Año Adq": fillEmpty(anio_compra),
            "Empresa": fillEmpty(empresa),
            "Nombre": fillEmpty(nombre_equipo),
            "Inventario": fillEmpty(inventario),
            "Bloque": fillEmpty(edificio),
            "Ubicación": fillEmpty(ubicacion),
            "Marca": fillEmpty(marca),
            "Modelo": fillEmpty(modelo),
            "Serie": fillEmpty(serie),
            "MAC": fillEmpty(mac),
            "Estado": "S/N",
            "Observación": fillEmpty(observacion),
          };
        });
      };

      const formatProyector = (equipos: ExportarProyector[]) => {
        return equipos.map((equipo, index) => {
          const {
            inventario,
            anio_compra,
            edificio,
            ubicacion,
            marca,
            modelo,
            serie,
            lampara,
            observacion,
            empresa,
          } = equipo;
          
          return {
            "N°": index + 1,
            "Año Adq": fillEmpty(anio_compra),
            "Empresa": fillEmpty(empresa),
            "Inventario": fillEmpty(inventario),
            "Bloque": fillEmpty(edificio),
            "Ubicación": fillEmpty(ubicacion),
            "Marca": fillEmpty(marca),
            "Modelo": fillEmpty(modelo),
            "Serie": fillEmpty(serie),
            "Categoría": "S/N",
            "Lámpara": fillEmpty(lampara),
            "Estado": "S/N",
            "Observación": fillEmpty(observacion),
          };
        });
      };

      const formatEquiposSimples = (equipos: ExportarSimples[]) => {
        return equipos.map((equipo, index) => {
          const {
            periferico,
            edificio,
            ubicacion,
            uso,
            usuario,
            anio_compra,
            observacion,
          } = equipo;
          
          return {
            "N°": index + 1,
            "Tipo": fillEmpty(periferico),
            "Edificio": fillEmpty(edificio),
            "Ubicación": fillEmpty(ubicacion),
            "Uso": fillEmpty(uso),
            "Usuario": fillEmpty(usuario),
            "Año Adq": fillEmpty(anio_compra),
            "Observación": fillEmpty(observacion),
          };
        });
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
      XLSX.utils.book_append_sheet(wb, wsComputadoras, "Computadora");
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
        <div className="grid gap-4 my-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            className="w-full"
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
            className="w-full"
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
            className="w-full"
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
            className="w-full"
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
            className="w-full"
          />

          <Autocomplete
            size="small"
            options={usuarios || []}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                : (option as any)?.nombre || (option as any)?.email || String((option as any)?.id_usuario || "")
            }
            value={selectedUsuarioFilter}
            onChange={(_, newValue) => setSelectedUsuarioFilter(newValue as Record<string, unknown> | null)}
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" />
            )}
            className="w-full"
          />
            <div className="flex items-end gap-2">
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
                className="w-1/2"
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-1/2"
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
          <>
            <p className="text-center text-gray-500 my-5">
              No hay datos disponibles. Presiona "Buscar" para cargar resultados.
            </p>
          </>
        ) : (
          <>
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs uppercase bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 min-w-16">
                    <div className="flex items-center gap-2">
                      <Tooltip title="Seleccionar todos">
                        <input
                          type="checkbox"
                          onChange={handleSelectAllChange}
                          checked={selectedItems.length === equipos.length}
                          className="flex-shrink-0"
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
                              className={`cursor-pointer flex-shrink-0 ${
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
                              className={`cursor-pointer flex-shrink-0 ${
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
                              className={`cursor-pointer flex-shrink-0 ${
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
                    </div>
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
                  <th scope="col" className="px-4 py-3 w-48">
                    <button type="button" onClick={() => toggleSort("usuario")} className="flex items-center gap-1">
                      Usuario {sortBy === "usuario" ? (
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
                    <button type="button" onClick={() => toggleSort("uso")} className="flex items-center gap-1">
                      Uso {sortBy === "uso" ? (
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
                    <button type="button" onClick={() => toggleSort("edificio")} className="flex items-center gap-1">
                      Edificio {sortBy === "edificio" ? (
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
                  {rol === "administrador" && (
                    <>
                      <th scope="col" className="px-4 py-3 w-8">
                        <button type="button" onClick={() => toggleSort("autor")} className="flex items-center gap-1">
                          Autor {sortBy === "autor" ? (
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
                      <th scope="col" className="px-4 py-3 w-8">
                        <button type="button" onClick={() => toggleSort("editor")} className="flex items-center gap-1">
                          Editor {sortBy === "editor" ? (
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
                      <th scope="col" className="px-4 py-3 w-40">
                        <button type="button" onClick={() => toggleSort("fecha_creacion")} className="flex items-center gap-1">
                          Fecha Creación {sortBy === "fecha_creacion" ? (
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
                    </>
                  )}
                  <th scope="col" className="px-4 py-3 w-56">
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
                    <td className="px-4 py-2 w-14">{equipo.periferico}</td>
                    <td className="px-4 py-2 w-36">{equipo.marca}</td>
                    <td className="px-4 py-2 w-36">{equipo.modelo}</td>
                    <td className="px-4 py-2 w-32">{equipo.serie}</td>
                    <td className="px-4 py-2 w-28">{equipo.inventario}</td>
                    <td className="px-4 py-2 w-48">{equipo.usuario}</td>
                    <td className="px-4 py-2 w-32">{equipo.uso}</td>
                    <td className="px-4 py-2 w-36">{equipo.edificio}</td>
                    {rol === "administrador" && (
                      <>
                        <td className="px-4 py-2 w-8">{equipo.autor || "-"}</td>
                        <td className="px-4 py-2 w-8">{equipo.editor || "-"}</td>
                        <td className="px-4 py-2 w-40">
                          {equipo.fecha_creacion 
                            ? new Date(equipo.fecha_creacion).toLocaleString("es-ES", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                            : "-"
                          }
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 flex items-center gap-2 truncate text-black w-56">
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
                        
                      <Tooltip title="Agregar y Ver Mantenimientos">
                        <span
                          className={
                            !unableAction && (equipo.periferico === "Computadora" || equipo.periferico === "Laptop")
                              ? ""
                              : "opacity-50 pointer-events-none"
                          }
                        >
                          <Icon
                            icon="pajamas:issue-type-maintenance"
                            width="25"
                            height="25"
                            onClick={
                              !unableAction && (equipo.periferico === "Computadora" || equipo.periferico === "Laptop")
                                ? () => handleOpenMantenimientos(equipo)
                                : undefined
                            }
                            className={
                              !unableAction && (equipo.periferico === "Computadora" || equipo.periferico === "Laptop")
                                ? "cursor-pointer"
                                : "cursor-default"
                            }
                            role="button"
                            aria-disabled={
                              !( !unableAction && (equipo.periferico === "Computadora" || equipo.periferico === "Laptop") )
                            }
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
          {!loading && !error && equipos.length > 0 && (
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
        title="Resultado de importación de activos"
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
