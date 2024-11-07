import { useState } from "react";
import { useAgregarComponentes } from "../../hooks/useAgregarComponentes";
import {
  Marca,
  Modelo,
  Serie,
  Periferico,

} from "../../../../../../types";
import { Componente } from "../../../../../../types/Activo/Componente/index.ts";
import { Autocomplete, Button, TextField } from "@mui/material";
import Icon from "@mui/material/Icon";
import usePerifericos from "@hooks/usePerifericos";
import { useSeriesPorModelo } from "@hooks/useSeriesPorModelo";
import useMarcasPorPeriferico from "@hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "@hooks/useModelosPorMarcaPeriferico";


export const StepComponentes = () => {
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const eliminarComponente = (index: number) => {
    setComponentes(componentes.filter((_, i) => i !== index));
  };
  const [nuevoComponente, setNuevoComponente] = useState<Componente>({
    periferico: null,
    marca: null,
    modelo: null,
    serie: null,
    inventario: "",
  });
  const limpiarCamposDependientesComponente = () => {
    setNuevoComponente({
      ...nuevoComponente,
      periferico: null,
      marca: null,
      modelo: null,
      serie: null,
      inventario: "",
    });
  };
  const { marcas: marcasComponente } = useMarcasPorPeriferico(
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const { perifericos } = usePerifericos();
  const filteredPerifericos = perifericos.filter(
    (p) =>
      p?.nombre.toLowerCase() !== "computadora" &&
      p?.nombre.toLowerCase() !== "laptop"
  );
  const { agregarComponentes } = useAgregarComponentes();
  const { modelos: modelosComponente } = useModelosPorMarcaPeriferico(
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<
  string | null
>(null);
  const { series: seriesComponente } = useSeriesPorModelo(
    nuevoComponente.periferico?.id_periferico ?? "",
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.modelo?.id_modelo ?? ""
  );
  const handleMarcaComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Marca | null
  ) => {
    setNuevoComponente({
      ...nuevoComponente,
      marca: newValue,
      modelo: null,
      serie: null,
    });
  };
  const handlePerifericoComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Periferico | null
  ) => {
    setNuevoComponente({
      ...nuevoComponente,
      periferico: newValue,
      marca: null,
      modelo: null,
      serie: null,
    });
  };
  const handleModeloComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Modelo | null
  ) => {
    setNuevoComponente({ ...nuevoComponente, modelo: newValue, serie: null });
  };
  const handleSerieComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Serie | null
  ) => {
    setNuevoComponente({ ...nuevoComponente, serie: newValue });
  };
  const agregarComponente = () => {
    if (
      nuevoComponente.periferico &&
      nuevoComponente.marca &&
      nuevoComponente.modelo &&
      nuevoComponente.serie &&
      nuevoComponente.inventario !== ""
    ) {
      setComponentes([...componentes, nuevoComponente]);
      setNuevoComponente({
        periferico: {} as Periferico,
        marca: {} as Marca,
        modelo: {} as Modelo,
        serie: {} as Serie,
        inventario: "",
      });
      limpiarCamposDependientesComponente();
      setErrorMensajeComponente(null);
    } else {
      setErrorMensajeComponente(
        "Por favor, complete todos los campos del componente."
      );
    }
  };
  return (
    <div className="mt-8">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 border">Periférico</th>
              <th className="py-2 px-4 border">Marca</th>
              <th className="py-2 px-4 border">Modelo</th>
              <th className="py-2 px-4 border">Serie</th>
              <th className="py-2 px-4 border">Inventario</th>
              <th className="py-2 px-1 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {componentes.map((comp, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">
                  {comp.periferico?.nombre}
                </td>
                <td className="py-2 px-4 border">{comp.marca?.nombre}</td>
                <td className="py-2 px-4 border">{comp.modelo?.nombre}</td>
                <td className="py-2 px-4 border">{comp.serie?.nombre}</td>
                <td className="py-2 px-4 border">{comp.inventario}</td>
                <td className="py-2 px-1 border">
                  <Icon
                    icon="weui:delete-outlined"
                    width="25"
                    height="25"
                    onClick={() => eliminarComponente(index)}
                    className="cursor-pointer mx-auto"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-1 space-y-4">
        <Autocomplete
          size="small"
          disablePortal
          options={filteredPerifericos}
          getOptionLabel={(option: Periferico) => option?.nombre || ""}
          onChange={handlePerifericoComponenteChange}
          value={nuevoComponente.periferico}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Periférico"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={marcasComponente}
          getOptionLabel={(option: Marca) => option?.nombre || ""}
          onChange={handleMarcaComponenteChange}
          value={nuevoComponente.marca}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Marca"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!nuevoComponente.periferico}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={modelosComponente}
          getOptionLabel={(option: Modelo) => option?.nombre || ""}
          onChange={handleModeloComponenteChange}
          value={nuevoComponente.modelo}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Modelo"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!nuevoComponente.marca}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={seriesComponente}
          getOptionLabel={(option: Serie) => option?.nombre || ""}
          onChange={handleSerieComponenteChange}
          value={nuevoComponente.serie}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Serie"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!nuevoComponente.modelo}
        />
        <TextField
          label="Inventario"
          placeholder="Inventario"
          variant="outlined"
          fullWidth
          size="small"
          value={nuevoComponente.inventario}
          onChange={(e) =>
            setNuevoComponente({
              ...nuevoComponente,
              inventario: e.target.value,
            })
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={agregarComponente}
          fullWidth
        >
          Agregar Componente
        </Button>
        {errorMensajeComponente && (
          <div className="text-red-500 mb-4">{errorMensajeComponente}</div>
        )}
      </div>
    </div>
  </div>
  )
};
