import { Box, TextField } from "@mui/material";

interface StepInformacionGeneralProps {
  informacionGeneralDataSAPForm: any;
  handleInformacionGeneralSAPChange: any;
  informacionGeneralSAPErrors: any;
  handleUniqueInformacionGeneralError: any;
}

export const StepInformacionGeneralSAP = ({
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
              handleInformacionGeneralSAPChange("mac", e.target.value);
              handleUniqueInformacionGeneralError("mac", e.target.value);
            }}
          />
          <TextField
            label="Puertos"
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
              handleInformacionGeneralSAPChange("puertos", e.target.value);
              handleUniqueInformacionGeneralError("puertos", e.target.value);
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
              handleInformacionGeneralSAPChange("puertoFTP", e.target.value);
              handleUniqueInformacionGeneralError("puertoFTP", e.target.value);
            }}
          />
        </div>
      </div>
    </Box>
  );
};
