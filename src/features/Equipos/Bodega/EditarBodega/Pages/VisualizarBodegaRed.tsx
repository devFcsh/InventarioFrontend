import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { Marca, Modelo, Serie } from "../../../../../types";
import { BodegaRedEdit } from "../../../../../types/Bodega";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import { useNavigate } from "react-router-dom";

interface VisualizarBodegaRedProps {
  equipoRedBodega: BodegaRedEdit;
  perifericoName: string;
}

const VisualizarBodegaRed = ({
  perifericoName,
  equipoRedBodega,
}: VisualizarBodegaRedProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] = useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] = useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] = useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] = useState<string>("");
  const [selectedMAC, setSelectedMAC] = useState<string>("");
  const [selectedPuertos, setSelectedPuertos] = useState<string>("");
  const [selectedPuertoFTP, setSelectedPuertoFTP] = useState<string>("");
  const [empresa, setEmpresa] = useState<string | null>("");
  const [nombreEquipo, setNombreEquipo] = useState<string>("");
  const [observacion, setObservacion] = useState<string>("");

  const { marcas } = useMarcasPorPeriferico(equipoRedBodega?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
    equipoRedBodega?.id_marca ?? "",
    equipoRedBodega?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoRedBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (equipoRedBodega) {
      setSelectedInventarioInv(equipoRedBodega.inventario);
      setObservacion(equipoRedBodega.observacion);
      setSelectedMAC(equipoRedBodega.mac);
      setSelectedPuertos(equipoRedBodega.puertos);
      setSelectedPuertoFTP(equipoRedBodega.puerto_ftp);
      setNombreEquipo(equipoRedBodega.nombre_equipo ?? "");
      (equipoRedBodega.inventario.length === 10 || equipoRedBodega.inventario.length === 12)
        ? setEmpresa("EspolTech")
        : setEmpresa("Espol");
    }
  }, [equipoRedBodega]);

  useEffect(() => {
    if (equipoRedBodega && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipoRedBodega.id_marca) || null
      );
    }
  }, [equipoRedBodega, marcas]);

  useEffect(() => {
    if (equipoRedBodega && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipoRedBodega.id_modelo) || null
      );
    }
  }, [equipoRedBodega, modelos]);

  useEffect(() => {
    if (equipoRedBodega && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoRedBodega.id_serie) || null
      );
    }
  }, [equipoRedBodega, series]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Información de Inventario</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Autocomplete
          size="small"
          disablePortal
          options={marcas}
          value={selectedInventarioMarca}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Marca" variant="outlined" fullWidth />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={modelos}
          value={selectedInventarioModelo}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Modelo" variant="outlined" fullWidth />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={series}
          value={selectedInventarioSerie}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Serie" variant="outlined" fullWidth />
          )}
          disabled
        />
        <Box sx={{ display: "inline-flex" }}>
          <Autocomplete
            size="small"
            disablePortal
            sx={{ width: "50%" }}
            options={["Espol", "EspolTech"]}
            getOptionLabel={(option) => (option ? option : "")}
            value={empresa}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Empresa"
                variant="outlined"
                fullWidth
                sx={{ marginRight: 8, width: "100%" }}
              />
            )}
            disabled
          />
          <TextField
            label="Inventario"
            placeholder="Inventario"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedInventarioInv}
            disabled
          />
        </Box>
      </div>

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <TextField
          label="MAC"
          placeholder="MAC"
          variant="outlined"
          fullWidth
          size="small"
          value={selectedMAC}
          disabled
        />
        <TextField
          label="Nombre Equipo"
          placeholder="Nombre Equipo"
          variant="outlined"
          fullWidth
          size="small"
          value={nombreEquipo}
          disabled
        />
        {perifericoName === "Switch" ? (
          <TextField
            label="Puertos 10-100-1000"
            placeholder="Puertos"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedPuertos}
            disabled
          />
        ) : null}
        {perifericoName === "Switch" ? (
          <TextField
            label="puertoFTP"
            placeholder="Puerto FTP"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedPuertoFTP}
            disabled
          />
        ) : null}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-10">Observación</h2>
        <TextField
          label="Observación"
          variant="outlined"
          fullWidth
          multiline
          minRows={2}
          value={observacion}
          disabled
        />
      </div>

      <div className="flex gap-4 mt-10">
        <Button
          onClick={() => navigate(-1)}
          color="error"
          variant="contained"
          fullWidth
        >
          Salir
        </Button>
      </div>
    </div>
  );
};

export default VisualizarBodegaRed;