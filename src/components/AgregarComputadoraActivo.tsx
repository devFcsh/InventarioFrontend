import { Autocomplete, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useModelosPorMarcaPeriferico } from "../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../hooks/useSeriesPorModelo";
import { Marca, Modelo, Serie, Componente, Periferico } from "../types";
import useMarcasPorPeriferico from "../hooks/useMarcasPorPeriferico";
import usePerifericos from "../hooks/usePerifericos";

interface AgregarComputadoraActivoProps {
  periferico: string;
  idUso: string | null;
  idUsuario: string | null;
}

const AgregarComputadoraActivo = ({
  periferico,
  idUso,
  idUsuario,
}: AgregarComputadoraActivoProps) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedInventarioMarca, setSelectedInventarioMarca] = useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] = useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] = useState<Serie | null>(null);
  
  const [nuevoComponente, setNuevoComponente] = useState<Componente>({
    periferico: null,
    marca: null,
    modelo: null,
    serie: null,
    inventario: "",
  });
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [protocolo, setProtocolo] = useState<string | null>(null);
  const [direccionIP, setDireccionIP] = useState<string>("");

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

  const { perifericos } = usePerifericos();
  const filteredPerifericos = perifericos.filter(
    (p) =>
      p?.nombre.toLowerCase() !== "computadora" &&
      p?.nombre.toLowerCase() !== "laptop"
  );
  const { marcas: marcasComponente } = useMarcasPorPeriferico(
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const { modelos: modelosComponente } = useModelosPorMarcaPeriferico(
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.periferico?.id_periferico ?? ""
  );
  const { series: seriesComponente } = useSeriesPorModelo(
    nuevoComponente.periferico?.id_periferico ?? "",
    nuevoComponente.marca?.id_marca ?? "",
    nuevoComponente.modelo?.id_modelo ?? ""
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const limpiarCamposDependientesComponente = () => {
    setNuevoComponente({
      ...nuevoComponente,
      periferico: null,
      marca: null,
      modelo: null,
      serie: null,
    });
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
    } else {
      alert("Por favor, complete todos los campos del componente.");
    }
  };

  const handleAgregarEquipo = () => {
    if (componentes.length > 0 && protocolo && direccionIP !== "") {
      console.log("Componentes:", componentes);
      console.log("Protocolo:", protocolo);
      console.log("Dirección IP:", direccionIP);
      console.log("Imagen:", image);
    } else {
      alert("Por favor, complete todos los campos del equipo.");
    }
  };

  useEffect(() => {
    setSelectedInventarioMarca(null);
    setSelectedInventarioModelo(null);
    setSelectedInventarioSerie(null);
  }, [periferico])

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
  };

  const handlePerifericoComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Periferico | null
  ) => {
    setNuevoComponente({ ...nuevoComponente, periferico: newValue, marca: null, modelo: null, serie: null});
  };

  const handleMarcaComponenteChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Marca | null
  ) => {
    setNuevoComponente({ ...nuevoComponente, marca: newValue, modelo: null, serie: null });

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

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">
          Información de Inventario
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option: Marca) => option?.nombre || ""}
            onChange={handleMarcaChange}
            value={selectedInventarioMarca}
            renderInput={(params) => (
              <TextField {...params} label="Marca" variant="outlined" fullWidth />
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
              <TextField {...params} label="Modelo" variant="outlined" fullWidth />
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
            value={nuevoComponente.inventario}
            onChange={(e) =>
              setNuevoComponente({
                ...nuevoComponente,
                inventario: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Información General</h2>
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            size="small"
            disablePortal
            options={[
              { id: "1", nombre: "Windows" },
              { id: "2", nombre: "Linux" },
            ]}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sistema Operativo"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={[
              { id: "1", nombre: "Office 2019" },
              { id: "2", nombre: "Office 365" },
            ]}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Versión Sistema Operativo"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={[
              { id: "1", nombre: "Antivirus A" },
              { id: "2", nombre: "Antivirus B" },
            ]}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Antivirus"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={[
              { id: "1", nombre: "8GB" },
              { id: "2", nombre: "16GB" },
            ]}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cantidad RAM"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={[
              { id: "1", nombre: "DDR4" },
              { id: "2", nombre: "DDR5" },
            ]}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo RAM"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={[
              { id: "1", nombre: "Estático" },
              { id: "2", nombre: "Dinámico" },
            ]}
            getOptionLabel={(option) => option.nombre}
            value={protocolo ? { nombre: protocolo } : null}
            onChange={(event, newValue) =>
              setProtocolo(newValue ? newValue.nombre : "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Protocolo"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <TextField
            label="Dirección IP"
            placeholder="Dirección IP"
            variant="outlined"
            fullWidth
            size="small"
            value={direccionIP}
            onChange={(e) => setDireccionIP(e.target.value)}
            disabled={protocolo !== "Estático"}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={[
              { id: "1", nombre: "500GB" },
              { id: "2", nombre: "1TB" },
            ]}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Almacenamiento Disco"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <TextField
            label="Dominio"
            placeholder="Dominio"
            variant="outlined"
            fullWidth
            size="small"
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Cargar Imagen</h2>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          <div className="w-full flex justify-center">
            <img
              src={image ? image.toString() : "https://via.placeholder.com/150"}
              alt="Vista previa"
              className="w-full max-w-xs h-auto object-cover border border-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Componentes</h2>
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
                <TextField {...params} label="Periférico" variant="outlined" fullWidth />
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
                <TextField {...params} label="Marca" variant="outlined" fullWidth />
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
                <TextField {...params} label="Modelo" variant="outlined" fullWidth />
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
                <TextField {...params} label="Serie" variant="outlined" fullWidth />
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
                setNuevoComponente({ ...nuevoComponente, inventario: e.target.value })
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
          </div>
        </div>
      </div>

      <div className="flex gap-4">
      <Button
          variant="contained"
          color="primary"
          onClick={handleAgregarEquipo}
          fullWidth
        >
          Agregar Equipo
        </Button>
        <Button variant="outlined" color="primary" fullWidth>
          Cancelar
        </Button>
      </div>
    </>
  );
};

export default AgregarComputadoraActivo;
