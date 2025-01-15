import { TextField, Box, Autocomplete } from "@mui/material";
import {
  Marca,
  Modelo,
  Serie,
  Ubicacion,
  Usuario,
} from "../../../types/index";
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import useUbicaciones from "@hooks/useUbicaciones";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";

interface StepDatosInventarioProps {
  periferico: string;
  uso: string;
  edificio:string;
  inventoryDataForm:any;
  handleInventoryChange: any;
  inventoryErrors: any;
  handleUniqueInventarioError:any;
  tipoInventario: string;
}

export const StepDatosInventario = ({
  periferico,
  uso,
  edificio,
  inventoryDataForm,
  handleInventoryChange,
  inventoryErrors,
  handleUniqueInventarioError,
  tipoInventario,
}: StepDatosInventarioProps) => {
  const {
    usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
  } = useUsuariosPorUso(uso || "");

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
  const { ubicaciones } = useUbicaciones(edificio);

  return (
    <Box>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
        
        {tipoInventario==="activo"?
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
                    handleUniqueInventarioError("usuario",newValue);
                  }}
                  getOptionLabel={(option) => option ? option.nombre : ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Usuario"
                      variant="outlined"
                      error={!!inventoryErrors.usuario}
                      helperText={inventoryErrors.usuario? "Por favor seleccionar un usuario" :""}
                      fullWidth
                    />
                  )}
                />:""}


          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option: Marca) => option?.nombre || ""}
            onChange={(_, newValue: Marca | null) => {
              handleInventoryChange("marca", newValue);
              handleUniqueInventarioError("marca",newValue);
            }}
            value={inventoryDataForm.marca}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Marca"
                variant="outlined"
                error={!!inventoryErrors.marca}
                helperText={inventoryErrors.marca? "Por favor seleccionar una marca" :""}
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
              handleUniqueInventarioError("modelo",newValue);
            }}
            value={inventoryDataForm.modelo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Modelo"
                variant="outlined"
                error={!!inventoryErrors.modelo}
                helperText={inventoryErrors.modelo? "Por favor seleccionar un modelo" :""}
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
              handleUniqueInventarioError("serie",newValue);
            }}
            value={inventoryDataForm.serie}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serie"
                variant="outlined"
                error={!!inventoryErrors.serie}
                helperText={inventoryErrors.serie? "Por favor seleccionar una serie" :""}
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
            error={!!inventoryErrors.inventario}
            helperText={inventoryErrors.inventario? "Por favor escribir un inventario" :""}
            onChange={(e) => {
              handleInventoryChange("inventario", e.target.value);
              handleUniqueInventarioError("inventario",e.target.value);
            }}
          />
          {tipoInventario==="activo"?
          <Autocomplete
            size="small"
            disablePortal
            options={ubicaciones}
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={inventoryDataForm.ubicacion}
            onChange={(_, newValue: Ubicacion | null) => {
              handleInventoryChange("ubicacion", newValue);
              handleUniqueInventarioError("ubicacion",newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ubicación"
                variant="outlined"
                error={!!inventoryErrors.ubicacion}
                helperText={inventoryErrors.ubicacion? "Por favor seleccionar una ubicación" :""}
                fullWidth
              />
            )}
            disabled={!edificio}
          />:""}
        </div>
      </div>
    </Box>
  );
};
