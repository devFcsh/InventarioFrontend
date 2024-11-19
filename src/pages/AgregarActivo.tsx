import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import AgregarComputadoraActivo from "../features/Equipos/Activos/AgregarActivo/pages/AgregarComputadoraActivo";
import { useLocation } from "react-router-dom";
import { Periferico, Uso, Usuario } from "../types";
import useUsos from "../hooks/useUsos";
import useUsuariosPorUso from "../hooks/useUsuariosPorUso";

const computadores: string[] = ["Laptop", "Computadora"];

const AgregarActivo = () => {
  const [perifericoId, setPerifericoId] = useState<string | null>(null);
  const [selectedUsoId, setSelectedUsoId] = useState<string | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string | null>(
    null
  );

  const location = useLocation();

  const { perifericos }: { perifericos: Periferico[] } = location.state || {};
  const { usos, loading: loadingUsos, error: errorUsos } = useUsos();
  const {
    usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
  } = useUsuariosPorUso(selectedUsoId || "");

  const selectedPeriferico = perifericos.find(
    (p) => p?.id_periferico === perifericoId
  );

  const handleUsoChange = (event: any, newValue: Uso | null) => {
    if (newValue) {
      setSelectedUsoId(newValue.id_uso);
    } else {
      setSelectedUsoId(null);
      setSelectedUsuarioId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10">Registro de Activo</h1>

      <div className="flex flex-col gap-4 mb-14">
        <div className="mb-4">
          <Autocomplete
            size="small"
            disablePortal
            options={perifericos}
            value={selectedPeriferico ?? null}
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
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Autocomplete
            size="small"
            disablePortal
            options={usos}
            loading={loadingUsos}
            value={
              selectedUsoId
                ? usos.find((u) => u?.id_uso === selectedUsoId) ?? null
                : null
            }
            onChange={handleUsoChange}
            getOptionLabel={(option) => option?.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Uso"
                variant="outlined"
                error={!!errorUsos}
                helperText={errorUsos ? "Error al cargar los usos" : ""}
                fullWidth
              />
            )}
          />

          <Autocomplete
            size="small"
            disablePortal
            options={usuarios}
            loading={loadingUsuarios}
            value={
              usuarios.find((u) => u?.id_usuario === selectedUsuarioId) ?? null
            }
            onChange={(event, newValue: Usuario | null) =>
              setSelectedUsuarioId(newValue ? newValue.id_usuario : null)
            }
            getOptionLabel={(option) => option?.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Usuario"
                variant="outlined"
                error={!!errorUsuarios}
                helperText={errorUsuarios ? "Error al cargar los usuarios" : ""}
                fullWidth
              />
            )}
          />
        </div>

        {perifericoId &&
        computadores.includes(selectedPeriferico?.nombre ?? "") ? (
          <AgregarComputadoraActivo
            periferico={perifericoId}
            idUso={selectedUsoId}
            idUsuario={selectedUsuarioId}
          />
        ) : (
          perifericoId && (
            /** 
            <AgregarOtroActivo
              periferico={perifericoId}
              idUso={selectedUsoId}
              idUsuario={selectedUsuarioId}
            />
            */
           <h1>Agregando otro activo</h1>
          )
        )}
      </div>
    </div>
  );
};

export default AgregarActivo;
