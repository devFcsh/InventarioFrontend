import { Autocomplete, Box, TextField } from "@mui/material";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
import { useState } from "react";
import {
  SistemaOperativo,
  Dominio,
  Antivirus,
  VersionOffice,
  RAM,
  Disco,
  VersionSO
} from "../../../../../../../types";
import useDominios from "@hooks/useDominios";
import { antivirus, protocolos } from "../../../../../../../data";
import useVersionesOffice from "@hooks/useVersionesOffice";
import useRam from "@hooks/useRam";
import useDiscos from "@hooks/useDiscos";
import useVersionesSO from "@hooks/useVersionesSO";

export const StepInformacionGeneral = () => {
  const [selectedSO, setSelectedSO] = useState<SistemaOperativo | null>(null);
  const [selectedVersionSO, setSelectedVersionSO] = useState<VersionSO | null>(null);
  const [selectedDominio, setSelectedDominio] = useState<Dominio | null>(null);
  const [nombreEquipo, setNombreEquipo] = useState<string | null>("");
  const [selectedVersionOffice, setSelectedVersionOffice] =useState<VersionOffice | null>(null);
  const [protocolo, setProtocolo] = useState<string | null>("");
  const [direccionIP, setDireccionIP] = useState<string>("");
  const [selectedAntivirus, setSelectedAntivirus] = useState<Antivirus | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<RAM | null>(null);
  const [selectedDisco, setSelectedDisco] = useState<Disco | null>(null);
  
  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO(selectedSO?.id_sistemaoperativo ?? "");
  const { dominios } = useDominios();
  const { versionesOffice } = useVersionesOffice();
  const { ram } = useRam();
  const { discos } = useDiscos();
  return (
    <Box>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          <Autocomplete
            size="small"
            disablePortal
            options={sistemasOperativos}
            getOptionLabel={(option) => option.nombre}
            value={selectedSO}
            onChange={(_, newValue) => setSelectedSO(newValue)}
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
            getOptionLabel={(option) => option.nombre}
            value={selectedVersionSO}
            onChange={(_, newValue) => setSelectedVersionSO(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Versión SO"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={dominios}
            getOptionLabel={(option) => option.nombre}
            value={selectedDominio}
            onChange={(_, newValue) => setSelectedDominio(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Dominio"
                variant="outlined"
                fullWidth
              />
            )}
          />
          <TextField
            label="Nombre Equipo"
            placeholder="Nombre Equipo"
            variant="outlined"
            fullWidth
            size="small"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={versionesOffice}
            getOptionLabel={(option) => option.nombre}
            value={selectedVersionOffice}
            onChange={(_, newValue) => setSelectedVersionOffice(newValue)}
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
            options={protocolos}
            getOptionLabel={(option) => option.nombre}
            value={protocolos.find((p) => p.id === protocolo) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setProtocolo(newValue.id);
              } else {
                setProtocolo("1");
              }
            }}
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
            disabled={protocolo !== "0"}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={antivirus}
            getOptionLabel={(option) => option.nombre}
            value={selectedAntivirus}
            onChange={(_, newValue) => setSelectedAntivirus(newValue)}
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
            options={ram}
            getOptionLabel={(option: RAM) =>
              `${option.capacidad} - ${option.tipo}`
            }
            value={selectedRAM}
            onChange={(_, newValue) => setSelectedRAM(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="RAM" variant="outlined" fullWidth />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={discos}
            getOptionLabel={(option) => option.capacidad}
            value={selectedDisco}
            onChange={(_, newValue) => setSelectedDisco(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Disco"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </div>
      </div>
    </Box>
  );
};
