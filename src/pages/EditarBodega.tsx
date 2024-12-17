import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {EditarComputadoraBodega} from "../features/Equipos/Bodega/EditarBodega/Pages/EditarComputadoraBodega";
import { Periferico } from "../types";
import { useObtenerComputadoraBodega } from "../features/Equipos/Bodega/EditarBodega/hooks/useObtenerComputadoraBodega";

const computadores: string[] = ["Laptop", "Computadora"];

export const EditarBodega = () => {
  const [perifericoId, setPerifericoId] = useState<string | null>(null);
  const location = useLocation();
  const {
    equipoId,
    perifericos,
  }: { equipoId: string; perifericos: Periferico[] } = location.state || {};

  const { equipoBodega, componentesBodega, loading, error } =
  useObtenerComputadoraBodega(equipoId);
  useEffect(() => {
    if (equipoBodega) {
      const selectedPeriferico = perifericos.find(
        (p) => p?.id_periferico === equipoBodega.id_periferico
      );
      setPerifericoId(selectedPeriferico?.id_periferico || null);
    }
  }, [equipoBodega, perifericos]);


  if (loading) return <CircularProgress />;
  console.log(error)
  if (error) return <div>Error al cargar los datos del equipo Bodega</div>;

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

        {perifericoId &&
        computadores.includes(
          perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre ??
            ""
        ) ? (
          <EditarComputadoraBodega
            equipoBodega={equipoBodega}
            componentesBodega={componentesBodega}
          />
        ) : (
          perifericoId && (
            /** 
            <EditarOtroActivo
              equipoBodega={equipoBodega}
              componentesBodega={componentesBodega}
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
};
