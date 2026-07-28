import { ActivoComputadoraImport } from "../../../types/Activo";
import * as XLSX from "xlsx";

type TipoInventario = "activo" | "bodega" | "baja";

type ExcelRow = Record<string, unknown>;

const SN_COMPACT = new Set(["", "S/N", "SN", "N/A", "NA"]);

const compactValue = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();

export const hasRealExcelValue = (value: unknown) => {
  return !SN_COMPACT.has(compactValue(value));
};

export const normalizeImportValue = (value: unknown) => {
  if (!hasRealExcelValue(value)) {
    return "S/N";
  }

  return String(value).trim();
};

const normalizeExcelHeader = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Obtiene una columna tolerando diferencias de mayúsculas y acentos. */
export const getImportRowValue = (
  row: ExcelRow,
  ...columnNames: string[]
) => {
  for (const columnName of columnNames) {
    if (Object.prototype.hasOwnProperty.call(row, columnName)) {
      return row[columnName];
    }
  }

  const normalizedColumns = Object.keys(row).map((column) => ({
    column,
    normalized: normalizeExcelHeader(column),
  }));

  for (const columnName of columnNames) {
    const match = normalizedColumns.find(
      ({ normalized }) => normalized === normalizeExcelHeader(columnName)
    );
    if (match) {
      return row[match.column];
    }
  }

  return undefined;
};

const normalizeOptionalValue = (value: unknown) => {
  if (!hasRealExcelValue(value)) {
    return "";
  }

  return String(value).trim();
};

export const formatAnioCompra = (value: unknown) => {
  if (!hasRealExcelValue(value)) {
    return "S/N";
  }

  const text = String(value).trim();
  const parsed = Number.parseInt(text, 10);
  return Number.isNaN(parsed) ? text : String(parsed);
};

export const pickExcelLocation = (oficina: unknown, noAula: unknown) => {
  const oficinaValue = normalizeOptionalValue(oficina);
  if (oficinaValue) {
    return oficinaValue;
  }

  const aulaValue = normalizeOptionalValue(noAula);
  return aulaValue;
};

export const parseRamValue = (value: unknown) => {
  if (!hasRealExcelValue(value)) {
    return { ram: "S/N", tipo_ram: "S/N" };
  }

  const text = String(value).trim().replace(/\s+/g, " ");
  const [ram = "S/N", ...rest] = text.split(" ");
  const tipoRam = rest.join(" ").replace(/[()]/g, "").replace(/\s+/g, " ").trim();

  return {
    ram: ram.trim() || "S/N",
    tipo_ram: tipoRam || "S/N",
  };
};

export const buildDiskValue = (capacidad: unknown, tipoDisco: unknown) => {
  const capacidadValue = normalizeOptionalValue(capacidad);
  const tipoDiscoValue = normalizeOptionalValue(tipoDisco);

  if (capacidadValue && tipoDiscoValue) {
    return `${capacidadValue} ${tipoDiscoValue}`.trim();
  }

  if (capacidadValue) {
    return capacidadValue;
  }

  if (tipoDiscoValue) {
    return tipoDiscoValue;
  }

  return "S/N";
};

const normalizeIpValue = (value: unknown) => {
  if (!hasRealExcelValue(value)) {
    return "S/N";
  }

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/dhcp/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return normalized || "S/N";
};

const buildComponent = (
  tipo: "Monitor" | "Teclado" | "Mouse",
  marca: unknown,
  modelo: unknown,
  serie: unknown,
  inventario: unknown
) => {
  const hasData = [marca, modelo, serie, inventario].some(hasRealExcelValue);
  if (!hasData) {
    return null;
  }

  return {
    tipo,
    marca: normalizeImportValue(marca),
    modelo: normalizeImportValue(modelo),
    serie: normalizeImportValue(serie),
    inventario: normalizeImportValue(inventario),
  };
};

export const transformComputadoraRow = (
  row: Record<string, unknown>,
  tipoInventario: TipoInventario,
  filaExcel: number
): ActivoComputadoraImport => {
  const ubicacion = pickExcelLocation(row["Oficina"], row["No. Aula"]);
  const { ram, tipo_ram } = parseRamValue(row["Capacidad Memoria"]);
  const versionSO = normalizeImportValue(row["Versión"]);

  const componentes = [
    buildComponent(
      "Monitor",
      row["Marca monitor"],
      row["Modelo monitor"],
      row["Serie monitor"],
      row["Inventario Monitor"]
    ),
    buildComponent(
      "Teclado",
      row["Marca teclado"],
      row["Modelo teclado"],
      row["Serie teclado"],
      row["Inventario Teclado"]
    ),
    buildComponent(
      "Mouse",
      row["Marca mouse"],
      row["Modelo mouse"],
      row["Serie mouse"],
      row["Inventario Mouse"]
    ),
  ].filter(
    (
      component
    ): component is {
      tipo: "Monitor" | "Teclado" | "Mouse";
      marca: string;
      modelo: string;
      serie: string;
      inventario: string;
    } => component !== null
  );

  return {
    hojaExcel: "Computadora",
    filaExcel,
    tipo: normalizeImportValue(row["Tipo"]),
    tipo_inventario: tipoInventario,
    inventario: normalizeImportValue(row["Inventario CPU"]),
    anio_compra: formatAnioCompra(row["Año Adq"]),
    serie: normalizeImportValue(row["Serie CPU"]),
    modelo: normalizeImportValue(row["Modelo Case"]),
    marca: normalizeImportValue(row["Marca Case"]),
    usuario: normalizeImportValue(row["Usuario"]),
    uso: normalizeImportValue(row["Uso"]),
    edificio: normalizeImportValue(row["Edificio"]),
    ubicacion,
    empresa: normalizeImportValue(row["Empresa"]),
    nombreEquipo: normalizeImportValue(row["Nombre de equipo"]),
    direccionIp: normalizeIpValue(row["IP"]),
    dominio: normalizeImportValue(row["Dominio"]),
    sistemaOperativo: normalizeImportValue(row["Sistema Operativo"]),
    versionSO,
    versionso: versionSO,
    ram,
    tipo_ram,
    disco: buildDiskValue(row["Capacidad HDD"], row["Tipo Disco"]),
    procesador: normalizeImportValue(row["Procesador"]),
    observacion: normalizeOptionalValue(row["Observación"]),
    componentes,
  };
};

export const transformUpsRow = (
  row: ExcelRow,
  tipoInventario: TipoInventario,
  filaExcel: number
): ActivoComputadoraImport => ({
  hojaExcel: "UPS",
  filaExcel,
  tipo: "UPS",
  tipo_inventario: tipoInventario,
  inventario: normalizeImportValue(
    getImportRowValue(row, "Inventario")
  ),
  anio_compra: formatAnioCompra(
    getImportRowValue(row, "Año Adq", "AÃ±o Adq")
  ),
  serie: normalizeImportValue(getImportRowValue(row, "Serie")),
  modelo: normalizeImportValue(getImportRowValue(row, "Modelo")),
  marca: normalizeImportValue(getImportRowValue(row, "Marca")),
  usuario: "Por Asignar",
  uso: "Por Asignar",
  edificio: normalizeImportValue(getImportRowValue(row, "Edificio")),
  ubicacion: normalizeImportValue(getImportRowValue(row, "Referencia")),
  empresa: normalizeImportValue(getImportRowValue(row, "Empresa")),
  nombreEquipo: "S/N",
  observacion: normalizeOptionalValue(
    getImportRowValue(row, "Observación", "ObservaciÃ³n")
  ),
});

export const downloadImportTemplate = (
  tipoInventario: Extract<TipoInventario, "activo" | "bodega">
) => {
  const sheets: Record<string, string[]> =
    tipoInventario === "activo"
      ? {
          Computadora: [
            "Id", "Edificio", "No. Aula", "Oficina", "Usuario", "Uso", "Tipo", "Empresa", "Año Adq", "IP",
            "Nombre de equipo", "Dominio", "Sistema Operativo", "Versión", "Procesador", "Capacidad Memoria", "Capacidad HDD", "Tipo Disco",
            "Marca Case", "Modelo Case", "Serie CPU", "Marca monitor", "Modelo monitor", "Serie monitor", "Marca teclado", "Modelo teclado", "Serie teclado",
            "Marca mouse", "Modelo mouse", "Serie mouse", "Inventario CPU", "Inventario Monitor", "Inventario Teclado", "Inventario Mouse", "Observación",
          ],
          Proyector: ["N°", "Año Adq", "Empresa", "Inventario", "Bloque", "Ubicación", "Marca", "Modelo", "Serie", "Categoría", "Lámpara", "Estado", "Observación"],
          AccessPoint: ["N°", "Año Adq", "Empresa", "Nombre", "Inventario", "Bloque", "Ubicación", "Marca", "Modelo", "Serie", "MAC", "Estado", "Observación"],
          Switch: ["N°", "Año Adq", "Empresa", "Nombre", "Inventario", "Bloque", "Ubicación", "Marca", "Modelo", "Serie", "MAC", "Puertos", "Puertos FTP", "Estado", "Observación"],
          "Equipos Simples": ["Id", "Edificio", "No. Aula", "Oficina", "Usuario", "Uso", "Tipo", "Empresa", "Año Adq", "Marca", "Modelo", "Serie", "Inventario", "Serie Equipo Principal", "Observación"],
        }
      : {
          Computadora: [
            "Id", "Tipo", "Empresa", "Año Adq", "IP", "Nombre de equipo", "Dominio", "Sistema Operativo", "Versión", "Procesador", "Capacidad Memoria", "Capacidad HDD", "Tipo Disco",
            "Marca Case", "Modelo Case", "Serie CPU", "Marca monitor", "Modelo monitor", "Serie monitor", "Marca teclado", "Modelo teclado", "Serie teclado", "Marca mouse", "Modelo mouse", "Serie mouse",
            "Inventario CPU", "Inventario Monitor", "Inventario Teclado", "Inventario Mouse", "Observación",
          ],
          Proyector: ["N°", "Año Adq", "Empresa", "Inventario", "Marca", "Modelo", "Serie", "Categoría", "Lámpara", "Estado", "Observación"],
          AccessPoint: ["N°", "Año Adq", "Empresa", "Nombre", "Inventario", "Marca", "Modelo", "Serie", "MAC", "Estado", "Observación"],
          Switch: ["N°", "Año Adq", "Empresa", "Nombre", "Inventario", "Marca", "Modelo", "Serie", "MAC", "Puertos", "Puertos FTP", "Estado", "Observación"],
        };

  sheets.UPS = [
    "Id", "Edificio", "Referencia", "Empresa", "Año Adq", "Marca", "Modelo", "Serie", "Inventario", "Observación",
  ];

  const workbook = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([sheetName, headers]) => {
    const emptyRow = headers.map(() => "");
    const worksheet = XLSX.utils.aoa_to_sheet([headers, emptyRow]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  XLSX.writeFile(workbook, `formato_${tipoInventario}.xlsx`);
};
