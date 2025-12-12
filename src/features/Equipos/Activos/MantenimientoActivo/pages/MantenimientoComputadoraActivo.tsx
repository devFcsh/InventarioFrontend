import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  Grid,
  Button,
  Autocomplete,
} from "@mui/material";
import { Icon } from "@iconify/react";
import React, { useState, useEffect, useCallback } from "react";
import Loader from "@pages/Loader";
import { useObtenerComputadora } from "../../EditarActivo/hooks/useComputadora";
import { Mantenimiento, ActividadMantenimientoResponse } from "../../../../../types/Activo/Mantenimiento";
import useEditarMantenimiento from "../hooks/useEditarMantenimiento";
import { useSnackbar } from "@context/SnackbarContext";
import { useAgregarActividadMantenimiento } from "../hooks/useAgregarActividadMantenimiento";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import useDiscos from "../../../../../hooks/useDiscos";
import useRam from "../../../../../hooks/useRam";
import useSistemasOperativos from "../../../../../hooks/useSistemasOperativos";
import useVersionesSO from "../../../../../hooks/useVersionesSO";
import useVersionesOffice from "../../../../../hooks/useVersionesOffice";
import useProcesadores from "../../../../../hooks/useProcesadores";
import useDominios from "../../../../../hooks/useDominios";
import useUsuariosPorUso from "../../../../../hooks/useUsuariosPorUso";
import { antivirus } from "../../../../../data";
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";

interface MantenimientosComputadoraActivoProps {
  open: boolean;
  onClose: () => void;
  id_equipo: string;
  mantenimientos: Mantenimiento[];
  onOpenAgregar?: () => void;
}

type SelectedOption = {
  id?: number | string;
  id_usuario?: number | string;
  id_marca?: number | string;
  id_modelo?: number | string;
  id_serie?: number | string;
  id_ram?: number | string;
  id_disco?: number | string;
  id_procesador?: number | string;
  id_versionoffice?: number | string;
  id_dominio?: number | string;
  id_edificio?: number | string;
  id_ubicacion?: number | string;
  nombre?: string;
  capacidad?: string | number;
  tipo?: string;
};

export const MantenimientosComputadoraActivo: React.FC<MantenimientosComputadoraActivoProps> = ({
  open,
  onClose,
  id_equipo,
  mantenimientos,
  onOpenAgregar,
}) => {
  const { equipo, componentes, loading: loadingEquipo, error: errorEquipo } =
    useObtenerComputadora(open && id_equipo ? id_equipo : null);

  

  const dateToInputLocal = (d?: Date | null) => {
    if (!d) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const serverDateStringToInput = useCallback((s?: string | null) => {
    if (!s) return "";
    const pad = (n: number) => String(n).padStart(2, "0");

    const hasTz = /[zZ]$/.test(s) || /[+-]\d{2}:?\d{2}$/.test(s);
    if (hasTz) {
      const d = new Date(s);
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
        d.getUTCHours()
      )}:${pad(d.getUTCMinutes())}`;
    }

    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (m) {
      const [, Y, M, D, hh, mm] = m;
      return `${Y}-${M}-${D}T${hh}:${mm}`;
    }

    return dateToInputLocal(new Date(s));
  }, []);

  const [index, setIndex] = useState(0);
  const [fechaLocal, setFechaLocal] = useState<string>("");
  const [tipoOptionLocal, setTipoOptionLocal] = useState<{ label: string; value: string } | null>(null);
  const [localActividades, setLocalActividades] = useState<ActividadMantenimientoResponse[]>([]);

  const [newActividadNombre, setNewActividadNombre] = useState<string>("");
  const [hallazgosLocal, setHallazgosLocal] = useState<string>("");
  const [recomendacionesLocal, setRecomendacionesLocal] = useState<string>("");
  const [autorLocal, setAutorLocal] = useState<string>("");
  const [editorLocal, setEditorLocal] = useState<string>("");
  const { editarMantenimiento, error: editError, message: editMessage } = useEditarMantenimiento();
  const { showMessage } = useSnackbar();
  const { agregarActividad, loading: addingActividad } = useAgregarActividadMantenimiento();

  const { marcas } = useMarcasPorPeriferico(equipo?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(equipo?.id_marca ?? "", equipo?.id_periferico ?? "");
  const { series } = useSeriesPorModelo(equipo?.id_periferico ?? "", equipo?.id_marca ?? "", equipo?.id_modelo ?? "");
  const { discos } = useDiscos();
  const { procesadores } = useProcesadores();
  const { ram } = useRam();
  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO((equipo?.id_sistemaoperativo ?? "") as string);
  const { versionesOffice } = useVersionesOffice();
  const { dominios } = useDominios();
  const { usuarios } = useUsuariosPorUso(equipo?.id_uso ?? "");

  const [selectedUsuario, setSelectedUsuario] = useState<SelectedOption | null>(null);
  const [selectedInventarioMarca, setSelectedInventarioMarca] = useState<SelectedOption | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] = useState<SelectedOption | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] = useState<SelectedOption | null>(null);
  const [selectedSO, setSelectedSO] = useState<SelectedOption | null>(null);
  const [selectedVersionSO, setSelectedVersionSO] = useState<SelectedOption | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<SelectedOption | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<SelectedOption | null>(null);
  const [selectedProcesador, setSelectedProcesador] = useState<SelectedOption | null>(null);
  const [selectedVersionOffice, setSelectedVersionOffice] = useState<SelectedOption | null>(null);
  const [selectedDominio, setSelectedDominio] = useState<SelectedOption | null>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<SelectedOption | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<SelectedOption | null>(null);

  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(String(selectedEdificio?.id_edificio ?? ""));

  useEffect(() => {
    setIndex(0);
  }, [open, mantenimientos.length]);

  useEffect(() => {
    const m = mantenimientos[index];
    if (!m) return;
    setLocalActividades((m.actividades || []).map((a) => ({ ...a })));
    if (m.fecha) {
      try {
        const parsed = serverDateStringToInput(m.fecha);
        setFechaLocal(parsed);
      } catch (e) {
        setFechaLocal("");
      }
      setHallazgosLocal(m.hallazgos || "");
      setRecomendacionesLocal(m.recomendaciones || "");
      setAutorLocal(m.autor || "");
      setEditorLocal(m.editor || "");
    } else {
      setFechaLocal("");
      setHallazgosLocal("");
      setRecomendacionesLocal("");
      setAutorLocal("");
      setEditorLocal("");
    }
  }, [index, mantenimientos, serverDateStringToInput]);

  useEffect(() => {
    if (equipo && usuarios.length > 0) {
  setSelectedUsuario(usuarios.find((u) => u?.id_usuario === equipo.id_usuario) || null);
    }
  }, [equipo, usuarios]);

  useEffect(() => {
    if (equipo && marcas.length > 0) {
      setSelectedInventarioMarca(marcas.find((marca) => marca?.id_marca === equipo.id_marca) || null);
    }
  }, [equipo, marcas]);

  useEffect(() => {
    if (equipo && modelos.length > 0) {
  setSelectedInventarioModelo(modelos.find((modelo) => modelo?.id_modelo === equipo.id_modelo) || null);
    }
  }, [equipo, modelos]);

  useEffect(() => {
    if (equipo && series.length > 0) {
  setSelectedInventarioSerie(series.find((serie) => serie?.id_serie === equipo.id_serie) || null);
    }
  }, [equipo, series]);

  useEffect(() => {
    if (equipo && sistemasOperativos.length > 0) {
  setSelectedSO(sistemasOperativos.find((so) => so?.id_sistemaoperativo === equipo.id_sistemaoperativo) || null);
    }
  }, [equipo, sistemasOperativos]);

  useEffect(() => {
    if (equipo && versionesSO.length > 0) {
  setSelectedVersionSO(versionesSO.find((version) => version?.id_versionso === equipo.id_versionso) || null);
    }
  }, [equipo, versionesSO]);

  useEffect(() => {
    if (equipo && ram.length > 0) {
  setSelectedRAM(ram.find((r) => r?.id_ram === equipo.id_ram) || null);
    }
  }, [equipo, ram]);

  useEffect(() => {
    if (equipo && discos.length > 0) {
  setSelectedDisco(discos.find((d) => d?.id_disco === equipo.id_disco) || null);
    }
  }, [equipo, discos]);

  useEffect(() => {
    if (equipo && procesadores.length > 0) {
  setSelectedProcesador(procesadores.find((p) => p?.id_procesador === equipo.id_procesador) || null);
    }
  }, [equipo, procesadores]);

  useEffect(() => {
    if (equipo && versionesOffice.length > 0) {
  setSelectedVersionOffice(versionesOffice.find((v) => v?.id_versionoffice === equipo.id_versionoffice) || null);
    }
  }, [equipo, versionesOffice]);

  useEffect(() => {
    if (equipo && dominios.length > 0) {
  setSelectedDominio(dominios.find((d) => d?.id_dominio === equipo.id_dominio) || null);
    }
  }, [equipo, dominios]);

  useEffect(() => {
    if (equipo && edificios.length > 0) {
      setSelectedEdificio(edificios.find((ed) => ed?.id_edificio === equipo.id_edificio) || null);
    }
  }, [equipo, edificios]);

  useEffect(() => {
    if (equipo && ubicaciones.length > 0) {
      setSelectedUbicacion(ubicaciones.find((u) => u?.id_ubicacion === equipo.id_ubicacion) || null);
    }
  }, [equipo, ubicaciones]);

  useEffect(() => {
    const m = mantenimientos[index];
    if (!m) {
      setFechaLocal("");
      setTipoOptionLocal(null);
      return;
    }
    setFechaLocal(serverDateStringToInput(m.fecha));
    setHallazgosLocal(m.hallazgos || "");
    setAutorLocal(m.autor || "");
    setEditorLocal(m.editor || "");
    setRecomendacionesLocal(m.recomendaciones || "");
    const tipoVal = (m.tipo || "").toString().toLowerCase();
    if (tipoVal === "preventivo") setTipoOptionLocal({ label: "Preventivo", value: "preventivo" });
    else if (tipoVal === "correctivo") setTipoOptionLocal({ label: "Correctivo", value: "correctivo" });
    else setTipoOptionLocal(null);
  }, [open, index, mantenimientos, serverDateStringToInput]);

  if (!open) return null;

  if (loadingEquipo) {
    return (
          <Loader />

    );
  }

  if (!loadingEquipo && (errorEquipo || !equipo)) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>
            Error al cargar los datos del equipo o mantenimientos
            <br />
            {errorEquipo && <span>Equipo: {JSON.stringify(errorEquipo)}</span>}
            {!equipo && <span>Equipo: {JSON.stringify(equipo)}</span>}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!mantenimientos.length) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography align="center" variant="h6">
            Mantenimientos para el equipo {equipo?.inventario || ""}
          </Typography>
          <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <Icon icon="ic:round-close" width={24} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>No hay mantenimientos registrados para este equipo.</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const handlePrev = () =>
    setIndex((prev) =>
      prev === 0 ? mantenimientos.length - 1 : prev - 1
    );
  const handleNext = () =>
    setIndex((prev) =>
      prev === mantenimientos.length - 1 ? 0 : prev + 1
    );

  const mantenimiento = mantenimientos[index];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography align="center" variant="h6" sx={{ flex: 1 }}>
          Mantenimientos para el equipo {equipo?.inventario || ""}
        </Typography>
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <Icon icon="ic:round-close" width={24} />
        </IconButton>
      </DialogTitle>
  <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box></Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                onClick={handlePrev}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 30,
                  height: 30
                }}
              >
                <Icon icon="ic:round-chevron-left" width={30} />
              </IconButton>
              <Typography sx={{ 
                mx: 1,
                fontSize: '0.95rem',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {mantenimientos.length > 0 ? `${index + 1} / ${mantenimientos.length}` : ""}
              </Typography>
              <IconButton 
                onClick={handleNext}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 30,
                  height: 30
                }}
              >
                <Icon icon="ic:round-chevron-right" width={30} />
              </IconButton>
            </Box>

            {onOpenAgregar && (
              <Button variant="contained" onClick={onOpenAgregar}>
                Agregar mantenimiento
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Fecha del Mantenimiento"
              type="datetime-local"
              value={fechaLocal}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const now = new Date();
                if (selectedDate <= now) {
                  setFechaLocal(e.target.value);
                } else {
                  showMessage("No puede seleccionar una fecha futura", "warning");
                }
              }}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().slice(0, 16)
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Datos generales
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Área/Bloque"
              value={`${selectedEdificio?.nombre ?? equipo?.id_edificio ?? ""} / ${selectedUbicacion?.nombre ?? equipo?.id_ubicacion ?? ""}`}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Marca / Modelo"
              value={`${selectedInventarioMarca?.nombre ?? equipo?.id_marca ?? ""} / ${selectedInventarioModelo?.nombre ?? equipo?.id_modelo ?? ""}`}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Número de Serie"
              value={selectedInventarioSerie?.nombre ?? equipo?.id_serie ?? ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Inventario"
              value={equipo?.inventario || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Nombre del Equipo/Dominio"
              value={equipo?.nombre_equipo || selectedDominio?.nombre || equipo?.id_dominio || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Usuarios que tiene el Equipo"
              value={selectedUsuario?.nombre ?? equipo?.id_usuario ?? ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ip/Mask/Gw"
              value={equipo?.direccion_ip || ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ram"
              value={selectedRAM ? `${selectedRAM.capacidad} - ${selectedRAM.tipo}` : equipo?.id_ram ?? ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Procesador/Generación"
              value={selectedProcesador?.nombre ?? equipo?.id_procesador ?? ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Disco Duro/Capacidad"
              value={selectedDisco?.capacidad ?? equipo?.id_disco ?? ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Sistema Operativo/Versión"
              value={`${selectedSO?.nombre ?? equipo?.id_sistemaoperativo ?? ""}${selectedVersionSO?.nombre ? ` / ${selectedVersionSO?.nombre}` : ""}`}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Versión de Office"
              value={selectedVersionOffice?.nombre ?? equipo?.id_versionoffice ?? ""}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Versión Antivirus/Activado"
              value={(antivirus.find((a) => Number(a.id_antivirus) === Number(equipo?.id_antivirus))?.nombre) ?? String(equipo?.id_antivirus ?? "")}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Creado por:"
              value={autorLocal}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Editado por:"
              value={editorLocal}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Tipo de mantenimiento
        </Typography>
        <Box mb={2}>
          <Autocomplete
            size="small"
            options={[{ label: "Correctivo", value: "correctivo" }, { label: "Preventivo", value: "preventivo" }]}
            getOptionLabel={(opt) => opt.label}
            value={tipoOptionLocal ?? undefined}
            disabled
            disableClearable
            renderInput={(params) => <TextField {...params} label="Tipo de mantenimiento" fullWidth />}
          />
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Actividades realizadas
        </Typography>
        {tipoOptionLocal ? (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
            <TextField
              size="small"
              label="Nueva actividad"
              value={newActividadNombre}
              onChange={(e) => setNewActividadNombre(e.target.value)}
              inputProps={{ maxLength: 100 }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={async () => {
                const tipoToSend = tipoOptionLocal?.value;
                if (!tipoToSend) {
                  showMessage("Seleccione el tipo de mantenimiento", "warning");
                  return;
                }
                const nombreTrim = newActividadNombre ? newActividadNombre.trim() : "";
                if (!nombreTrim) {
                  showMessage("Ingrese el nombre de la actividad", "warning");
                  return;
                }
                if (nombreTrim.length > 100) {
                  showMessage("La actividad no puede exceder 100 caracteres", "warning");
                  return;
                }

                const payload = { nombre: nombreTrim, tipo: tipoToSend, id_periferico: Number(equipo?.id_periferico) };
                const res = await agregarActividad(payload);
                if (res.ok) {
                  showMessage(res.message || "Actividad agregada", "success");
                  const act = res.actividad
                    ? ({
                        id_actividad_mantenimiento: res.actividad.id_actividad_mantenimiento ? Number(res.actividad.id_actividad_mantenimiento) : undefined,
                        id_actividad_periferico_tipo: res.actividad.id_actividad_periferico_tipo ? Number(res.actividad.id_actividad_periferico_tipo) : undefined,
                        actividad: res.actividad.actividad || res.actividad.nombre || payload.nombre,
                        tipo_mantenimiento: res.actividad.tipo_mantenimiento || tipoToSend,
                        realizada: false,
                      } as unknown as ActividadMantenimientoResponse)
                    : ({
                        id_actividad_mantenimiento: undefined,
                        id_actividad_periferico_tipo: undefined,
                        actividad: payload.nombre,
                        tipo_mantenimiento: tipoToSend,
                        realizada: false,
                      } as unknown as ActividadMantenimientoResponse);

                  setLocalActividades((prev) => [act, ...prev]);
                  setNewActividadNombre("");
                } else {
                  showMessage(res.error || "Error al agregar actividad", "error");
                }
              }}
              disabled={addingActividad}
            >
              {addingActividad ? "Agregando..." : "Agregar actividad"}
            </Button>
          </Box>
        ) : null}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={1}>
            {(localActividades.length ? localActividades : mantenimiento.actividades)
              ?.filter((a) => {
                const maintTipo = (mantenimiento.tipo || "").toString().toLowerCase();
                const actTipo = (a.tipo_mantenimiento || "").toString().toLowerCase();
                return maintTipo ? actTipo === maintTipo : true;
              })
              .map((actividad: ActividadMantenimientoResponse, idx: number) => {
                const key = actividad.id_actividad_mantenimiento ?? actividad.id_actividad_periferico_tipo ?? idx;
                const checked = !!actividad.realizada;
                return (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(e) => {
                            setLocalActividades((prev) =>
                              (prev.length ? prev : (mantenimiento.actividades || [])).map((a) => {
                                const aKey = a.id_actividad_mantenimiento ?? a.id_actividad_periferico_tipo ?? 0;
                                if (aKey === key) return { ...a, realizada: e.target.checked };
                                return a;
                              })
                            );
                          }}
                        />
                      }
                      label={actividad.actividad ?? ""}
                    />
                  </Grid>
                );
              })}
          </Grid>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Hallazgos
        </Typography>
        <TextField
          value={hallazgosLocal}
          onChange={(e) => setHallazgosLocal(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          inputProps={{ maxLength: 200 }}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Recomendaciones
        </Typography>
        <TextField
          value={recomendacionesLocal}
          onChange={(e) => setRecomendacionesLocal(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          inputProps={{ maxLength: 200 }}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Componentes
        </Typography>
        <Box className="overflow-x-auto w-full flex justify-center">
          <table className="min-w-[600px] border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border">Periférico</th>
                <th className="py-2 px-4 border">Marca</th>
                <th className="py-2 px-4 border">Modelo</th>
                <th className="py-2 px-4 border">Serie</th>
                <th className="py-2 px-4 border">Inventario</th>
              </tr>
            </thead>
            <tbody>
              {componentes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 px-4 text-gray-500">
                    No hay componentes disponibles.
                  </td>
                </tr>
              ) : (
                componentes.map((comp, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-4 border">{comp.periferico?.nombre}</td>
                    <td className="py-2 px-4 border">{comp.marca?.nombre}</td>
                    <td className="py-2 px-4 border">{comp.modelo?.nombre}</td>
                    <td className="py-2 px-4 border">
                        {typeof comp.serie === "object" &&
                        comp.serie !== null &&
                        "nombre" in comp.serie
                          ? (comp.serie as { nombre: string }).nombre
                          : comp.serie}
                      </td>
                    <td className="py-2 px-4 border">{comp.inventario}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
        <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const actividadesPayload = (localActividades.length ? localActividades : mantenimiento.actividades || []).map((a) => {
              if (a.id_actividad_periferico_tipo) return { id_actividad_periferico_tipo: a.id_actividad_periferico_tipo, realizada: !!a.realizada };
              return { id_actividad_mantenimiento: a.id_actividad_mantenimiento, realizada: !!a.realizada };
            });

            const payload = {
              tipo: (mantenimiento.tipo || "").toString().toLowerCase(),
              hallazgos: hallazgosLocal || undefined,
              recomendaciones: recomendacionesLocal || undefined,
              fecha: fechaLocal ? fechaLocal.replace("T", " ") + ":00" : undefined,
              actividades: actividadesPayload,
            };

            const ok = await editarMantenimiento(mantenimiento.id_mantenimiento ?? 0, payload);
            if (ok) {
              showMessage(editMessage ?? "Mantenimiento actualizado correctamente", "success");
              onClose();
            } else {
              showMessage(editError ?? "Error al actualizar el mantenimiento", "error");
            }
          }}
        >
          Editar mantenimiento
        </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};