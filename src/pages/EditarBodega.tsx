import { Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EditarComputadoraBodega from "../features/Equipos/Bodega/EditarBodega/Pages/EditarComputadoraBodega";
import { Periferico } from "../types";
import { useObtenerComputadoraBodega } from "../features/Equipos/Bodega/EditarBodega/hooks/useObtenerComputadoraBodega";
import { useObtenerEquipoSimpleBodega } from '../features/Equipos/Bodega/EditarBodega/hooks/useObtenerEquipoSimpleBodega';
import EditarBodegaSimple from "../features/Equipos/Bodega/EditarBodega/Pages/EditarBodegaSimple";
import { useObtenerRedBodega } from "../features/Equipos/Bodega/EditarBodega/hooks/useObtenerEquipoRedBodega";
import EditarBodegaRed from "../features/Equipos/Bodega/EditarBodega/Pages/EditarBodegaRed";
import Loader from "./Loader";

const computadores: string[] = ["Laptop", "Computadora"];

export const EditarBodega = () => {
  const [perifericoId, setPerifericoId] = useState<string | null>(null);
  const location = useLocation();
  const {
    equipoId,
    perifericos,
    equipoName
  }: { equipoId: string; perifericos: Periferico[],equipoName:string } = location.state || {};
  
  if(equipoName==="Computadora" || equipoName==="Laptop"){
    const { equipoBodega, componentesBodega, loading, error } =
      useObtenerComputadoraBodega(equipoId);
    useEffect(() => {
      if (equipoBodega && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoBodega.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoBodega, perifericos]);

    if (loading) return <Loader/>;
    if (error) return <div>Error al cargar los datos del equipo</div>;
    
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Editar Bodega</h1>
  
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4">
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              value={
                perifericos.find((p) => p?.id_periferico === perifericoId) ?? null
              }
              onChange={(_, newValue) =>
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
  
          {perifericoId &&
          computadores.includes(
            perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre ??
              ""
          ) ? (
            equipoBodega && (
              <EditarComputadoraBodega
                equipo={equipoBodega}
                componentesBodega={componentesBodega}
              />
            )
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
             <h1>Editando bodega</h1>
            )
          )}
        </div>
      </div>
    );
  }else if(equipoName==="Switch" || equipoName==="AP"){
    const{ equipoRedBodega, loading, error} = useObtenerRedBodega(equipoId)
    useEffect(() => {
      if (equipoRedBodega && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoRedBodega.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoRedBodega, perifericos]);

    if (loading) return <Loader/>;
    if (error) return <div>Error al cargar los datos del equipo</div>;
    
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Editar Bodega</h1>
  
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4">
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              value={
                perifericos.find((p) => p?.id_periferico === perifericoId) ?? null
              }
              onChange={(_, newValue) =>
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

          {perifericoId && equipoRedBodega ? (
            <EditarBodegaRed 
              perifericoName={equipoName}
              equipoRedBodega={equipoRedBodega}
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
             <h1>Editando bodega</h1>
            )
          )}
        </div>
      </div>
    );
  }else{
    const{ equipoSimpleBodega, loading, error} = useObtenerEquipoSimpleBodega(equipoId)
    useEffect(() => {
      if (equipoSimpleBodega && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoSimpleBodega.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoSimpleBodega, perifericos]);

    if (loading) return <Loader/>;
    if (error) return <div>Error al cargar los datos del equipo</div>;
    
    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Editar Bodega</h1>
  
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4">
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              value={
                perifericos.find((p) => p?.id_periferico === perifericoId) ?? null
              }
              onChange={(_, newValue) =>
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
  
          {perifericoId && equipoSimpleBodega ? (
            <EditarBodegaSimple
              perifericoName={equipoName}
              equipoSimpleBodega={equipoSimpleBodega}
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
             <h1>Editando otro bodega</h1>
            )
          )}
        </div>
      </div>
    );
  }
}