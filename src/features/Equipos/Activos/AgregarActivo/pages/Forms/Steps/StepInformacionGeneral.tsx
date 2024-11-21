import { Autocomplete, Box, TextField } from "@mui/material";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
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

interface StepInformacionGeneralProps {
  informacionGeneralDataForm:any;
  handleInformacionGeneralChange: any;
}

export const StepInformacionGeneral = ({
  informacionGeneralDataForm,
  handleInformacionGeneralChange,
}: StepInformacionGeneralProps) => {

  const { sistemasOperativos } = useSistemasOperativos();
  const { versionesSO } = useVersionesSO(informacionGeneralDataForm.sistemaOperativo?.id_sistemaoperativo ?? "");
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
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={informacionGeneralDataForm.sistemaOperativo}
            onChange={(_, newValue: SistemaOperativo | null) => {
              handleInformacionGeneralChange("sistemaOperativo", newValue);
            }}
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
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={informacionGeneralDataForm.versionSO}
            onChange={(_, newValue: VersionSO | null) => {
              handleInformacionGeneralChange("versionSO", newValue);
            }}
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
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={informacionGeneralDataForm.dominio}
            onChange={(_, newValue: Dominio | null) => {
              handleInformacionGeneralChange("dominio", newValue);
            }}
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
            value={informacionGeneralDataForm.nombreEquipo}
            onChange={(e) => {
              handleInformacionGeneralChange("nombreEquipo", e.target.value)}}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={versionesOffice}
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={informacionGeneralDataForm.versionOffice}
            onChange={(_, newValue: VersionOffice | null) => {
              handleInformacionGeneralChange("versionOffice", newValue);
            }}
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
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={protocolos.find((p) => p.id === informacionGeneralDataForm.protocolo) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                handleInformacionGeneralChange("protocolo",newValue.id);
              } else {
                handleInformacionGeneralChange("protocolo","1");
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
            value={informacionGeneralDataForm.direccionIP}
            onChange={(e) => {handleInformacionGeneralChange("direccionIP",e.target.value)}}
            disabled={informacionGeneralDataForm.protocolo !== "0"}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={antivirus}
            getOptionLabel={(option) => option.nombre}
            value={informacionGeneralDataForm.antivirus}
            onChange={(_, newValue: Antivirus | null) => {
              handleInformacionGeneralChange("antivirus", newValue);
            }}
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
            getOptionLabel={(option: RAM) =>option ?
              `${option.capacidad} - ${option.tipo}` : ""
            }
            value={informacionGeneralDataForm.ram}
            onChange={(_, newValue: RAM | null) => {
              handleInformacionGeneralChange("ram", newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="RAM" variant="outlined" fullWidth />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={discos}
            getOptionLabel={(option) =>option ? option.capacidad : ""}
            value={informacionGeneralDataForm.disco}
            onChange={(_, newValue: Disco | null) => {
              handleInformacionGeneralChange("disco", newValue);
            }}
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
