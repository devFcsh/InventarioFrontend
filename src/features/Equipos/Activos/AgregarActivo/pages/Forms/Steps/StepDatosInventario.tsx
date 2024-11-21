import { TextField, Box, Autocomplete } from "@mui/material";
import {
  Marca,
  Modelo,
  Serie,
  Edificio,
  Aula,
  Usuario,
  Uso,
} from "../../../../../../../types";
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import useEdificios from "@hooks/useEdificios";
import useAulas from "@hooks/useAulas";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import useUsos from "@hooks/useUsos";
import { useFormDatosInventario } from "../hooks/useFormDatosInventario";

interface StepDatosInventarioProps {
  periferico: string;
  inventoryDataForm:any;
  handleInventoryChange: any;
}

export const StepDatosInventario = ({
  periferico,
  inventoryDataForm,
  handleInventoryChange,
}: StepDatosInventarioProps) => {
  const { usos, loading: loadingUsos, error: errorUsos } = useUsos();

  const {
    usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
  } = useUsuariosPorUso(inventoryDataForm.usoId || "");

  const { marcas } = useMarcasPorPeriferico(periferico);
  const { modelos } = useModelosPorMarcaPeriferico(
    inventoryDataForm.marca?.id_marca ?? "",
    periferico
  );
  const { series } = useSeriesPorModelo(
    periferico,
    inventoryDataForm.marca?.id_marca ?? "",
    inventoryDataForm.modelo?.id_modelo ?? ""
  );
  const { edificios } = useEdificios();
  const { aulas } = useAulas(inventoryDataForm.edificio?.id_edificio ?? "");

  return (
    <Box>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            size="small"
            disablePortal
            options={usos}
            loading={loadingUsos}
            value={
              inventoryDataForm.usoId
                ? usos.find((u) => u?.id_uso === inventoryDataForm.usoId) ?? null
                : null
            }
            onChange={(_, newValue: Uso | null) => {
              handleInventoryChange("uso", newValue);
            }}
            getOptionLabel={(option) => option ? option.nombre : ""}
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
              usuarios.find((u) => u?.id_usuario === inventoryDataForm.usuarioId) ?? null
            }
            onChange={(_, newValue: Usuario | null) => {
              handleInventoryChange("usuario", newValue);
            }}
            getOptionLabel={(option) => option ? option.nombre : ""}
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
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option: Marca) => option?.nombre || ""}
            onChange={(_, newValue: Marca | null) => {
              handleInventoryChange("marca", newValue);
            }}
            value={inventoryDataForm.marca}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Marca"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <Autocomplete
            size="small"
            disablePortal
            options={modelos}
            getOptionLabel={(option: Modelo) => option?.nombre || ""}
            onChange={(_, newValue: Modelo | null) => {
              handleInventoryChange("modelo", newValue);
            }}
            value={inventoryDataForm.modelo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Modelo"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={!inventoryDataForm.marca}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={series}
            getOptionLabel={(option: Serie) => option?.nombre || ""}
            onChange={(_, newValue: Serie | null) => {
              handleInventoryChange("serie", newValue);
            }}
            value={inventoryDataForm.serie}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serie"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={!inventoryDataForm.modelo}
          />
          <TextField
            label="Inventario"
            placeholder="Inventario"
            variant="outlined"
            fullWidth
            size="small"
            value={inventoryDataForm.inventario}
            onChange={(e) => {
              handleInventoryChange("inventario", e.target.value);
            }}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={edificios}
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={inventoryDataForm.edificio}
            onChange={(_, newValue: Edificio | null) => {
              handleInventoryChange("edificio", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Edificio"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={aulas}
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={inventoryDataForm.aula}
            onChange={(_, newValue: Aula | null) => {
              handleInventoryChange("aula", newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Aula"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={!inventoryDataForm.edificio}
          />
        </div>
      </div>
    </Box>
  );
};
