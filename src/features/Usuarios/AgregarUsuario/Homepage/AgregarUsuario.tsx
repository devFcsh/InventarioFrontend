import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { Uso, Usuario } from "../../../../types";
import useUsos from "@hooks/useUsos";

const AgregarUsuario = () => {
  const [selectedUsoId, setSelectedUsoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);


  const { usos, loading: loadingUsos, error: errorUsos } = useUsos();
  

  const handleUsoChange = (event: any, newValue: Uso | null) => {
    if (newValue) {
      setSelectedUsoId(newValue.id_uso);
    } else {
      setSelectedUsoId(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10">Registro de Usuario</h1>

      <div className="flex flex-col gap-4 mb-14">

      
        <div className="grid grid-cols-2 gap-4 mb-4">
        <TextField
            label="Nombre del Usuario"
            placeholder="Nombre del Usuario"
            variant="outlined"
            fullWidth
            size="small"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={usos}
            loading={loadingUsos}
            value={
              selectedUsoId
                ? usos.find((u) => u.id_uso === selectedUsoId) ?? null
                : null
            }
            onChange={handleUsoChange}
            getOptionLabel={(option) => option.nombre}
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

        </div>

        
      </div>
    </div>
  );
};

export default AgregarUsuario;
