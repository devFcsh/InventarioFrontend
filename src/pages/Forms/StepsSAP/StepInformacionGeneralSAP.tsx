import { Box, TextField } from "@mui/material";

interface StepInformacionGeneralProps {
  periferico:string;
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
              let value = e.target.value.toUpperCase();
              
              if (value !== null && value.length > 17) {
                return
              }
            
              handleInformacionGeneralSAPChange("mac", value);
              handleUniqueInformacionGeneralError("mac", value);
            }}
            
          />
          {periferico!=="AP"?
          <>
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
              let value = e.target.value;
              
              if (value !== null && value.length > 10) {
                return
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
              let value = e.target.value;
              
              if (value !== null && value.length > 10) {
                return
              }
            
              handleInformacionGeneralSAPChange("puertoFTP", value);
              handleUniqueInformacionGeneralError("puertoFTP", value);
            }}
          />
          </>
            
          :""}
          
        </div>
      </div>
    </Box>
  );
};
