import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EditarComputadoraActivo from "../features/Equipos/Activos/EditarActivo/pages/EditarComputadoraActivo";
import { Periferico, Uso, Usuario } from "../types";
import useUsos from "../hooks/useUsos";
import useUsuariosPorUso from "../hooks/useUsuariosPorUso";
import { useObtenerComputadora } from "../features/Equipos/Activos/EditarActivo/hooks/useComputadora";
import { useObtenerComputadoraActivo } from "../features/Equipos/Activos/EditarActivo/hooks/useObtenerEquipoSimpleActivo";
import EditarActivoSimple from "../features/Equipos/Activos/EditarActivo/pages/EditarActivoSimple";

const computadores: string[] = ["Laptop", "Computadora"];

const EditarActivo = () => {
  const [perifericoId, setPerifericoId] = useState<string | null>(null);
  const [selectedUso, setSelectedUso] = useState<Uso | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const location = useLocation();
  const {
    equipoId,
    perifericos,
    equipoName
  }: { equipoId: string; perifericos: Periferico[],equipoName:string } = location.state || {};
  const { usos } = useUsos();
  const { usuarios } = useUsuariosPorUso(selectedUso?.id_uso || "");
  if(equipoName==="Computadora" || equipoName==="Laptop"){
    const { equipo, componentes, loading, error } =
      useObtenerComputadora(equipoId);
    useEffect(() => {
      if (equipo) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipo.id_periferico
        );
        const selectedUso = usos.find((uso) => uso?.id_uso === equipo.id_uso);
        setPerifericoId(selectedPeriferico?.id_periferico || null);
        setSelectedUso(selectedUso || null);
      }
    }, [equipo, perifericos, usos]);
    useEffect(() => {
      if (selectedUso && usuarios.length > 0) {
        const selectedUsuario = usuarios.find(
          (usuario) => usuario?.id_usuario === equipo?.id_usuario
        );
        setSelectedUsuario(selectedUsuario || null);
      }
    }, [selectedUso, usuarios, equipo]);

    if (loading) return <CircularProgress />;
    if (error) return <div>Error al cargar los datos del equipo</div>;
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Editar Activo</h1>
  
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4">
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              value={
                perifericos.find((p) => p?.id_periferico === perifericoId) ?? null
              }
              onChange={(event, newValue) =>
                setPerifericoId(newValue ? newValue.id_periferico : null)
              }
              getOptionLabel={(option) => option?.nombre || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periférico"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled
            />
          </div>
  
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Autocomplete
              size="small"
              disablePortal
              options={usos}
              value={selectedUso}
              onChange={(event, newValue) => {
                setSelectedUso(newValue);
                setSelectedUsuario(null);
              }}
              getOptionLabel={(option) =>option ? option.nombre : ""}
              renderInput={(params) => (
                <TextField {...params} label="Uso" variant="outlined" fullWidth />
              )}
            />
  
            <Autocomplete
              size="small"
              disablePortal
              options={usuarios}
              value={selectedUsuario}
              onChange={(event, newValue) => setSelectedUsuario(newValue)}
              getOptionLabel={(option) =>option ? option.nombre : ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Usuario"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled={!selectedUso}
            />
          </div>
  
          {perifericoId &&
          computadores.includes(
            perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre ??
              ""
          ) ? (
            <EditarComputadoraActivo
              equipo={equipo}
              componentes={componentes}
              idUsuario={selectedUsuario?.id_usuario || null}
            />
          ) : (
            perifericoId && (
              /** 
              <EditarOtroActivo
                equipo={equipo}
                componentes={componentes}
                idUso={selectedUso?.id_uso || null}
                idUsuario={selectedUsuario?.id_usuario || null}
              />
              */
             <h1>Editando otro activo</h1>
            )
          )}
        </div>
      </div>
    );
  }else{
    const{ equipoSimpleActivo, loadingActivoSimple, errorActivoSimple} = useObtenerComputadoraActivo(equipoId)
    useEffect(() => {
      if (equipoSimpleActivo) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoSimpleActivo.id_periferico
        );
        const selectedUso = usos.find((uso) => uso?.id_uso === equipoSimpleActivo.id_uso);
        setPerifericoId(selectedPeriferico?.id_periferico || null);
        setSelectedUso(selectedUso || null);
      }
    }, [equipoSimpleActivo, perifericos, usos]);
    useEffect(() => {
      if (selectedUso && usuarios.length > 0) {
        const selectedUsuario = usuarios.find(
          (usuario) => usuario?.id_usuario === equipoSimpleActivo?.id_usuario
        );
        setSelectedUsuario(selectedUsuario || null);
      }
    }, [selectedUso, usuarios, equipoSimpleActivo]);
    if (loadingActivoSimple) return <CircularProgress />;
    if (errorActivoSimple) return <div>Error al cargar los datos del equipo</div>;
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Editar Activo</h1>
  
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4">
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              value={
                perifericos.find((p) => p?.id_periferico === perifericoId) ?? null
              }
              onChange={(event, newValue) =>
                setPerifericoId(newValue ? newValue.id_periferico : null)
              }
              getOptionLabel={(option) => option?.nombre || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periférico"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled
            />
          </div>
  
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Autocomplete
              size="small"
              disablePortal
              options={usos}
              value={selectedUso}
              onChange={(event, newValue) => {
                setSelectedUso(newValue);
                setSelectedUsuario(null);
              }}
              getOptionLabel={(option) =>option ? option.nombre : ""}
              renderInput={(params) => (
                <TextField {...params} label="Uso" variant="outlined" fullWidth />
              )}
            />
  
            <Autocomplete
              size="small"
              disablePortal
              options={usuarios}
              value={selectedUsuario}
              onChange={(event, newValue) => setSelectedUsuario(newValue)}
              getOptionLabel={(option) =>option ? option.nombre : ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Usuario"
                  variant="outlined"
                  fullWidth
                />
              )}
              disabled={!selectedUso}
            />
          </div>
  
          {perifericoId ? (
            <EditarActivoSimple
            equipoSimpleActivo={equipoSimpleActivo}
              idUsuario={selectedUsuario?.id_usuario || null}
            />
          ) : (
            perifericoId && (
              /** 
              <EditarOtroActivo
                equipo={equipo}
                componentes={componentes}
                idUso={selectedUso?.id_uso || null}
                idUsuario={selectedUsuario?.id_usuario || null}
              />
              */
             <h1>Editando otro activo</h1>
            )
          )}
        </div>
      </div>
    );
  }
}






export default EditarActivo;
