import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
import { Marca, Modelo, Serie, Lampara } from "../../../../../types";
import { BodegaSimpleEdit } from "../../../../../types/Bodega/index";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import { useLamparasPorModelo } from "@hooks/useLamparasPorModelo";
import useLamparas from "@hooks/useLamparas";
import useComputadorasPorPeriferico from "@hooks/useComputadorasPorPeriferico";
import usePerifericos from "@hooks/usePerifericos";
import { useNavigate } from "react-router-dom";

interface VisualizarBodegaSimpleProps {
  equipoSimpleBodega: BodegaSimpleEdit;
  perifericoName: string;
}

const VisualizarBodegaSimple = ({
  perifericoName,
  equipoSimpleBodega,
}: VisualizarBodegaSimpleProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] = useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] = useState<Modelo | null>(null);
  const [selectedLampara, setSelectedLampara] = useState<Lampara | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] = useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] = useState<string>("");
  const [selectedInventarioAnio, setSelectedInventarioAnio] = useState<string>("");
  const [empresa, setEmpresa] = useState<string | null>("");
  const [observacion, setObservacion] = useState<string>("");
  const [equipoPrincipal, setEquipoPrincipal] = useState<string>("S/N");
  const [tipoEquipoPrincipal, setTipoEquipoPrincipal] = useState<string>("S/N");

  const { marcas } = useMarcasPorPeriferico(equipoSimpleBodega?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipoSimpleBodega?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoSimpleBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { lamparas } = useLamparasPorModelo(
    equipoSimpleBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { lamparasTotales } = useLamparas();
  const { computadoras } = useComputadorasPorPeriferico(
    equipoSimpleBodega?.id_periferico_computadora ?? "",
    "bodega"
  );
  const { perifericos } = usePerifericos();
  const navigate = useNavigate();

  useEffect(() => {
    if (!equipoSimpleBodega?.isComponente || !equipoSimpleBodega.id_computadora) {
      setEquipoPrincipal("S/N");
      setTipoEquipoPrincipal("S/N");
      return;
    }

    const computadora = computadoras.find(
      (item) => String(item.id_equipo) === String(equipoSimpleBodega.id_computadora)
    );
    setEquipoPrincipal(computadora?.serie?.trim() || "S/N");

    const perifericoPrincipal = perifericos.find(
      (item) => String(item?.id_periferico) === String(equipoSimpleBodega.id_periferico_computadora)
    );
    setTipoEquipoPrincipal(perifericoPrincipal?.nombre?.trim() || "S/N");
  }, [equipoSimpleBodega, computadoras, perifericos]);

  useEffect(() => {
    if (equipoSimpleBodega) {
      setSelectedInventarioInv(equipoSimpleBodega.inventario);
      setSelectedInventarioAnio(equipoSimpleBodega.anio_compra);
      setObservacion(equipoSimpleBodega.observacion);
      (equipoSimpleBodega.inventario.length === 10 || equipoSimpleBodega.inventario.length === 12)
        ? setEmpresa("EspolTech")
        : setEmpresa("Espol");
    }
  }, [equipoSimpleBodega]);

  useEffect(() => {
    if (equipoSimpleBodega && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipoSimpleBodega.id_marca) || null
      );
    }
  }, [equipoSimpleBodega, marcas]);

  useEffect(() => {
    if (equipoSimpleBodega && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipoSimpleBodega.id_modelo) || null
      );
    }
  }, [equipoSimpleBodega, modelos]);

  useEffect(() => {
    if (equipoSimpleBodega && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoSimpleBodega.id_serie) || null
      );
    }
  }, [equipoSimpleBodega, series]);

  useEffect(() => {
    if (equipoSimpleBodega && lamparasTotales.length > 0) {
      setSelectedLampara(
        lamparasTotales.find((lampara) => lampara?.id_lampara === equipoSimpleBodega.id_lampara) || null
      );
    }
  }, [equipoSimpleBodega, lamparasTotales]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Información de Inventario</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {perifericoName !== "Proyector" && (
          <>
            <TextField
              label="Tipo Equipo Principal"
              variant="outlined"
              fullWidth
              size="small"
              value={tipoEquipoPrincipal}
              disabled
            />
            <TextField
              label="Serie de Equipo Principal"
              variant="outlined"
              fullWidth
              size="small"
              value={equipoPrincipal}
              disabled
            />
          </>
        )}
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

export default VisualizarBodegaSimple;
