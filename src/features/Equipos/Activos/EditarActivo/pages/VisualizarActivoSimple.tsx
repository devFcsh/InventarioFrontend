import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import {
  Marca,
  Modelo,
  Serie,
  Ubicacion,
  Edificio,
  Lampara,
} from "../../../../../types";
import { ActivoSimpleEdit } from "../../../../../types/Activo";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import { useLamparasPorModelo } from "@hooks/useLamparasPorModelo";
import useLamparas from "@hooks/useLamparas";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../../../data";

interface VisualizarActivoSimpleProps {
  equipoSimpleActivo: ActivoSimpleEdit;
  perifericoName: string;
}

const VisualizarActivoSimple = ({
  perifericoName,
  equipoSimpleActivo,
}: VisualizarActivoSimpleProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedLampara, setSelectedLampara] = useState<Lampara | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [selectedInventarioAnio, setSelectedInventarioAnio] =
    useState<string>("");
  const [empresa, setEmpresa] = useState<string | null>("");
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(
    null
  );

  const { marcas } = useMarcasPorPeriferico(
    equipoSimpleActivo?.id_periferico ?? ""
  );
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipoSimpleActivo?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoSimpleActivo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { lamparas } = useLamparasPorModelo(
    equipoSimpleActivo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { edificios } = useEdificios();
  const { lamparasTotales } = useLamparas();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");
  const navigate = useNavigate();

  useEffect(() => {
    if (equipoSimpleActivo) {
      setSelectedInventarioInv(equipoSimpleActivo.inventario);
      setSelectedInventarioAnio(equipoSimpleActivo.anio_compra);
      
      // Normalizar empresa a minúsculas para comparación y ajustar formato
      const empresaNormalizada = equipoSimpleActivo.empresa?.toLowerCase();
      if (empresaNormalizada === "espol") {
        setEmpresa("Espol");
      } else if (empresaNormalizada === "espoltech") {
        setEmpresa("EspolTech");
      } else {
        // Fallback al método anterior solo si no hay empresa
        (equipoSimpleActivo.inventario.length === 10 || equipoSimpleActivo.inventario.length === 12)
          ? setEmpresa("EspolTech")
          : setEmpresa("Espol");
      }
    }
  }, [equipoSimpleActivo]);

  useEffect(() => {
    if (equipoSimpleActivo && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find(
          (marca) => marca?.id_marca === equipoSimpleActivo.id_marca
        ) || null
      );
    }
  }, [equipoSimpleActivo, marcas]);

  useEffect(() => {
    if (equipoSimpleActivo && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find(
          (modelo) => modelo?.id_modelo === equipoSimpleActivo.id_modelo
        ) || null
      );
    }
  }, [equipoSimpleActivo, modelos]);

  useEffect(() => {
    if (equipoSimpleActivo && series.length > 0) {
      setSelectedInventarioSerie(
        series.find(
          (serie) => serie?.id_serie === equipoSimpleActivo.id_serie
        ) || null
      );
    }
  }, [equipoSimpleActivo, series]);

  useEffect(() => {
    if (equipoSimpleActivo && edificios.length > 0) {
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio?.id_edificio === equipoSimpleActivo.id_edificio
        ) || null
      );
    }
  }, [equipoSimpleActivo, edificios]);

  useEffect(() => {
    if (equipoSimpleActivo && ubicaciones.length > 0) {
      setSelectedUbicacion(
        ubicaciones.find(
          (ubicacion) =>
            ubicacion?.id_ubicacion === equipoSimpleActivo.id_ubicacion
        ) || null
      );
    }
  }, [equipoSimpleActivo, ubicaciones]);

  useEffect(() => {
    if (equipoSimpleActivo && lamparasTotales.length > 0) {
      setSelectedLampara(
        lamparasTotales.find(
          (lampara) => lampara?.id_lampara === equipoSimpleActivo.id_lampara
        ) || null
      );
    }
  }, [equipoSimpleActivo, lamparasTotales]);

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
            <TextField
              {...params}
              label="Modelo"
              variant="outlined"
              fullWidth
            />
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
        {perifericoName === "Proyector" ? (
          <Autocomplete
            size="small"
            disablePortal
            options={lamparas}
            value={selectedLampara}
            getOptionLabel={(option) => (option ? option.nombre : "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lámpara"
                variant="outlined"
                fullWidth
              />
            )}
            disabled
          />
        ) : null}
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
            <TextField
              {...params}
              label="Edificio"
              variant="outlined"
              fullWidth
            />
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
            <TextField
              {...params}
              label="Ubicación"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Imagen</h2>
          <div className="flex flex-col items-center gap-4">
            {equipoSimpleActivo.imagenRuta ? (
              <div className="w-[300px] h-[300px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 shadow-sm border border-gray-200">
                <img
                  src={`${IMAGE_BASE_URL.replace(/\/$/, "")}/${equipoSimpleActivo.imagenRuta.replace(/^\//, "")}`}
                  alt="Imagen del equipo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-[300px] h-[300px] rounded-lg flex items-center justify-center bg-gray-200 shadow-sm border border-gray-300">
                <span className="text-gray-500 font-medium text-center">Sin Imagen</span>
              </div>
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
          value={equipoSimpleActivo.observacion}
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

export default VisualizarActivoSimple;
