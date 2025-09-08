import { TextField, Box, Autocomplete } from "@mui/material";
import { Marca, Modelo, Ubicacion } from "../../../types/index";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import useUbicaciones from "@hooks/useUbicaciones";

interface StepDatosInventarioSAPProps {
  periferico: string;
  edificio: string;
  inventoryDataSAPForm: any;
  handleInventorySAPChange: any;
  inventorySAPErrors: any;
  handleUniqueInventarioSAPError: any;
  tipoInventario: string;
}

export const StepDatosInventarioSAP = ({
  periferico,
  edificio,
  inventoryDataSAPForm,
  handleInventorySAPChange,
  inventorySAPErrors,
  handleUniqueInventarioSAPError,
  tipoInventario,
}: StepDatosInventarioSAPProps) => {
  const { marcas } = useMarcasPorPeriferico(periferico);
  const { modelos } = useModelosPorMarcaPeriferico(
    inventoryDataSAPForm.marca?.id_marca ?? "",
    periferico
  );
  const { ubicaciones } = useUbicaciones(edificio);

  return (
    <Box>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option: Marca) => option?.nombre || ""}
            onChange={(_, newValue: Marca | null) => {
              handleInventorySAPChange("marca", newValue);
              handleUniqueInventarioSAPError(
                "marca",
                newValue,
                inventoryDataSAPForm
              );
            }}
            value={inventoryDataSAPForm.marca}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Marca"
                variant="outlined"
                error={!!inventorySAPErrors.marca}
                helperText={
                  inventorySAPErrors.marca
                    ? "Por favor seleccionar una marca"
                    : ""
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
              handleInventorySAPChange("modelo", newValue);
              handleUniqueInventarioSAPError(
                "modelo",
                newValue,
                inventoryDataSAPForm
              );
            }}
            value={inventoryDataSAPForm.modelo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Modelo"
                variant="outlined"
                error={!!inventorySAPErrors.modelo}
                helperText={
                  inventorySAPErrors.modelo
                    ? "Por favor seleccionar un modelo"
                    : ""
                }
                fullWidth
              />
            )}
            disabled={!inventoryDataSAPForm.marca}
          />
          <TextField
  label="Serie"
  variant="outlined"
  fullWidth
  size="small"
  value={
    typeof inventoryDataSAPForm.serie === "string"
      ? inventoryDataSAPForm.serie
      : inventoryDataSAPForm.serie?.nombre || ""
  }
  error={!!inventorySAPErrors.serie}
  helperText={
    inventorySAPErrors.serie
      ? "Por favor escribir una serie"
      : ""
  }
  onChange={(e) => {
    handleInventorySAPChange("serie", e.target.value);
    handleUniqueInventarioSAPError(
      "serie",
      e.target.value,
      inventoryDataSAPForm
    );
  }}
  disabled={!inventoryDataSAPForm.modelo}
/>
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
              value={inventoryDataSAPForm.empresa}
              onChange={(_, newValue) => {
                handleInventorySAPChange("empresa", newValue);
                handleUniqueInventarioSAPError(
                  "empresa",
                  newValue,
                  inventoryDataSAPForm
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Empresa"
                  variant="outlined"
                  error={!!inventorySAPErrors.empresa}
                  helperText={
                    inventorySAPErrors.empresa
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
              value={inventoryDataSAPForm.inventario}
              error={!!inventorySAPErrors.inventario}
              helperText={
                inventorySAPErrors.inventario
                  ? "Por favor escribir un inventario válido"
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (
                  inventoryDataSAPForm.empresa === "Espol" &&
                  value !== null &&
                  value.length > 8
                ) {
                  return;
                } else if (
                  inventoryDataSAPForm.empresa === "EspolTech" &&
                  value !== null &&
                  value.length > 25
                ) {
                  return;
                }
                handleInventorySAPChange("inventario", value);
                handleUniqueInventarioSAPError(
                  "inventario",
                  value,
                  inventoryDataSAPForm
                );
              }}
              disabled={inventoryDataSAPForm.empresa === ""}
            />
            <TextField
              label="Año de Compra"
              placeholder="Año de Compra"
              variant="outlined"
              fullWidth
              size="small"
              value={inventoryDataSAPForm.anio_compra}
              error={!!inventorySAPErrors.anio_compra}
              helperText={
                inventorySAPErrors.anio_compra
                  ? "Por favor escribir un año de compra válido"
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value;
                if (!(/^\d*$/.test(value))) {
                  return;
                }
                handleInventorySAPChange("anio_compra", value);
                handleUniqueInventarioSAPError(
                  "anio_compra",
                  value,
                  inventoryDataSAPForm
                );
              }}
            />
          </Box>

          {tipoInventario === "activo" ? (
            <Autocomplete
              size="small"
              disablePortal
              options={ubicaciones}
              getOptionLabel={(option) => (option ? option.nombre : "")}
              value={inventoryDataSAPForm.ubicacion}
              onChange={(_, newValue: Ubicacion | null) => {
                handleInventorySAPChange("ubicacion", newValue);
                handleUniqueInventarioSAPError(
                  "ubicacion",
                  newValue,
                  inventoryDataSAPForm
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ubicación"
                  variant="outlined"
                  error={!!inventorySAPErrors.ubicacion}
                  helperText={
                    inventorySAPErrors.ubicacion
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
