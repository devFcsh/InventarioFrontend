import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import {
  Marca,
  Modelo,
  Serie,
  SistemaOperativo,
  VersionSO,
  RAM,
  Disco,
  Dominio,
  VersionOffice,
  Aula,
  Edificio,
  Antivirus,
  Componente,
} from "../types";
import useMarcasPorPeriferico from "../hooks/useMarcasPorPeriferico";
import useDiscos from "../hooks/useDiscos";
import useDominios from "../hooks/useDominios";
import useRam from "../hooks/useRam";
import useSistemasOperativos from "../hooks/useSistemasOperativos";
import useVersionesSO from "../hooks/useVersionesSO";
import useVersionesOffice from "../hooks/useVersionesOffice";
import useEdificios from "../hooks/useEdificios";
import useAulas from "../hooks/useAulas";
import { antivirus, protocolos } from "../data";
import { Icon } from "@iconify/react";
import { useModelosPorMarcaPeriferico } from "../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../hooks/useSeriesPorModelo";
import usePerifericos from "../hooks/usePerifericos";
import useEditarActivo from "../hooks/useEditarActivo";
import axios from "axios";
import { useGestionarComponentes } from "../hooks/useGestionarComponentes";

interface EditarComputadoraActivoProps {
  equipo: any;
  idUsuario: string | null;
  componentes: Componente[];
}

const EditarComputadoraActivo = ({
  equipo,
  idUsuario,
  componentes,
}: EditarComputadoraActivoProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [componentesState, setComponentesState] = useState<Componente[]>(componentes);
  const [selectedSO, setSelectedSO] = useState<SistemaOperativo | null>(null);
  const [selectedVersionSO, setSelectedVersionSO] = useState<VersionSO | null>(
    null
  );
  const [selectedRAM, setSelectedRAM] = useState<RAM | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);
  const [selectedDominio, setSelectedDominio] = useState<Dominio | null>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [selectedVersionOffice, setSelectedVersionOffice] =
    useState<VersionOffice | null>(null);
  const [selectedAntivirus, setSelectedAntivirus] = useState<Antivirus | null>(
    null
  );
  const [nombreEquipo, setNombreEquipo] = useState<string>("");
  const [protocolo, setProtocolo] = useState<string>("1");
  const [direccionIP, setDireccionIP] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const [nuevoComponente, setNuevoComponente] = useState<Componente>({
    id_componente: undefined,
    periferico: null,
    marca: null,
    modelo: null,
    serie: null,
    inventario: "",
  });

  const { marcas } = useMarcasPorPeriferico(equipo?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipo?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { discos } = useDiscos();
  const { dominios } = useDominios();
  const { ram } = useRam();
  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO(selectedSO?.id_sistemaoperativo ?? "");
  const { versionesOffice } = useVersionesOffice();
  const { edificios } = useEdificios();
  const { aulas } = useAulas(selectedEdificio?.id_edificio ?? "");
  const { editarActivo } = useEditarActivo();
  const { gestionarComponentes } = useGestionarComponentes();
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (equipo) {
      setSelectedInventarioInv(equipo.inventario);
      setCurrentImagePath(equipo.imagenRuta);
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipo.id_marca) || null
      );
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipo.id_modelo) || null
      );
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipo.id_serie) || null
      );
      setSelectedSO(
        sistemasOperativos.find(
          (so) => so.id_sistemaoperativo === equipo.id_sistemaoperativo
        ) || null
      );
      setSelectedVersionSO(
        versionesSO.find(
          (version) => version.id_versionso === equipo.id_versionso
        ) || null
      );
      setSelectedRAM(
        ram.find((ramItem) => ramItem.id_ram === equipo.id_ram) || null
      );
      setSelectedDisco(
        discos.find((disco) => disco.id_disco === equipo.id_disco) || null
      );
      setSelectedDominio(
        dominios.find((dominio) => dominio.id_dominio === equipo.id_dominio) ||
          null
      );
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio.id_edificio === equipo.id_edificio
        ) || null
      );
      setSelectedAula(
        aulas.find((aula) => aula.id_aula === equipo.id_aula) || null
      );
      setSelectedVersionOffice(
        versionesOffice.find(
          (version) => version.id_versionoffice === equipo.id_versionoffice
        ) || null
      );
      setSelectedAntivirus(
        antivirus.find(
          (av) => Number(av.id_antivirus) === equipo.id_antivirus
        ) || null
      );
      setNombreEquipo(equipo.nombre_equipo);
      setDireccionIP(equipo.direccion_ip);
      setProtocolo(equipo.direccion_ip ? "0" : "1");
    }
  }, [equipo, marcas, modelos, series, ram, discos, dominios, versionesOffice]);

  const handleAddComponente = () => {
    if (
      nuevoComponente.periferico &&
      nuevoComponente.marca &&
      nuevoComponente.modelo &&
      nuevoComponente.serie &&
      nuevoComponente.inventario
    ) {
      const newComponent = { ...nuevoComponente };
      setComponentesState([...componentesState, newComponent]);
      setNuevoComponente({
        id_componente: undefined,
        periferico: null,
        marca: null,
        modelo: null,
        serie: null,
        inventario: "",
      });
    } else {
      alert(
        "Por favor, complete todos los campos antes de agregar el componente."
      );
    }
  };

  const eliminarComponente = (index: number) => {
    const updatedComponentes = componentesState.filter((_, i) => i !== index);
    setComponentesState(updatedComponentes);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditEquipo = async () => {
    let nuevaImagen = currentImagePath; 
    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/equipos/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        nuevaImagen = data.imagePath;
        setCurrentImagePath(nuevaImagen);
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
        alert("Error al cargar la imagen.");
        return;
      }
    }

    const payload = {
      id_ram: selectedRAM?.id_ram,
      id_disco: selectedDisco?.id_disco,
      id_versionso: selectedVersionSO?.id_versionso,
      id_versionoffice: selectedVersionOffice?.id_versionoffice,
      id_antivirus: selectedAntivirus?.id_antivirus,
      id_dominio: selectedDominio?.id_dominio,
      id_serie: selectedInventarioSerie?.id_serie,
      inventario: selectedInventarioInv,
      nombre_equipo: nombreEquipo,
      direccion_ip: protocolo === "0" ? direccionIP : "",
      id_usuario: idUsuario,
      id_aula: selectedAula?.id_aula,
      imagenRuta: image ? nuevaImagen : "",
    };
    try {
      await editarActivo(equipo.id_equipo, payload);

      if (componentesState.length > 0 && equipo.id_equipo) {
        await gestionarComponentes({
          equipoId: equipo.id_equipo,
          componentes: componentesState.map((comp) => ({
            id_componente: comp.id_componente,
            inventario: comp.inventario,
            serieId: Number(comp.serie?.id_serie) ?? 0,
          })),
          aulaId: Number(selectedAula?.id_aula) ?? 0,
          usuarioId: parseInt(idUsuario ?? "", 10),
          imagenRuta: nuevaImagen ?? "",
        });
        alert("Equipo actualizado con éxito");
      }
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Información de Inventario</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Autocomplete
          size="small"
          disablePortal
          options={marcas}
          value={selectedInventarioMarca}
          onChange={(_, newValue) => setSelectedInventarioMarca(newValue)}
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
          onChange={(_, newValue) => setSelectedInventarioModelo(newValue)}
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
          onChange={(_, newValue) => setSelectedInventarioSerie(newValue)}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Serie" variant="outlined" fullWidth />
          )}
          disabled
        />
        <TextField
          label="Inventario"
          variant="outlined"
          fullWidth
          size="small"
          value={selectedInventarioInv}
          onChange={(e) => setSelectedInventarioInv(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Autocomplete
          size="small"
          disablePortal
          options={sistemasOperativos}
          value={selectedSO}
          onChange={(_, newValue) => {
            setSelectedSO(newValue);
            setSelectedVersionSO(null);
          }}
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
          options={versionesSO}
          value={selectedVersionSO}
          onChange={(_, newValue) => setSelectedVersionSO(newValue)}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Versión SO"
              variant="outlined"
              fullWidth
            />
          )}
          disabled={!selectedSO}
        />

        <Autocomplete
          size="small"
          disablePortal
          options={antivirus}
          value={selectedAntivirus}
          onChange={(_, newValue) => setSelectedAntivirus(newValue)}
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
          options={versionesOffice}
          value={selectedVersionOffice}
          onChange={(_, newValue) => setSelectedVersionOffice(newValue)}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Versión Office"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={ram}
          value={selectedRAM}
          onChange={(_, newValue) => setSelectedRAM(newValue)}
          getOptionLabel={(option) => `${option.capacidad} - ${option.tipo}`}
          renderInput={(params) => (
            <TextField {...params} label="RAM" variant="outlined" fullWidth />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={discos}
          value={selectedDisco}
          onChange={(_, newValue) => setSelectedDisco(newValue)}
          getOptionLabel={(option) => option.capacidad}
          renderInput={(params) => (
            <TextField {...params} label="Disco" variant="outlined" fullWidth />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={protocolos}
          value={protocolos.find((p) => p.id === protocolo) || null}
          onChange={(_, newValue) => setProtocolo(newValue?.id || "1")}
          getOptionLabel={(option) => option.nombre}
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
          size="small"
          label="Dirección IP"
          value={direccionIP}
          onChange={(e) => setDireccionIP(e.target.value)}
          fullWidth
          variant="outlined"
          disabled={protocolo !== "0"}
        />
        <TextField
          size="small"
          label="Nombre Equipo"
          value={nombreEquipo}
          onChange={(e) => setNombreEquipo(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Autocomplete
          size="small"
          disablePortal
          options={dominios}
          value={selectedDominio}
          onChange={(_, newValue) => setSelectedDominio(newValue)}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dominio"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Autocomplete
          size="small"
          disablePortal
          options={edificios}
          value={selectedEdificio}
          onChange={(_, newValue) => {
            setSelectedEdificio(newValue);
            setSelectedAula(null);
          }}
          getOptionLabel={(option) => option.nombre}
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
          value={selectedAula}
          onChange={(_, newValue) => setSelectedAula(newValue)}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => (
            <TextField {...params} label="Aula" variant="outlined" fullWidth />
          )}
          disabled={!selectedEdificio}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Cargar Imagen</h2>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div
            onClick={handleImageClick}
            className="w-full max-w-sm h-48 border border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            ) : equipo.imagenRuta ? (
              <img
                src={`http://localhost:5000${equipo.imagenRuta}`}
                alt="Imagen del equipo"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">Haz clic para cargar una imagen</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-10">Componentes</h2>
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
              {componentesState.map((comp, index) => (
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
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, periferico: newValue })
              }
              value={nuevoComponente.periferico}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Periferico"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={marcasComponente}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, marca: newValue })
              }
              value={nuevoComponente.marca}
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
              options={modelosComponente}
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, modelo: newValue })
              }
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
              getOptionLabel={(option) => option?.nombre || ""}
              onChange={(e, newValue) =>
                setNuevoComponente({ ...nuevoComponente, serie: newValue })
              }
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
              onClick={handleAddComponente}
              fullWidth
            >
              Agregar Componente
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditEquipo}
          fullWidth
        >
          Editar Activo
        </Button>
        <Button variant="outlined" color="primary" onClick={() => {}} fullWidth>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default EditarComputadoraActivo;
