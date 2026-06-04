import { useEffect, useState } from "react";
import {
  Marca,
  Modelo,
  Serie,
  Ubicacion,
  Edificio,
} from "../../../../../types";
import { ActivoRedEdit } from "../../../../../types/Activo";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../../../data";

interface VisualizarActivoRedProps {
  equipoRedActivo: ActivoRedEdit;
  perifericoName: string;
}

const VisualizarActivoRed = ({
  perifericoName,
  equipoRedActivo,
}: VisualizarActivoRedProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] = useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] = useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] = useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] = useState<string>("");
  const [selectedInventarioAnio, setSelectedInventarioAnio] = useState<string>("");
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null);
  const [selectedMAC, setSelectedMAC] = useState<string>("");
  const [selectedPuertos, setSelectedPuertos] = useState<string>("");
  const [selectedPuertoFTP, setSelectedPuertoFTP] = useState<string>("");
  const [empresa, setEmpresa] = useState<string | null>("");
  const [nombreEquipo, setNombreEquipo] = useState<string>("");
  const [observacion, setObservacion] = useState<string>("");

  const { marcas } = useMarcasPorPeriferico(equipoRedActivo?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
    equipoRedActivo?.id_marca ?? "",
    equipoRedActivo?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoRedActivo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");
  const navigate = useNavigate();

  useEffect(() => {
    if (equipoRedActivo) {
      setSelectedInventarioInv(equipoRedActivo.inventario);
      setSelectedInventarioAnio(equipoRedActivo.anio_compra);
      setObservacion(equipoRedActivo.observacion);
      setSelectedMAC(equipoRedActivo.mac);
      setSelectedPuertos(equipoRedActivo.puertos);
      setSelectedPuertoFTP(equipoRedActivo.puerto_ftp);
      setNombreEquipo(equipoRedActivo.nombre_equipo ?? "");
      
      // Normalizar empresa a minúsculas para comparación y ajustar formato
      const empresaNormalizada = equipoRedActivo.empresa?.toLowerCase();
      if (empresaNormalizada === "espol") {
        setEmpresa("Espol");
      } else if (empresaNormalizada === "espoltech") {
        setEmpresa("EspolTech");
      } else {
        // Fallback al método anterior solo si no hay empresa
        (equipoRedActivo.inventario.length === 10 || equipoRedActivo.inventario.length === 12)
          ? setEmpresa("EspolTech")
          : setEmpresa("Espol");
      }
    }
  }, [equipoRedActivo]);

  useEffect(() => {
    if (equipoRedActivo && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipoRedActivo.id_marca) || null
      );
    }
  }, [equipoRedActivo, marcas]);

  useEffect(() => {
    if (equipoRedActivo && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipoRedActivo.id_modelo) || null
      );
    }
  }, [equipoRedActivo, modelos]);

  useEffect(() => {
    if (equipoRedActivo && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoRedActivo.id_serie) || null
      );
    }
  }, [equipoRedActivo, series]);

  useEffect(() => {
    if (equipoRedActivo && edificios.length > 0) {
      setSelectedEdificio(
        edificios.find((edificio) => edificio?.id_edificio === equipoRedActivo.id_edificio) || null
      );
    }
  }, [equipoRedActivo, edificios]);

  useEffect(() => {
    if (equipoRedActivo && ubicaciones.length > 0) {
      setSelectedUbicacion(
        ubicaciones.find((ubicacion) => ubicacion?.id_ubicacion === equipoRedActivo.id_ubicacion) || null
      );
    }
  }, [equipoRedActivo, ubicaciones]);

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
          <TextField
            label="Año de Compra"
            placeholder="Año de Compra"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedInventarioAnio}
            disabled
          />
        </Box>
      </div>

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Autocomplete
          size="small"
          disablePortal
          options={edificios}
          value={selectedEdificio}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField {...params} label="Edificio" variant="outlined" fullWidth />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={ubicaciones}
          value={selectedUbicacion}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField {...params} label="Ubicación" variant="outlined" fullWidth />
          )}
          disabled
        />
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
            label="Puertos 1000"
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

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Imagen</h2>
        <div className="flex flex-col items-center gap-4">
          {equipoRedActivo.imagenRuta ? (
            <img
              src={`${IMAGE_BASE_URL.replace(/\/$/, "")}/${equipoRedActivo.imagenRuta.replace(/^\//, "")}`}
              alt="Imagen del equipo"
              className="w-full max-w-sm h-48 object-cover border"
            />
          ) : (
            <p className="text-gray-500">Sin imagen</p>
          )}
        </div>
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

export default VisualizarActivoRed;
