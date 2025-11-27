import { Autocomplete, TextField, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import React from "react";
import { createRoot, Root } from "react-dom/client";
import Loader from "@pages/Loader";
import { filas } from "../../../../../data";
import useMantenimientosFiltrados, { MantenimientoItem } from "../hooks/useMantenimientosFiltrados";
import useMantenimientoDetalle from "../hooks/useMantenimientoDetalle";
import clienteAxios from "../../../../../hooks";
import { useObtenerComputadora } from "../../EditarActivo/hooks/useComputadora";
import MantenimientoDetalleView from "./MantenimientoDetalleView";
import useSeries from "@hooks/useSeries";
import { useSnackbar } from "@context/SnackbarContext";
import useEliminarMantenimiento from "../hooks/useEliminarMantenimiento";
import ModalConfirmation from "../../../../../components/ModalConfirmation";

const Mantenimiento = () => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [inputSerie, setInputSerie] = useState<string>("");
  const [inputInventario, setInputInventario] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  const filtros = {
    serie: inputSerie || "",
    inventario: inputInventario || "",
  };

  const { mantenimientos, totalCount, loading, error } = useMantenimientosFiltrados(
    filtros,
    currentPage,
    rowsPerPage,
    shouldFetch,
    sortBy,
    sortDir
  );

  const { series } = useSeries();
  const [exporting, setExporting] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<
    () => Promise<{ success: boolean; message: string }>
  >(() => async () => ({
    success: false,
    message: "",
  }));
  const [modalContent, setModalContent] = useState<{ title: string; message: string }>({
    title: "Confirmar",
    message: "¿Estás seguro de que deseas realizar esta acción?",
  });
  const { showMessage } = useSnackbar();
  const { eliminarMantenimiento } = useEliminarMantenimiento();
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  const { detalle, loading: loadingDetalle, error: errorDetalle } = useMantenimientoDetalle(detalleId ?? null);

  const detalleData = detalle?.mantenimiento ? detalle.mantenimiento : detalle ?? null;
  const detalleActividades: Array<{ actividad?: string; nombre?: string; realizada?: boolean }> =
    detalleData ? detalleData.actividades ?? detalleData.actividades_mantenimiento ?? [] : [];

  const equipoIdStr = detalleData?.equipo?.id_equipo ? String(detalleData.equipo.id_equipo) : null;
  const { equipo: equipoDetalle, componentes: componentesDetalle } = useObtenerComputadora(equipoIdStr);

  useEffect(() => {
    if (shouldFetch) setShouldFetch(false);
  }, [shouldFetch]);

  useEffect(() => {
    if (totalCount > 0 && rowsPerPage > 0) {
      setTotalPages(Math.max(1, Math.ceil(totalCount / rowsPerPage)));
    } else {
      setTotalPages(1);
    }
  }, [totalCount, rowsPerPage]);

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

  const formatServerDate = (s?: string | null) => {
    if (!s) return "";
    const str = String(s);
    const hasTz = /[zZ]$/.test(str) || /[+-]\d{2}:?\d{2}$/.test(str);
    const pad = (n: number) => String(n).padStart(2, "0");
    if (hasTz) {
      try {
        const d = new Date(str);
        const Y = d.getUTCFullYear();
        const M = pad(d.getUTCMonth() + 1);
        const D = pad(d.getUTCDate());
        const hh = pad(d.getUTCHours());
        const mm = pad(d.getUTCMinutes());
        return `${D}/${M}/${Y} ${hh}:${mm}`;
      } catch (e) {
        return String(str);
      }
    }

    const m = str.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (m) {
      const [, Y, M, D, hh, mm] = m;
      return `${D}/${M}/${Y} ${hh}:${mm}`;
    }

    try {
      const d = new Date(str);
      const Y = d.getFullYear();
      const M = pad(d.getMonth() + 1);
      const D = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      return `${D}/${M}/${Y} ${hh}:${mm}`;
    } catch (e) {
      return str;
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      return [...prev, id];
    });
  };

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedItems(mantenimientos.map((m: MantenimientoItem) => Number(m.id_mantenimiento)));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirm = async () => {
    try {
      const result = await confirmAction();
      if (result?.success) {
        showMessage(result.message || "Operación completada con éxito.", "success");
        setSelectedItems([]);
        setShouldFetch(true);
      } else {
        showMessage(result?.message || "La operación no se pudo completar.", "error");
      }
    } catch (error) {
      showMessage("Error al realizar la operación.", "error");
    } finally {
      handleCloseModal();
    }
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

  const deleteMantenimiento = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!id) return { success: false, message: "ID inválido" };
    try {
      const res = await eliminarMantenimiento(id);
      if (res.success) {
        setShouldFetch(true);
      }
      return { success: res.success, message: res.message };
    } catch (e) {
      return { success: false, message: String(e) };
    }
  };

  const deleteMantenimientos = async (ids: number[]) => {
    try {
      const errors: number[] = [];
      for (const id of ids) {
        const result = await eliminarMantenimiento(id);
        if (!result.success) errors.push(id);
      }
      if (errors.length === 0) {
        showMessage("Operación completada con éxito", "success");
      } else {
        showMessage(`No se pudieron eliminar los mantenimientos: ${errors.join(", ")}`, "error");
      }
      setShouldFetch(true);
      setSelectedItems([]);
    } catch (error) {
      showMessage("Error al eliminar mantenimientos.", "error");
    }
  };

  const exportSelectedToPdf = async () => {
    if (!selectedItems || selectedItems.length === 0) return;
    setExporting(true);
    try {
      const fetches = selectedItems.map((id) => clienteAxios.get(`/mantenimientos/detalle/${id}`));
      const results = await Promise.all(fetches);
      const detalles = results.map((r) => r.data || null);

      const style = `body{font-family: Arial, Helvetica, sans-serif; padding:20px; color:#111;} h1,h2,h3{margin:0 0 8px 0;} .section-title{font-weight:700; margin-top:12px; margin-bottom:8px;} .field{display:flex; gap:12px; margin-bottom:10px; align-items:flex-start;} .field .label{width:200px; font-weight:600; color:#444; font-size:12px;} .field .value{flex:1; font-size:13px; color:#111;} #mantenimiento-pdf-content .field .value, #mantenimiento-pdf-content .activity-value, #mantenimiento-pdf-content .prewrap, #mantenimiento-pdf-content .MuiFormControlLabel-label, #mantenimiento-pdf-content .value, #mantenimiento-pdf-content p, #mantenimiento-pdf-content div, #mantenimiento-pdf-content span { font-family: Arial, Helvetica, sans-serif !important; font-size: 13px !important; color: #111 !important; line-height: 1.2 !important; } .grid{display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px;} .grid .col{width:48%;} .activities{display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 12px 0;} .activity{width:32%; display:flex; align-items:center; gap:8px; font-size:11px;} .activity input[type=checkbox]{transform:scale(1) !important; width:20px !important; height:20px !important; margin:0; vertical-align:middle;} .MuiCheckbox-root, .MuiFormControlLabel-root .MuiCheckbox-root { display:inline-flex !important; width:22px !important; height:22px !important; padding:0 !important; } .MuiCheckbox-root svg, .MuiSvgIcon-root, #mantenimiento-pdf-content svg { width:18px !important; height:18px !important; font-size:18px !important; transform:none !important; vertical-align:middle; } .activity .MuiFormControlLabel-label, .activity .activity-value { font-size:13px !important; line-height:1.2 !important; color: #111 !important; flex:1 !important; } .MuiCheckbox-root.Mui-disabled, .MuiCheckbox-root.Mui-disabled svg, input[type=checkbox]:disabled { opacity: 1 !important; color: #111 !important; fill: #111 !important; } .MuiFormControlLabel-root.Mui-disabled .MuiFormControlLabel-label, .MuiFormControlLabel-root.Mui-disabled { color: #111 !important; opacity: 1 !important; } .section-title { font-size:16px !important; font-weight:700 !important; color:#111 !important; margin-top:12px; margin-bottom:8px; } #mantenimiento-pdf-content .mantenimiento-title { text-align: center !important; font-size: 22px !important; font-weight: 700 !important; margin: 8px 0 12px 0 !important; } #mantenimiento-pdf-content .prewrap { font-family: Arial, Helvetica, sans-serif !important; font-size:13px !important; color:#111 !important; white-space:pre-wrap !important; } .MuiCheckbox-root.Mui-checked svg { color: #111 !important; fill: #111 !important; } .activity .MuiFormControlLabel-label { margin-left: 8px !important; } table{width:100%; border-collapse:collapse; margin-top:8px;} table th, table td{border:1px solid #ddd; padding:6px 8px; text-align:left; font-size:13px;} .prewrap{white-space:pre-wrap;} @media print{ .page-break { page-break-inside: avoid; } }`;

      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) return;
      printWindow.document.write(`<!doctype html><html><head><title>Mantenimientos seleccionados</title><style>${style}</style></head><body></body></html>`);

      const tempContainer = document.createElement("div");
      tempContainer.id = "__mantenimiento_print_root";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      document.body.appendChild(tempContainer);

      const TemporaryRenderer: React.FC<{ id: number; containerId: string }> = ({ id, containerId }) => {
        const { detalle: det, loading: ld } = useMantenimientoDetalle(id);
        const detalleDataLocal = det?.mantenimiento ? det.mantenimiento : det ?? null;
        const equipoIdLocal = detalleDataLocal?.equipo?.id_equipo ? String(detalleDataLocal.equipo.id_equipo) : null;
        const { equipo, componentes } = useObtenerComputadora(equipoIdLocal);

        return (
          <div id={containerId}>
            {!ld && det ? (
              <div id={`mantenimiento-pdf-content-${id}`}>
                <MantenimientoDetalleView
                  detalleData={detalleDataLocal}
                  equipoDetalle={equipo}
                  componentesDetalle={componentes}
                  actividades={detalleDataLocal ? (detalleDataLocal.actividades ?? detalleDataLocal.actividades_mantenimiento ?? []) : []}
                />
              </div>
            ) : (
              <div id={`mantenimiento-pdf-placeholder-${id}`}>Cargando...</div>
            )}
          </div>
        );
      };

      const roots: Root[] = [];

      for (const id of selectedItems) {
        const host = document.createElement("div");
        const containerId = `tmp_mantenimiento_${id}`;
        host.id = containerId;
        tempContainer.appendChild(host);
        const root = createRoot(host);
        roots.push(root);
        root.render(React.createElement(TemporaryRenderer, { id, containerId }));

        const maxWait = 6000; // ms
        const interval = 200;
        let waited = 0;
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>((resolve) => {
          const timer = setInterval(() => {
            const node = document.getElementById(`mantenimiento-pdf-content-${id}`);
            if (node && node.childElementCount > 0) {
              clearInterval(timer);
              resolve();
            } else if (waited >= maxWait) {
              clearInterval(timer);
              resolve();
            }
            waited += interval;
          }, interval);
        });

        const node = document.getElementById(`mantenimiento-pdf-content-${id}`);
          if (node) {
          const waitUntilStable = async (root: HTMLElement, timeout = 8000) => {
            const start = Date.now();
            const interval = 200;
            return new Promise<void>((resolve) => {
              const t = setInterval(() => {
                const values = Array.from(root.querySelectorAll('.field .value')) as HTMLElement[];
                const populated = values.length === 0 ? true : values.every((el) => {
                  const txt = (el.textContent || '').trim();
                  if (!txt) return false;
                  if (/^\d+$/.test(txt)) return false;
                  return true;
                });
                if (populated || Date.now() - start >= timeout) {
                  clearInterval(t);
                  resolve();
                }
              }, interval);
            });
          };

          // eslint-disable-next-line no-await-in-loop
          await waitUntilStable(node, 8000);

          const wrapper = printWindow.document.createElement("div");
          wrapper.className = "mantenimiento-block page-break";
          wrapper.innerHTML = `<div id="mantenimiento-pdf-content">${node.innerHTML}</div>`;
          printWindow.document.body.appendChild(wrapper);
        } else {
          const raw = detalles.find((d) => (d?.mantenimiento ? d.mantenimiento.id_mantenimiento : d?.id_mantenimiento) === id) || {};
          const fallbackHtml = `<div class="mantenimiento-block page-break"><pre>${JSON.stringify(raw, null, 2)}</pre></div>`;
          const wrapper = printWindow.document.createElement("div");
          wrapper.innerHTML = fallbackHtml;
          printWindow.document.body.appendChild(wrapper);
        }
      }

      for (const r of roots) {
        try { r.unmount(); } catch (e) { /* ignore */ }
      }
      if (tempContainer.parentNode) tempContainer.parentNode.removeChild(tempContainer);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (err) {
      console.error(err);
      alert('Error al generar PDF de mantenimientos seleccionados');
    } finally {
      setExporting(false);
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
    setCurrentPage(newPage);
    setShouldFetch(true);
  };

  return (
    <div className="flex flex-col p-4">
      {exporting && <Loader />}
      <div className="mb-4">
        <div className="flex gap-2 items-center">
            <h1 className="text-2xl font-bold my-5">Mantenimientos</h1>
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={exportSelectedToPdf}
                  size="small"
                >
                  Descargar PDF seleccionados
                </Button>
              </div>
            )}
        </div>
        <div className="flex flex-wrap gap-4 my-6">
          

          <Autocomplete
            size="small"
            freeSolo
            options={series}
            getOptionLabel={(option) => (typeof option === "string" ? option : option?.nombre || "")}
            inputValue={inputSerie}
            onInputChange={(_, newInputValue) => setInputSerie(newInputValue)}
            onChange={(_, newValue) => {
              if (typeof newValue === "string") setInputSerie(newValue);
              else setInputSerie(newValue?.nombre || "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Serie" variant="outlined" />
            )}
            className="w-full md:w-1/4"
          />

          <TextField
            size="small"
            label="Inventario"
            variant="outlined"
            value={inputInventario}
            onChange={(e) => setInputInventario(e.target.value)}
            className="w-full md:w-1/4"
          />

          <div className="flex flex-col w-full md:w-1/5 md:flex-row gap-4 md:gap-2 lg:ml-2">
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              onChange={handleRowsPerPageChange}
              getOptionLabel={(option) => option.name}
              value={filas.find((option) => option.id === rowsPerPage)}
              renderInput={(params) => (
                <TextField {...params} label="Filas" variant="outlined" />
              )}
              className="w-full md:w-1/2"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full md:w-1/2"
              onClick={() => {
                setCurrentPage(1);
                setShouldFetch(true);
              }}
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
        ) : !mantenimientos || mantenimientos.length === 0 ? (
          <p className="text-center text-gray-500 my-5">No hay datos disponibles.</p>
        ) : (
          <>
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs uppercase bg-gray-50 text-gray-700">
                <tr>
                  <th scope="col" className="flex items-center gap-2 px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                      checked={selectedItems.length > 0 && selectedItems.length === (mantenimientos ? mantenimientos.length : 0)}
                      className="mr-2"
                    />
                    {selectedItems.length > 0 && (
                      <>
                        <Tooltip title="Eliminar seleccionados">
                          <span>
                            <Icon
                              icon="weui:delete-outlined"
                              width="20"
                              height="20"
                              onClick={() => {
                                setModalContent({
                                  title: "Eliminar mantenimientos",
                                  message: `¿Estás seguro de que deseas eliminar los ${selectedItems.length} mantenimientos seleccionados?`,
                                });
                                setConfirmAction(() => async () => {
                                  await deleteMantenimientos(selectedItems);
                                  return { success: true, message: "Mantenimientos eliminados" };
                                });
                                setOpenModal(true);
                              }}
                              className="cursor-pointer"
                            />
                          </span>
                        </Tooltip>
                      </>
                    )}
                  </th>
                  <th scope="col" className="px-4 py-3 w-48">
                    <button type="button" onClick={() => toggleSort("periferico")} className="flex items-center gap-1">
                      PERIFERICO
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
                  <th scope="col" className="px-4 py-3 w-32">
                    <button type="button" onClick={() => toggleSort("inventario")} className="flex items-center gap-1">
                      Inventario
                      {sortBy === "inventario" ? (
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
                      Serie
                      {sortBy === "serie" ? (
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
                    <button type="button" onClick={() => toggleSort("fecha")} className="flex items-center gap-1">
                      Fecha
                      {sortBy === "fecha" ? (
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
                  <th scope="col" className="px-4 py-3 w-56">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mantenimientos.map((m: MantenimientoItem) => (
                  <tr key={m.id_mantenimiento} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-4 py-2 w-12">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(Number(m.id_mantenimiento))}
                        onChange={() => handleCheckboxChange(Number(m.id_mantenimiento))}
                      />
                    </td>
                    <td className="px-4 py-2 w-48">{m.periferico ?? ""}</td>
                    <td className="px-4 py-2 w-32">{m.inventario ?? ""}</td>
                    <td className="px-4 py-2 w-32">{m.serie ?? ""}</td>
                    <td className="px-4 py-2 w-32">{formatServerDate(m.fecha)}</td>
                    <td className="px-4 py-3 flex items-center gap-2 truncate text-black w-56">
                      <Tooltip title="Detalle Mantenimiento">
                        <span>
                          <Icon
                            icon="pajamas:issue-type-maintenance"
                            width="22"
                            height="22"
                            className="cursor-pointer"
                            onClick={() => {
                              setDetalleId(m.id_mantenimiento);
                              setOpenDetalle(true);
                            }}
                          />
                        </span>
                      </Tooltip>
                            <Tooltip title="Eliminar">
                              <span>
                                <Icon
                                  icon="weui:delete-outlined"
                                  width="22"
                                  height="22"
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleOpenModal(
                                      String(m.id_mantenimiento),
                                      "Eliminar mantenimiento",
                                      `¿Estás seguro de que deseas eliminar el mantenimiento con ID ${m.id_mantenimiento}?`,
                                      async (idStr: string) => await deleteMantenimiento(idStr)
                                    )
                                  }
                                />
                              </span>
                            </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav className="flex flex-col md:flex-row justify-between items-center p-4" aria-label="Table navigation">
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
            {/* Detalle modal */}
            <Dialog
              open={openDetalle}
              onClose={() => {
                setOpenDetalle(false);
                setDetalleId(null);
              }}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Detalle de Mantenimiento</DialogTitle>
              <DialogContent>
                {loadingDetalle ? (
                  <Loader />
                ) : errorDetalle ? (
                  <Typography color="error">{String(errorDetalle)}</Typography>
                ) : detalle ? (
                  <div id="mantenimiento-pdf-content">
                    <MantenimientoDetalleView
                      detalleData={detalleData}
                      equipoDetalle={equipoDetalle}
                      componentesDetalle={componentesDetalle}
                      actividades={detalleActividades}
                    />
                  </div>
                ) : (
                  <Typography>No hay detalle disponible.</Typography>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    const content = document.getElementById("mantenimiento-pdf-content");
                    if (!content) return;
                    const printWindow = window.open("", "_blank", "width=800,height=600");
                    if (!printWindow) return;
                    printWindow.document.write(`<!doctype html><html><head><title>Mantenimiento ${detalleId}</title><style>
                      body{font-family: Arial, Helvetica, sans-serif; padding:20px; color:#111;}
                      h1,h2,h3{margin:0 0 8px 0;}
                      .section-title{font-weight:700; margin-top:12px; margin-bottom:8px;}
                      .field{display:flex; gap:12px; margin-bottom:10px; align-items:flex-start;}
                      .field .label{width:200px; font-weight:600; color:#444; font-size:12px;}
                      .field .value{flex:1; font-size:13px; color:#111;}
                      /* Force exact font-family/size/color inside the cloned content so MUI/Browser defaults don't differ */
                      #mantenimiento-pdf-content .field .value,
                      #mantenimiento-pdf-content .activity-value,
                      #mantenimiento-pdf-content .prewrap,
                      #mantenimiento-pdf-content .MuiFormControlLabel-label,
                      #mantenimiento-pdf-content .value,
                      #mantenimiento-pdf-content p,
                      #mantenimiento-pdf-content div,
                      #mantenimiento-pdf-content span {
                        font-family: Arial, Helvetica, sans-serif !important;
                        font-size: 13px !important;
                        color: #111 !important;
                        line-height: 1.2 !important;
                      }
                      .grid{display:flex; flex-wrap:wrap; gap:12px; margin-bottom:12px;}
                      .grid .col{width:48%;}
                      .activities{display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 12px 0;}
                      .activity{width:32%; display:flex; align-items:center; gap:8px; font-size:11px;}
                      /* Increase checkbox visual slightly and force consistent SVG size */
                      .activity input[type=checkbox]{transform:scale(1) !important; width:20px !important; height:20px !important; margin:0; vertical-align:middle;}
                      .MuiCheckbox-root, .MuiFormControlLabel-root .MuiCheckbox-root { display:inline-flex !important; width:22px !important; height:22px !important; padding:0 !important; }
                      .MuiCheckbox-root svg, .MuiSvgIcon-root, #mantenimiento-pdf-content svg { width:18px !important; height:18px !important; font-size:18px !important; transform:none !important; vertical-align:middle; }
                      /* Make activity label text match .field .value (13px, dark) */
                      .activity .MuiFormControlLabel-label, .activity .activity-value { font-size:13px !important; line-height:1.2 !important; color: #111 !important; flex:1 !important; }
                      /* Make disabled-looking checkboxes appear enabled in the print/PDF (override MUI disabled styles) */
                      .MuiCheckbox-root.Mui-disabled, .MuiCheckbox-root.Mui-disabled svg, input[type=checkbox]:disabled {
                        opacity: 1 !important;
                        color: #111 !important;
                        fill: #111 !important;
                      }
                      /* Ensure label text for disabled controls is visible */
                      .MuiFormControlLabel-root.Mui-disabled .MuiFormControlLabel-label, .MuiFormControlLabel-root.Mui-disabled {
                        color: #111 !important;
                        opacity: 1 !important;
                      }
                      /* Section titles: larger and bold */
                      .section-title { font-size:16px !important; font-weight:700 !important; color:#111 !important; margin-top:12px; margin-bottom:8px; }
                      /* Title inside cloned PDF: only the main mantenimiento title (do not affect other headings) */
                      #mantenimiento-pdf-content .mantenimiento-title {
                        text-align: center !important;
                        font-size: 22px !important;
                        font-weight: 700 !important;
                        margin: 8px 0 12px 0 !important;
                      }
                      /* Ensure hallazgos/recomendaciones blocks use same sizing and pre-wrap */
                      #mantenimiento-pdf-content .prewrap { font-family: Arial, Helvetica, sans-serif !important; font-size:13px !important; color:#111 !important; white-space:pre-wrap !important; }
                      /* Show checked mark clearly */
                      .MuiCheckbox-root.Mui-checked svg { color: #111 !important; fill: #111 !important; }
                      /* Slight gap between checkbox and label for readability */
                      .activity .MuiFormControlLabel-label { margin-left: 8px !important; }
                      table{width:100%; border-collapse:collapse; margin-top:8px;}
                      table th, table td{border:1px solid #ddd; padding:6px 8px; text-align:left; font-size:13px;}
                      .prewrap{white-space:pre-wrap;}
                      @media print{ .page-break { page-break-inside: avoid; } }
                    </style></head><body>`);
                    const clone = content.cloneNode(true) as HTMLElement;
                    printWindow.document.body.appendChild(clone);
                    printWindow.document.write(`</body></html>`);
                    printWindow.document.close();
                    printWindow.focus();
                    printWindow.print();
                  }}
                >
                  Descargar PDF
                </Button>
                <Button onClick={() => { setOpenDetalle(false); setDetalleId(null); }}>Cerrar</Button>
              </DialogActions>
            </Dialog>
            <ModalConfirmation
              open={openModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirm}
              title={modalContent.title}
              message={modalContent.message}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Mantenimiento;
