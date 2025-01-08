import { Autocomplete, Box, FormHelperText, TextField } from "@mui/material";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
import {
  SistemaOperativo,
  Dominio,
  Antivirus,
  VersionOffice,
  RAM,
  Disco,
  VersionSO
} from "../../../types/index";
import useDominios from "@hooks/useDominios";
import { antivirus, protocolos } from "@data/index";
import useVersionesOffice from "@hooks/useVersionesOffice";
import useRam from "@hooks/useRam";
import useDiscos from "@hooks/useDiscos";
import useVersionesSO from "@hooks/useVersionesSO";

interface StepInformacionGeneralProps {
  informacionGeneralDataForm:any;
  handleInformacionGeneralChange: any;
  informacionGeneralErrors: any;
  handleUniqueInformacionGeneralError:any
}

export const StepInformacionGeneral = ({
  informacionGeneralDataForm,
  handleInformacionGeneralChange,
  informacionGeneralErrors,
  handleUniqueInformacionGeneralError
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
              handleUniqueInformacionGeneralError("sistemaOperativo",newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sistema Operativo"
                variant="outlined"
                error={!!informacionGeneralErrors.sistemaOperativo}
                helperText={informacionGeneralErrors.sistemaOperativo? "Por favor seleccionar un sistema operativo" :""}
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
              handleUniqueInformacionGeneralError("versionSO",newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Versión SO"
                variant="outlined"
                error={!!informacionGeneralErrors.versionSO}
                helperText={informacionGeneralErrors.versionSO? "Por favor seleccionar una versión del sistema operativo" :""}
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
              handleUniqueInformacionGeneralError("dominio",newValue);
            }}
            
            renderInput={(params) => (
              <TextField
                {...params}
                label="Dominio"
                variant="outlined"
                error={!!informacionGeneralErrors.dominio}
                helperText={informacionGeneralErrors.dominio? "Por favor seleccionar un dominio" :""}
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
            error={!!informacionGeneralErrors.nombreEquipo}
            helperText={informacionGeneralErrors.nombreEquipo? "Por favor escribir un nombre del equipo" :""}
            onChange={(e) => {
              handleInformacionGeneralChange("nombreEquipo", e.target.value)
              handleUniqueInformacionGeneralError("nombreEquipo",e.target.value);}}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={versionesOffice}
            getOptionLabel={(option) => option ? option.nombre : ""}
            value={informacionGeneralDataForm.versionOffice}
            onChange={(_, newValue: VersionOffice | null) => {
              handleInformacionGeneralChange("versionOffice", newValue);
              handleUniqueInformacionGeneralError("versionOffice",newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Versión Office"
                variant="outlined"
                error={!!informacionGeneralErrors.versionOffice}
                helperText={informacionGeneralErrors.versionOffice? "Por favor seleccionar una version de office" :""}
                fullWidth
              />
            )}
          />
          <Box       sx={{
        display: 'inline-flex'
      }}>
            <Autocomplete
              size="small"
              disablePortal
              sx={{width:"50%"}}
              options={protocolos}
              getOptionLabel={(option) => option ? option.nombre : ""}
              value={protocolos.find((p) => p.id === informacionGeneralDataForm.protocolo) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleInformacionGeneralChange("protocolo",newValue.id);   
                  handleUniqueInformacionGeneralError("protocolo",newValue.id);
                } else {
                  handleInformacionGeneralChange("protocolo","1");
                  handleUniqueInformacionGeneralError("protocolo","1");
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Protocolo"
                  variant="outlined"
                  error={!!informacionGeneralErrors.protocolo}
                  helperText={informacionGeneralErrors.protocolo? "Por favor seleccionar un protocolo" :""}
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
    error={!!informacionGeneralErrors.direccionIP}
    onChange={(e) => {
      handleInformacionGeneralChange("direccionIP", e.target.value);
      handleUniqueInformacionGeneralError("direccionIP", e.target.value);
    }}
    disabled={informacionGeneralDataForm.protocolo !== "0"}
    sx={{ marginRight: 4 ,width:"50%"}}
  />
  {informacionGeneralErrors.direccionIP && (
    <FormHelperText error sx={{ marginLeft: "auto", color: "green" }}>
      Por favor escribir una dirección IP válida
    </FormHelperText>
  )}

          </Box>
          <Autocomplete
            size="small"
            disablePortal
            options={antivirus}
            getOptionLabel={(option) => option.nombre}
            value={informacionGeneralDataForm.antivirus}
            onChange={(_, newValue: Antivirus | null) => {
              handleInformacionGeneralChange("antivirus", newValue);
              handleUniqueInformacionGeneralError("antivirus",newValue);
              
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Antivirus"
                variant="outlined"
                error={!!informacionGeneralErrors.antivirus}
                helperText={informacionGeneralErrors.antivirus? "Por favor seleccionar un antivirus" :""}
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
              handleUniqueInformacionGeneralError("ram",newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="RAM" variant="outlined" fullWidth
              error={!!informacionGeneralErrors.ram}
              helperText={informacionGeneralErrors.ram? "Por favor seleccionar el tamaño de la ram" :""}/>
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
              handleUniqueInformacionGeneralError("disco",newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Disco"
                variant="outlined"
                error={!!informacionGeneralErrors.disco}
                helperText={informacionGeneralErrors.disco? "Por favor seleccionar el tamaño del disco" :""}
                fullWidth
              />
            )}
          />
        </div>
      </div>
    </Box>
  );
};
