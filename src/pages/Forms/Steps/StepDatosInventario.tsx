import { TextField, Box, Autocomplete } from "@mui/material";
import {
  Lampara,
  Marca,
  Modelo,
  Periferico,
  Ubicacion,
  Usuario,
} from "../../../types/index";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import useUbicaciones from "@hooks/useUbicaciones";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import { useLamparasPorModelo } from "@hooks/useLamparasPorModelo";
import { useNavigate } from "react-router-dom";

interface StepDatosInventarioProps {
  periferico?: Periferico;
  uso: string;
  edificio: string;
  inventoryDataForm: any;
  handleInventoryChange: any;
  inventoryErrors: any;
  handleUniqueInventarioError: any;
  tipoInventario: string;
  existeSerie: boolean;
  existeInventario: boolean;
  consultarSerie: (serie: string) => Promise<void>;
  consultarInventario: (inventario: string) => Promise<void>;
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
  existeSerie,
  existeInventario,
  consultarSerie,
  consultarInventario,
}: StepDatosInventarioProps) => {
  const {
    usuarios,
    loading: loadingUsuarios,
    error: _,
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
  const { ubicaciones } = useUbicaciones(edificio);
  const navigate = useNavigate();

  return (
    <Box>
      <div className="mt-8">
        <div className="flex items-center mt-8 mb-4">
          <span>¿No encuentras tu usuario? </span>
          <a
            href="#"
            style={{
              color: "#1976d2",
              marginLeft: 4,
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/agregarUsuario");
            }}
          >
            Agrégalo
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {tipoInventario === "activo" && periferico?.nombre !== "Proyector" ? (
            <Autocomplete
              size="small"
              disablePortal
              options={usuarios}
              loading={loadingUsuarios}
              value={
                usuarios.find(
                  (ul) => ul?.id_usuario === inventoryDataForm.usuarioId
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
          <TextField
            label="Serie"
            variant="outlined"
            fullWidth
            size="small"
            value={inventoryDataForm.serie || ""}
            error={
              !!inventoryErrors.serie ||
              (!!inventoryDataForm.serie && existeSerie)
            }
            helperText={
              inventoryErrors.serie
                ? "Por favor escribir una serie"
                : existeSerie
                ? "La serie ya existe"
                : ""
            }
            onChange={async (e) => {
              const value = e.target.value;
              if (value !== null && value.length > 30) {
                return;
              }
              handleInventoryChange("serie", value);
              handleUniqueInventarioError("serie", value, inventoryDataForm);
              if (value) {
                await consultarSerie(value);
              }
            }}
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
              onChange={(_, newValue) => {
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
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <TextField
                label="Inventario"
                placeholder="Inventario"
                variant="outlined"
                fullWidth
                size="small"
                value={inventoryDataForm.inventario}
                error={
                  !!inventoryErrors.inventario ||
                  (!!inventoryDataForm.inventario && 
                   inventoryDataForm.inventario !== "S/N" && 
                   existeInventario)
                }
                helperText={
                  inventoryErrors.inventario && inventoryDataForm.inventario !== "S/N"
                    ? "Por favor escribir un inventario válido"
                    : existeInventario && inventoryDataForm.inventario !== "S/N"
                    ? "El inventario ya existe"
                    : ""
                }
                onChange={async (e) => {
                  const value = e.target.value;
                  if (
                    inventoryDataForm.empresa === "Espol" &&
                    value !== null &&
                    value.length > 8
                  ) {
                    return;
                  } else if (
                    inventoryDataForm.empresa === "EspolTech" &&
                    value !== null &&
                    value.length > 25
                  ) {
                    return;
                  }
                  handleInventoryChange("inventario", value);
                  handleUniqueInventarioError("inventario", value, inventoryDataForm);
                  if (value && value !== "S/N") {
                    await consultarInventario(value);
                  }
                }}
                disabled={inventoryDataForm.empresa === "" || inventoryDataForm.inventario === "S/N"}
              />
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <input
                  type="checkbox"
                  id="sin-inventario"
                  checked={inventoryDataForm.inventario === "S/N"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInventoryChange("inventario", "S/N");
                      handleUniqueInventarioError("inventario", "S/N", inventoryDataForm);
                    } else {
                      handleInventoryChange("inventario", "");
                      handleUniqueInventarioError("inventario", "", inventoryDataForm);
                    }
                  }}
                  disabled={inventoryDataForm.empresa === ""}
                  style={{ marginRight: 4 }}
                />
                <label htmlFor="sin-inventario" style={{ fontSize: "0.875rem", cursor: "pointer" }}>
                  Sin inventario
                </label>
              </Box>
            </Box>
          </Box>
          <TextField
            label="Año de Compra"
            placeholder="Año de Compra"
            variant="outlined"
            fullWidth
            size="small"
            value={inventoryDataForm.anio_compra}
            error={!!inventoryErrors.anio_compra}
            helperText={
              inventoryErrors.anio_compra
                ? "Por favor escribir un año válido"
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) {
                return;
              }
              handleInventoryChange("anio_compra", value);
              handleUniqueInventarioError(
                "anio_compra",
                value,
                inventoryDataForm
              );
            }}
          />

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
