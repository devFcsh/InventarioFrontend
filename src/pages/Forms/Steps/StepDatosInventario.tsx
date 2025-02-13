import { TextField, Box, Autocomplete, FormHelperText } from "@mui/material";
import {
  Lampara,
  Marca,
  Modelo,
  Periferico,
  Serie,
  Ubicacion,
  Usuario,
} from "../../../types/index";
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import useUbicaciones from "@hooks/useUbicaciones";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import { useLamparasPorModelo } from "@hooks/useLamparasPorModelo";

interface StepDatosInventarioProps {
  periferico: Periferico;
  uso: string;
  edificio: string;
  inventoryDataForm: any;
  handleInventoryChange: any;
  inventoryErrors: any;
  handleUniqueInventarioError: any;
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

  const { marcas } = useMarcasPorPeriferico(periferico?.id_periferico ?? "");
  const { lamparas } = useLamparasPorModelo(
    periferico?.id_periferico ?? "",
    inventoryDataForm.marca?.id_marca ?? "",
    inventoryDataForm.modelo?.id_modelo ?? ""
  );
  const { modelos } = useModelosPorMarcaPeriferico(
    inventoryDataForm.marca?.id_marca ?? "",
    periferico?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    periferico?.id_periferico ?? "",
    inventoryDataForm.marca?.id_marca ?? "",
    inventoryDataForm.modelo?.id_modelo ?? ""
  );
  const { ubicaciones } = useUbicaciones(edificio);

  return (
    <Box>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          {tipoInventario === "activo" && periferico?.nombre !== "Proyector" ? (
            <Autocomplete
              size="small"
              disablePortal
              options={usuarios}
              loading={loadingUsuarios}
              value={
                usuarios.find(
                  (u) => u?.id_usuario === inventoryDataForm.usuarioId
                ) ?? null
              }
              onChange={(_, newValue: Usuario | null) => {
                handleInventoryChange("usuario", newValue);
                handleUniqueInventarioError(
                  "usuario",
                  newValue,
                  inventoryDataForm
                );
              }}
              getOptionLabel={(option) => (option ? option.nombre : "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Usuario"
                  variant="outlined"
                  error={!!inventoryErrors.usuario}
                  helperText={
                    inventoryErrors.usuario
                      ? "Por favor seleccionar un usuario"
                      : ""
                  }
                  fullWidth
                />
              )}
            />
          ) : (
            ""
          )}

          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option: Marca) => option?.nombre || ""}
            onChange={(_, newValue: Marca | null) => {
              handleInventoryChange("marca", newValue);
              handleUniqueInventarioError("marca", newValue, inventoryDataForm);
            }}
            value={inventoryDataForm.marca}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Marca"
                variant="outlined"
                error={!!inventoryErrors.marca}
                helperText={
                  inventoryErrors.marca ? "Por favor seleccionar una marca" : ""
                }
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
              handleUniqueInventarioError(
                "modelo",
                newValue,
                inventoryDataForm
              );
            }}
            value={inventoryDataForm.modelo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Modelo"
                variant="outlined"
                error={!!inventoryErrors.modelo}
                helperText={
                  inventoryErrors.modelo
                    ? "Por favor seleccionar un modelo"
                    : ""
                }
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
              handleUniqueInventarioError("serie", newValue, inventoryDataForm);
            }}
            value={inventoryDataForm.serie}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serie"
                variant="outlined"
                error={!!inventoryErrors.serie}
                helperText={
                  inventoryErrors.serie ? "Por favor seleccionar una serie" : ""
                }
                fullWidth
              />
            )}
            disabled={!inventoryDataForm.modelo}
          />
          {periferico?.nombre === "Proyector" ? (
            <Autocomplete
              size="small"
              disablePortal
              options={lamparas}
              value={inventoryDataForm.lampara}
              onChange={(_, newValue: Lampara | null) => {
                handleInventoryChange("lampara", newValue);
                handleUniqueInventarioError(
                  "lampara",
                  newValue,
                  inventoryDataForm
                );
              }}
              getOptionLabel={(option) => (option ? option.nombre : "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lámpara"
                  variant="outlined"
                  error={!!inventoryErrors.lampara}
                  helperText={
                    inventoryErrors.lampara
                      ? "Por favor seleccionar una lámpara"
                      : ""
                  }
                  fullWidth
                />
              )}
              disabled={!inventoryDataForm.modelo}
            />
          ) : (
            ""
          )}
          <Box
            sx={{
              display: "inline-flex",
            }}
          >
            <Autocomplete
              size="small"
              disablePortal
              sx={{ width: "50%" }}
              options={["Espol", "EspolTech"]}
              getOptionLabel={(option) => (option ? option : "")}
              value={inventoryDataForm.empresa}
              onChange={(event, newValue) => {
                handleInventoryChange("empresa", newValue);
                handleUniqueInventarioError(
                  "empresa",
                  newValue,
                  inventoryDataForm
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Empresa"
                  variant="outlined"
                  error={!!inventoryErrors.empresa}
                  helperText={
                    inventoryErrors.empresa
                      ? "Por favor seleccionar una empresa"
                      : ""
                  }
                  fullWidth
                  sx={{ marginRight: 8, width: "100%" }}
                />
              )}
            />
            <TextField
              label="Inventario"
              placeholder="Inventario"
              variant="outlined"
              fullWidth
              size="small"
              value={inventoryDataForm.inventario}
              error={!!inventoryErrors.inventario}
              helperText={
                inventoryErrors.inventario
                  ? "Por favor escribir un inventario válido"
                  : ""
              }
              onChange={(e) => {
                let value = e.target.value;
                if (inventoryDataForm.empresa==="Espol" && value !== null && value.length > 6) {
                  return
                }else if(inventoryDataForm.empresa==="EspolTech" && value !== null && value.length > 10){
                  return
                }
                handleInventoryChange("inventario", value);
                handleUniqueInventarioError(
                  "inventario",
                  value,
                  inventoryDataForm
                );
              }}
              disabled={inventoryDataForm.empresa === ""}
            />
          </Box>

          {tipoInventario === "activo" ? (
            <Autocomplete
              size="small"
              disablePortal
              options={ubicaciones}
              getOptionLabel={(option) => (option ? option.nombre : "")}
              value={inventoryDataForm.ubicacion}
              onChange={(_, newValue: Ubicacion | null) => {
                handleInventoryChange("ubicacion", newValue);
                handleUniqueInventarioError(
                  "ubicacion",
                  newValue,
                  inventoryDataForm
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ubicación"
                  variant="outlined"
                  error={!!inventoryErrors.ubicacion}
                  helperText={
                    inventoryErrors.ubicacion
                      ? "Por favor seleccionar una ubicación"
                      : ""
                  }
                  fullWidth
                />
              )}
              disabled={!edificio}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </Box>
  );
};
