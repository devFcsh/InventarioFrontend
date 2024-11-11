import React, { useState } from "react";
import { TextField, Box, Autocomplete } from "@mui/material";
import { Marca, Modelo, Serie, Edificio, Aula, Usuario, Uso } from "../../../../../../../types";
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import useEdificios from "@hooks/useEdificios";
import useAulas from "@hooks/useAulas";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import useUsos from "@hooks/useUsos";

interface StepDatosInventarioProps {
  periferico: string;
  handleFormData: any
}

const Step1DatosInventario = ({
  periferico,
  handleFormData
}: StepDatosInventarioProps) => {
  const { usos, loading: loadingUsos, error: errorUsos } = useUsos();
  const [selectedUsoId, setSelectedUsoId] = useState<string | null>(null);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState<string | null>(null);
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] = useState<string | null>("");
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);


  const {
    usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
  } = useUsuariosPorUso(selectedUsoId || "");
  
  const { marcas } = useMarcasPorPeriferico(periferico);
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    periferico
  );
  const { series } = useSeriesPorModelo(
    periferico,
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { edificios } = useEdificios();
  const { aulas } = useAulas(selectedEdificio?.id_edificio ?? "");


  const handleUsoChange = (event: any, newValue: Uso | null) => {
    if (newValue) {
      setSelectedUsoId(newValue.id_uso);
    } else {
      setSelectedUsoId(null);
      setSelectedUsuarioId(null);
    }
  };
  const handleMarcaChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Marca | null
  ) => {
    setSelectedInventarioMarca(newValue);
    setSelectedInventarioModelo(null);
    setSelectedInventarioSerie(null);
  };


  const handleModeloChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null
  ) => {
    setSelectedInventarioModelo(newValue);
    setSelectedInventarioSerie(null);
  };
  const handleSerieChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Serie | null
  ) => {
    setSelectedInventarioSerie(newValue);
    handleFormData(newValue?.id_serie,"serie")
  };


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
        <Autocomplete
            size="small"
            disablePortal
            options={usuarios}
            loading={loadingUsuarios}
            value={
              usuarios.find((u) => u.id_usuario === selectedUsuarioId) ?? null
            }
            onChange={(event, newValue: Usuario | null) =>{
              setSelectedUsuarioId(newValue ? newValue.id_usuario : null);
              handleFormData(newValue ? newValue.id_usuario: null,"idUsuario");
            }
            }
            getOptionLabel={(option) => option.nombre}
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
  onChange={handleMarcaChange}
  value={selectedInventarioMarca}
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
            onChange={handleModeloChange}
            value={selectedInventarioModelo}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Modelo"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={!selectedInventarioMarca}
          />
              <Autocomplete
                size="small"
                disablePortal
                options={series}
                getOptionLabel={(option: Serie) => option?.nombre || ""}
                onChange={handleSerieChange}
                value={selectedInventarioSerie}
                renderInput={(params) => (
                  <TextField {...params} label="Serie" variant="outlined" fullWidth />
                )}
                disabled={!selectedInventarioModelo}
              />
                <TextField
                  label="Inventario"
                  placeholder="Inventario"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={selectedInventarioInv}
                  onChange={(e) => {setSelectedInventarioInv(e.target.value),handleFormData(e.target.value,"inventario")}}
                />
                <Autocomplete
            size="small"
            disablePortal
            options={edificios}
            getOptionLabel={(option) => option.nombre}
            value={selectedEdificio}
            onChange={(_, newValue) => setSelectedEdificio(newValue)}
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
            getOptionLabel={(option) => option.nombre}
            value={selectedAula}
            onChange={(_, newValue) => {setSelectedAula(newValue);handleFormData(newValue?.id_aula,"aula")}}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Aula"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={!selectedEdificio}
          />
          </div>
        </div>
    </Box>
  );
};

export default Step1DatosInventario;
