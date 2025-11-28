import React, { useEffect, useState } from "react";
import { Box, Grid, Divider, Typography, Checkbox, FormControlLabel } from "@mui/material";
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
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";
import { antivirus } from "../../../../../data";

type Actividad = { actividad?: string; nombre?: string; realizada?: boolean };

type Usuario = { id_usuario?: number | string; nombre?: string };
type Marca = { id_marca?: number | string; nombre?: string };
type Modelo = { id_modelo?: number | string; nombre?: string };
type SerieType = { id_serie?: number | string; nombre?: string };
type RamType = { id_ram?: number | string; capacidad?: string | number; tipo?: string };
type DiscoType = { id_disco?: number | string; capacidad?: string | number };
type ProcesadorType = { id_procesador?: number | string; nombre?: string };
type VersionSOType = { id_versionso?: number | string; nombre?: string };
type SistemaOperativoType = { id_sistemaoperativo?: number | string; nombre?: string };
type VersionOfficeType = { id_versionoffice?: number | string; nombre?: string };
type DominioType = { id_dominio?: number | string; nombre?: string };
type EdificioType = { id_edificio?: number | string; nombre?: string };
type UbicacionType = { id_ubicacion?: number | string; nombre?: string };

type ComponenteType = {
  periferico?: { nombre?: string } | string | null;
  marca?: { nombre?: string } | string | null;
  modelo?: { nombre?: string } | string | null;
  serie?: { nombre?: string } | string | null;
  inventario?: string | null;
};

type EquipoDetalleType = {
  id_periferico?: number | string;
  id_marca?: number | string;
  id_modelo?: number | string;
  id_serie?: number | string;
  inventario?: string;
  nombre_equipo?: string;
  id_usuario?: number | string;
  direccion_ip?: string;
  id_ram?: number | string;
  id_procesador?: number | string;
  id_disco?: number | string;
  id_sistemaoperativo?: number | string;
  id_versionso?: number | string;
  id_versionoffice?: number | string;
  id_antivirus?: number | string;
  id_ubicacion?: number | string;
  id_edificio?: number | string;
  id_dominio?: number | string;
  id_uso?: number | string;
  ram_capacidad?: string | number;
  procesador_nombre?: string;
  disco_capacidad?: string | number;
  version_so?: string;
  version_office?: string;
  antivirus_nombre?: string;
};

type DetalleData = {
  equipo?: Partial<EquipoDetalleType>;
  actividades?: Actividad[];
  componentes?: ComponenteType[];
  hallazgos?: string;
  recomendaciones?: string;
  fecha?: string;
  id_mantenimiento?: number | string;
  inventario?: string;
  serie?: string;
  tipo?: string;
  tipo_mantenimiento?: string;
  periferico?: string | { nombre?: string };
};

type Props = {
  detalleData: DetalleData;
  equipoDetalle: EquipoDetalleType | null;
  componentesDetalle: ComponenteType[];
  actividades: Actividad[];
};

const MantenimientoDetalleView: React.FC<Props> = ({ detalleData, equipoDetalle, componentesDetalle, actividades }) => {
  const FieldDisplay: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <Box className="field">
      <Typography className="label" variant="caption" color="textSecondary" component="div">
        {label}
      </Typography>
      <Typography className="value" variant="body2" component="div">
        {value ?? ""}
      </Typography>
    </Box>
  );

  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [selectedInventarioMarca, setSelectedInventarioMarca] = useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] = useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] = useState<SerieType | null>(null);
  const [selectedSO, setSelectedSO] = useState<VersionSOType | null>(null);
  const [selectedVersionSO, setSelectedVersionSO] = useState<VersionSOType | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<RamType | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<DiscoType | null>(null);
  const [selectedProcesador, setSelectedProcesador] = useState<ProcesadorType | null>(null);
  const [selectedVersionOffice, setSelectedVersionOffice] = useState<VersionOfficeType | null>(null);
  const [selectedDominio, setSelectedDominio] = useState<DominioType | null>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<EdificioType | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<UbicacionType | null>(null);

  const { marcas } = useMarcasPorPeriferico(String(equipoDetalle?.id_periferico ?? detalleData?.equipo?.id_periferico ?? ""));
  const { modelos } = useModelosPorMarcaPeriferico(String(equipoDetalle?.id_marca ?? detalleData?.equipo?.id_marca ?? ""), String(equipoDetalle?.id_periferico ?? detalleData?.equipo?.id_periferico ?? ""));
  const { series } = useSeriesPorModelo(String(equipoDetalle?.id_periferico ?? detalleData?.equipo?.id_periferico ?? ""), String(equipoDetalle?.id_marca ?? detalleData?.equipo?.id_marca ?? ""), String(equipoDetalle?.id_modelo ?? detalleData?.equipo?.id_modelo ?? ""));
  const { discos } = useDiscos();
  const { procesadores } = useProcesadores();
  const { ram } = useRam();
  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO(String(equipoDetalle?.id_sistemaoperativo ?? detalleData?.equipo?.id_sistemaoperativo ?? ""));
  const { versionesOffice } = useVersionesOffice();
  const { dominios } = useDominios();
  const { usuarios } = useUsuariosPorUso(String(equipoDetalle?.id_uso ?? detalleData?.equipo?.id_uso ?? ""));
  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(String(selectedEdificio?.id_edificio ?? detalleData?.equipo?.id_edificio ?? ""));

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
        return str;
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

  useEffect(() => {
    if ((equipoDetalle || detalleData) && usuarios.length > 0) {
      const idu = equipoDetalle?.id_usuario ?? detalleData?.equipo?.id_usuario;
      setSelectedUsuario((usuarios as Usuario[]).find((u) => u?.id_usuario === idu) || null);
    }
  }, [equipoDetalle, detalleData, usuarios]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && marcas.length > 0) {
      const idm = equipoDetalle?.id_marca ?? detalleData?.equipo?.id_marca;
      setSelectedInventarioMarca((marcas as Marca[]).find((m) => m?.id_marca === idm) || null);
    }
  }, [equipoDetalle, detalleData, marcas]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && modelos.length > 0) {
      const idmo = equipoDetalle?.id_modelo ?? detalleData?.equipo?.id_modelo;
      setSelectedInventarioModelo((modelos as Modelo[]).find((mo) => mo?.id_modelo === idmo) || null);
    }
  }, [equipoDetalle, detalleData, modelos]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && series.length > 0) {
      const ids = equipoDetalle?.id_serie ?? detalleData?.equipo?.id_serie;
      setSelectedInventarioSerie((series as SerieType[]).find((s) => s?.id_serie === ids) || null);
    }
  }, [equipoDetalle, detalleData, series]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && sistemasOperativos.length > 0) {
      const iso = equipoDetalle?.id_sistemaoperativo ?? detalleData?.equipo?.id_sistemaoperativo;
      setSelectedSO((sistemasOperativos as SistemaOperativoType[]).find((so) => so?.id_sistemaoperativo === iso) || null);
    }
  }, [equipoDetalle, detalleData, sistemasOperativos]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && versionesSO.length > 0) {
      const iv = equipoDetalle?.id_versionso ?? detalleData?.equipo?.id_versionso;
      setSelectedVersionSO((versionesSO as VersionSOType[]).find((v) => v?.id_versionso === iv) || null);
    }
  }, [equipoDetalle, detalleData, versionesSO]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && ram.length > 0) {
      const ir = equipoDetalle?.id_ram ?? detalleData?.equipo?.id_ram;
      setSelectedRAM((ram as RamType[]).find((r) => r?.id_ram === ir) || null);
    }
  }, [equipoDetalle, detalleData, ram]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && discos.length > 0) {
      const idd = equipoDetalle?.id_disco ?? detalleData?.equipo?.id_disco;
      setSelectedDisco((discos as DiscoType[]).find((d) => d?.id_disco === idd) || null);
    }
  }, [equipoDetalle, detalleData, discos]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && procesadores.length > 0) {
      const ip = equipoDetalle?.id_procesador ?? detalleData?.equipo?.id_procesador;
      setSelectedProcesador((procesadores as ProcesadorType[]).find((p) => p?.id_procesador === ip) || null);
    }
  }, [equipoDetalle, detalleData, procesadores]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && versionesOffice.length > 0) {
      const io = equipoDetalle?.id_versionoffice ?? detalleData?.equipo?.id_versionoffice;
      setSelectedVersionOffice((versionesOffice as VersionOfficeType[]).find((v) => v?.id_versionoffice === io) || null);
    }
  }, [equipoDetalle, detalleData, versionesOffice]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && dominios.length > 0) {
      const idd = equipoDetalle?.id_dominio ?? detalleData?.equipo?.id_dominio;
      setSelectedDominio((dominios as DominioType[]).find((d) => d?.id_dominio === idd) || null);
    }
  }, [equipoDetalle, detalleData, dominios]);

  useEffect(() => {
    if ((equipoDetalle || detalleData) && edificios.length > 0) {
      const ide = equipoDetalle?.id_edificio ?? detalleData?.equipo?.id_edificio;
      setSelectedEdificio((edificios as EdificioType[]).find((ed) => ed?.id_edificio === ide) || null);
    }
  }, [equipoDetalle, detalleData, edificios]);

  useEffect(() => {
    const ide = String(selectedEdificio?.id_edificio ?? detalleData?.equipo?.id_edificio ?? "");
    if (ide) setSelectedUbicacion((ubicaciones as UbicacionType[]).find((u) => u?.id_ubicacion === (detalleData?.equipo?.id_ubicacion ?? equipoDetalle?.id_ubicacion)) || null);
  }, [equipoDetalle, detalleData, ubicaciones, selectedEdificio]);

  return (
    <div>
      <Box mb={2}>
        <Typography variant="h6" align="center" className="mantenimiento-title">
          Mantenimiento {detalleData?.tipo_mantenimiento ?? detalleData?.tipo ?? (detalleData?.id_mantenimiento ? `#${detalleData.id_mantenimiento}` : "")}
        </Typography>
      </Box>

      <Typography className="section-title" variant="subtitle1" fontWeight="bold" gutterBottom>
        Datos generales
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Área/Bloque" value={`${selectedEdificio?.nombre ?? detalleData?.equipo?.id_edificio ?? ''} / ${selectedUbicacion?.nombre ?? detalleData?.equipo?.id_ubicacion ?? ''}`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Marca / Modelo" value={`${selectedInventarioMarca?.nombre ?? detalleData?.equipo?.id_marca ?? ''} / ${selectedInventarioModelo?.nombre ?? detalleData?.equipo?.id_modelo ?? ''}`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Número de Serie" value={selectedInventarioSerie?.nombre ?? detalleData?.equipo?.id_serie ?? detalleData?.serie ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Inventario" value={equipoDetalle?.inventario ?? detalleData?.inventario ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Nombre del Equipo/Dominio" value={equipoDetalle?.nombre_equipo ?? detalleData?.equipo?.nombre_equipo ?? selectedDominio?.nombre ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Usuarios que tiene el Equipo" value={selectedUsuario?.nombre ?? detalleData?.equipo?.id_usuario ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Ip/Mask/Gw" value={equipoDetalle?.direccion_ip ?? detalleData?.equipo?.direccion_ip ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Ram" value={selectedRAM ? `${selectedRAM.capacidad ?? ''} - ${selectedRAM.tipo ?? ''}` : detalleData?.equipo?.id_ram ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Procesador/Generación" value={selectedProcesador?.nombre ?? detalleData?.equipo?.id_procesador ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Disco Duro/Capacidad" value={selectedDisco?.capacidad ?? detalleData?.equipo?.id_disco ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Sistema Operativo/Versión" value={`${selectedSO?.nombre ?? detalleData?.equipo?.id_sistemaoperativo ?? ''}${selectedVersionSO?.nombre ? ` / ${selectedVersionSO.nombre}` : ''}`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Versión de Office" value={selectedVersionOffice?.nombre ?? detalleData?.equipo?.id_versionoffice ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay
            label="Versión Antivirus/Activado"
            value={(antivirus.find((a) => Number(a.id_antivirus) === Number(equipoDetalle?.id_antivirus ?? detalleData?.equipo?.id_antivirus))?.nombre) ?? String(equipoDetalle?.id_antivirus ?? detalleData?.equipo?.id_antivirus ?? '')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Fecha del Mantenimiento" value={formatServerDate(detalleData?.fecha)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Creado por:" value={(detalleData as DetalleData & { autor?: string })?.autor ?? ''} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FieldDisplay label="Editado por:" value={(detalleData as DetalleData & { editor?: string })?.editor ?? 'No editado'} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography className="section-title" variant="subtitle1" fontWeight="bold" gutterBottom>
        Actividades
      </Typography>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {actividades.map((a, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <FormControlLabel
              control={<Checkbox size="small" checked={!!a.realizada} disabled />}
              label={
                <Typography component="span" className="activity-value" sx={{ fontSize: '13px', lineHeight: 1.2, color: '#111' }}>
                  {a.actividad ?? a.nombre ?? ""}
                </Typography>
              }
              sx={{ alignItems: "center" }}
            />
          </Grid>
        ))}
      </Grid>

      <Typography className="section-title" variant="subtitle1" fontWeight="bold" gutterBottom>
        Hallazgos
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{detalleData?.hallazgos ?? ""}</Typography>
      </Box>

      <Typography className="section-title" variant="subtitle1" fontWeight="bold" gutterBottom>
        Recomendaciones
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{detalleData?.recomendaciones ?? ""}</Typography>
      </Box>

      <Typography className="section-title" variant="subtitle1" fontWeight="bold" gutterBottom>
        Componentes
      </Typography>
      <Box className="overflow-x-auto w-full flex justify-center" sx={{ mb: 2 }}>
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
            {(componentesDetalle && componentesDetalle.length > 0 ? componentesDetalle : detalleData?.componentes || []).length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 px-4 text-gray-500">No hay componentes disponibles.</td>
              </tr>
            ) : (
              (componentesDetalle && componentesDetalle.length > 0 ? componentesDetalle : (detalleData?.componentes as ComponenteType[] || [])).map((comp: ComponenteType, idx: number) => (
                <tr key={idx}>
                  <td className="py-2 px-4 border">{(comp.periferico && typeof comp.periferico === 'object') ? comp.periferico.nombre ?? '' : (comp.periferico ?? '')}</td>
                  <td className="py-2 px-4 border">{(comp.marca && typeof comp.marca === 'object') ? comp.marca.nombre ?? '' : (comp.marca ?? '')}</td>
                  <td className="py-2 px-4 border">{(comp.modelo && typeof comp.modelo === 'object') ? comp.modelo.nombre ?? '' : (comp.modelo ?? '')}</td>
                  <td className="py-2 px-4 border">{(comp.serie && typeof comp.serie === 'object') ? comp.serie.nombre ?? '' : (comp.serie ?? '')}</td>
                  <td className="py-2 px-4 border">{comp.inventario ?? ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default MantenimientoDetalleView;
