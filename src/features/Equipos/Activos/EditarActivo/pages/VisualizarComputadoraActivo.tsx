import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, TextField, Button, Box } from "@mui/material";
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
  Ubicacion,
  Edificio,
  Antivirus,
  Procesador,
} from "../../../../../types";
import { ActivoComputadoraEdit } from "../../../../../types/Activo";
import { Componente } from "../../../../../types/Activo/Componente";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import useDiscos from "../../../../../hooks/useDiscos";
import useDominios from "../../../../../hooks/useDominios";
import useRam from "../../../../../hooks/useRam";
import useSistemasOperativos from "../../../../../hooks/useSistemasOperativos";
import useVersionesSO from "../../../../../hooks/useVersionesSO";
import useVersionesOffice from "../../../../../hooks/useVersionesOffice";
import useEdificios from "../../../../../hooks/useEdificios";
import useUbicaciones from "../../../../../hooks/useUbicaciones";
import { antivirus, protocolos, IMAGE_BASE_URL } from "../../../../../data";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import { useNavigate } from "react-router-dom";
import useProcesadores from "@hooks/useProcesadores";
import { useUser } from "@context/userContext";

interface VisualizarComputadoraActivoProps {
  equipo: ActivoComputadoraEdit;
  componentes: Componente[];
  onOpenMantenimientos?: () => void;
  equipoId?: string;
  equipoName?: string;
}

const VisualizarComputadoraActivo = ({
  equipo,
  componentes,
  onOpenMantenimientos,
}: VisualizarComputadoraActivoProps) => {
  const { rol } = useUser();
  const unableAction = rol !== "administrador" && rol !== "editor";
  
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [selectedInventarioAnio, setSelectedInventarioAnio] =
    useState<string>("");
  const [selectedSO, setSelectedSO] = useState<SistemaOperativo | null>(null);
  const [selectedVersionSO, setSelectedVersionSO] = useState<VersionSO | null>(
    null
  );
  const [selectedRAM, setSelectedRAM] = useState<RAM | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);
  const [selectedProcesador, setSelectedProcesador] =
    useState<Procesador | null>(null);
  const [selectedDominio, setSelectedDominio] = useState<Dominio | null>(null);
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(
    null
  );
  const [selectedVersionOffice, setSelectedVersionOffice] =
    useState<VersionOffice | null>(null);
  const [selectedAntivirus, setSelectedAntivirus] = useState<Antivirus | null>(
    null
  );
  const navigate = useNavigate();
  const [nombreEquipo, setNombreEquipo] = useState<string>("");
  const [protocolo, setProtocolo] = useState<string>("");
  const [direccionIP, setDireccionIP] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [newObservation, setNewObservation] = useState<string>("");
  const [empresa, setEmpresa] = useState<string | null>("");
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
  const { procesadores } = useProcesadores();
  const { dominios } = useDominios();
  const { ram } = useRam();
  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO(selectedSO?.id_sistemaoperativo ?? "");
  const { versionesOffice } = useVersionesOffice();
  const { edificios } = useEdificios();
  const { ubicaciones } = useUbicaciones(selectedEdificio?.id_edificio ?? "");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (equipo && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipo.id_marca) || null
      );
    }
  }, [equipo, marcas]);

  useEffect(() => {
    if (equipo && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipo.id_modelo) || null
      );
    }
  }, [equipo, modelos]);

  useEffect(() => {
    if (equipo && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipo.id_serie) || null
      );
    }
  }, [equipo, series]);

  useEffect(() => {
    if (equipo && sistemasOperativos.length > 0) {
      setSelectedSO(
        sistemasOperativos.find(
          (so) => so?.id_sistemaoperativo === equipo.id_sistemaoperativo
        ) || null
      );
    }
  }, [equipo, sistemasOperativos]);

  useEffect(() => {
    if (equipo && versionesSO.length > 0) {
      setSelectedVersionSO(
        versionesSO.find(
          (version) => version?.id_versionso === equipo.id_versionso
        ) || null
      );
    }
  }, [equipo, versionesSO]);

  useEffect(() => {
    if (equipo && ram.length > 0) {
      setSelectedRAM(
        ram.find((ramItem) => ramItem?.id_ram === equipo.id_ram) || null
      );
    }
  }, [equipo, ram]);

  useEffect(() => {
    if (equipo && discos.length > 0) {
      setSelectedDisco(
        discos.find((disco) => disco?.id_disco === equipo.id_disco) || null
      );
    }
  }, [equipo, discos]);

  useEffect(() => {
    if (equipo && procesadores.length > 0) {
      setSelectedProcesador(
        procesadores.find(
          (procesador) => procesador?.id_procesador === equipo.id_procesador
        ) || null
      );
    }
  }, [equipo, procesadores]);

  useEffect(() => {
    if (equipo && dominios.length > 0) {
      setSelectedDominio(
        dominios.find((dominio) => dominio?.id_dominio === equipo.id_dominio) ||
          null
      );
    }
  }, [equipo, dominios]);

  useEffect(() => {
    if (equipo && edificios.length > 0) {
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio?.id_edificio === equipo.id_edificio
        ) || null
      );
    }
  }, [equipo, edificios]);

  useEffect(() => {
    if (equipo && ubicaciones.length > 0) {
      setSelectedUbicacion(
        ubicaciones.find(
          (ubicacion) => ubicacion?.id_ubicacion === equipo.id_ubicacion
        ) || null
      );
    }
  }, [equipo, ubicaciones]);

  useEffect(() => {
    if (equipo && antivirus.length > 0) {
      setSelectedAntivirus(
        antivirus.find(
          (av) => Number(av.id_antivirus) === equipo.id_antivirus
        ) || null
      );
    }
  }, [equipo]);

  useEffect(() => {
    if (equipo && versionesOffice.length > 0) {
      setSelectedVersionOffice(
        versionesOffice.find(
          (version) => version?.id_versionoffice === equipo.id_versionoffice
        ) || null
      );
    }
  }, [equipo, versionesOffice]);

  useEffect(() => {
    if (equipo) {
      setSelectedInventarioInv(equipo.inventario);
      setSelectedInventarioAnio(equipo.anio_compra);
      setNombreEquipo(equipo.nombre_equipo);
      setDireccionIP(equipo.direccion_ip);
      setProtocolo(equipo.direccion_ip ? "0" : "1");
      setNewObservation(equipo.observacion);
      
      // Normalizar empresa a minúsculas para comparación y ajustar formato
      const empresaNormalizada = equipo.empresa?.toLowerCase();
      if (empresaNormalizada === "espol") {
        setEmpresa("Espol");
      } else if (empresaNormalizada === "espoltech") {
        setEmpresa("EspolTech");
      } else {
        // Fallback al método anterior solo si no hay empresa
        equipo.inventario.length === 10 || equipo.inventario.length === 12
          ? setEmpresa("EspolTech")
          : setEmpresa("Espol");
      }
    }
  }, [equipo]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleConfirmSalir = () => {
    navigate("/activos");
  };

  return (
    <div>
      {onOpenMantenimientos && (
        <div className="flex justify-end mb-5">
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenMantenimientos}
            disabled={unableAction}
          >
            Ver Mantenimientos
          </Button>
        </div>
      )}
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
          options={sistemasOperativos}
          value={selectedSO}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Sistema Operativo"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />

        <Autocomplete
          size="small"
          disablePortal
          options={versionesSO}
          value={selectedVersionSO}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Versión SO"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />

        <Autocomplete
          size="small"
          disablePortal
          options={antivirus}
          value={selectedAntivirus}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Antivirus"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={versionesOffice}
          value={selectedVersionOffice}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Versión Office"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={ram}
          value={selectedRAM}
          getOptionLabel={(option) => `${option?.capacidad} - ${option?.tipo}`}
          renderInput={(params) => (
            <TextField {...params} label="RAM" variant="outlined" fullWidth />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={discos}
          value={selectedDisco}
          getOptionLabel={(option) => (option ? option.capacidad : "")}
          renderInput={(params) => (
            <TextField {...params} label="Disco" variant="outlined" fullWidth />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={procesadores}
          value={selectedProcesador}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Procesador"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
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
            options={protocolos}
            value={protocolos.find((p) => p.id === protocolo) || null}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Protocolo"
                variant="outlined"
                fullWidth
              />
            )}
            disabled
          />

          <TextField
            label="Dirección IP"
            placeholder="Dirección IP"
            variant="outlined"
            fullWidth
            size="small"
            value={direccionIP}
            disabled
            sx={{ marginRight: 4, width: "50%" }}
          />
        </Box>
        <TextField
          size="small"
          label="Nombre Equipo"
          value={nombreEquipo}
          fullWidth
          variant="outlined"
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={dominios}
          value={selectedDominio}
          getOptionLabel={(option) => (option ? option.nombre : "")}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dominio"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />
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
              label="Ubicacion"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />
      </div>

      <div className="mb-4 flex gap-8 items-start">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-5">Imagen</h2>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
              disabled
            />
            <div className="w-full max-w-sm h-48 border border-dashed border-gray-300 flex items-center justify-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : equipo.imagenRuta ? (
                <img
                  src={`${IMAGE_BASE_URL.replace(/\/$/, '')}/${equipo.imagenRuta.replace(/^\//, '')}`}
                  alt="Imagen del equipo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-500">Sin imagen</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-semibold mb-5">Componentes</h2>
          <div className="flex-1 overflow-x-auto w-full flex justify-center">
            <table className="min-w-[600px] border-collapse border border-gray-300">
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
                {componentes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 px-4 text-gray-500"
                    >
                      No hay componentes disponibles.
                    </td>
                  </tr>
                ) : (
                  componentes.map((comp, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">
                        {comp.periferico?.nombre}
                      </td>
                      <td className="py-2 px-4 border">{comp.marca?.nombre}</td>
                      <td className="py-2 px-4 border">
                        {comp.modelo?.nombre}
                      </td>
                      <td className="py-2 px-4 border">
                        {typeof comp.serie === "object" &&
                        comp.serie !== null &&
                        "nombre" in comp.serie
                          ? (comp.serie as { nombre: string }).nombre
                          : comp.serie}
                      </td>
                      <td className="py-2 px-4 border">{comp.inventario}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
          value={newObservation}
          disabled
        />
      </div>
      <div className="flex gap-4 mt-10">
        <Button
          onClick={handleConfirmSalir}
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

export default VisualizarComputadoraActivo;
