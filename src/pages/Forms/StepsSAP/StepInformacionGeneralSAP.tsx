import { Box, TextField } from "@mui/material";

interface StepInformacionGeneralProps {
  periferico: string;
  informacionGeneralDataSAPForm: any;
  handleInformacionGeneralSAPChange: any;
  informacionGeneralSAPErrors: any;
  handleUniqueInformacionGeneralError: any;
}

export const StepInformacionGeneralSAP = ({
  periferico,
  informacionGeneralDataSAPForm,
  handleInformacionGeneralSAPChange,
  informacionGeneralSAPErrors,
  handleUniqueInformacionGeneralError,
}: StepInformacionGeneralProps) => {
  return (
    <Box>
      <div className="mt-8">
        <div className="grid grid-cols-2 gap-4">
        <TextField
            label="Nombre Equipo"
            placeholder="Nombre Equipo"
            variant="outlined"
            fullWidth
            size="small"
            value={informacionGeneralDataSAPForm.nombreEquipo}
            error={!!informacionGeneralSAPErrors.nombreEquipo}
            helperText={
              informacionGeneralSAPErrors.nombreEquipo
                ? "Por favor escribir un nombre del equipo"
                : ""
            }
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (value !== null && value.length > 14) {
                return
              }
              handleInformacionGeneralSAPChange("nombreEquipo",value);
              handleUniqueInformacionGeneralError("nombreEquipo",value);
            }}
          />
          <TextField
            label="MAC"
            placeholder="MAC"
            variant="outlined"
            fullWidth
            size="small"
            value={informacionGeneralDataSAPForm.mac}
            error={!!informacionGeneralSAPErrors.mac}
            helperText={
              informacionGeneralSAPErrors.mac
                ? "Por favor escribir una dirección MAC válida"
                : ""
            }
            onChange={(e) => {
              const value = e.target.value.toUpperCase();

              if (value !== null && value.length > 17) {
                return;
              }

              handleInformacionGeneralSAPChange("mac", value);
              handleUniqueInformacionGeneralError("mac", value);
            }}
          />
          {periferico !== "AP" ? (
            <>
              <TextField
                label="Puertos 10-100-1000"
                placeholder="Puertos"
                variant="outlined"
                fullWidth
                size="small"
                value={informacionGeneralDataSAPForm.puertos}
                error={!!informacionGeneralSAPErrors.puertos}
                helperText={
                  informacionGeneralSAPErrors.puertos
                    ? "Por favor escribir un puerto válido"
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;

                  if (value !== null && value.length > 10) {
                    return;
                  }

                  handleInformacionGeneralSAPChange("puertos", value);
                  handleUniqueInformacionGeneralError("puertos", value);
                }}
              />
              <TextField
                label="Puerto FTP"
                placeholder="Puerto FTP"
                variant="outlined"
                fullWidth
                size="small"
                value={informacionGeneralDataSAPForm.puertoFTP}
                error={!!informacionGeneralSAPErrors.puertoFTP}
                helperText={
                  informacionGeneralSAPErrors.puertoFTP
                    ? "Por favor escribir un puerto FTP válido"
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;

                  if (value !== null && value.length > 10) {
                    return;
                  }

                  handleInformacionGeneralSAPChange("puertoFTP", value);
                  handleUniqueInformacionGeneralError("puertoFTP", value);
                }}
              />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </Box>
  );
};
