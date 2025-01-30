import { useState, Fragment } from "react";
import { Box, Stepper, Step, StepLabel, Button } from "@mui/material";
import { StepDatosInventarioSAP, StepInformacionGeneralSAP } from "./StepsSAP/index.ts"
import { useLocation, useNavigate } from "react-router-dom";
import { Periferico, Edificio } from "../../types/index.ts";
import { useAgregarRedActivo } from "../../features/Equipos/Activos/AgregarActivo/hooks/useAgregarRedActivo.ts";
import {useFormDatosInventarioSAP,useFormDataInformacionGeneralSAP,useInventoryErrorsSAP,useInformacionGeneralErrorSAP} from "./StepsSAP/hooks/index.ts"
// import { useAgregarComputadoraBodega } from "../../features/Equipos/Bodega/AgregarEquipoBodega/hooks/useAgregarComputadoraBodega.ts";
// import { useAgregarComponentesBodega } from "../../features/Equipos/Bodega/AgregarEquipoBodega/hooks/useAgregarComponentesBodega.ts";
import { ModalObservation } from "./components/ModalObservation.tsx";
import {useCargarImagenErrors,useFormDataCargarImagen} from "./hooks/index.ts"
import {StepCargarImagen} from "./Steps/StepCargarImagen.tsx"
export const FormSAP = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const selectedPeriferico = location.state?.periferico as
    | Periferico
    | undefined;
  const selectedEdificio = location.state?.edificio as
    | Edificio
    | undefined;
  const [openModalObservation, setOpenModalObservation] = useState(false);
  const [observation, setObservation] = useState("")
  const perifericos = location.state?.perifericos as Periferico[];
  const tipoInventario = location.state?.tipoInventario;
  const steps = location.state?.steps;
  const { agregarRedActivo } = useAgregarRedActivo();
  // const { agregarComputadoraBodega } = useAgregarComputadoraBodega();
  const { inventoryDataSAPForm, handleInventorySAPChange } = useFormDatosInventarioSAP();
  // const { agregarComponentesBodega } = useAgregarComponentesBodega();
  const { informacionGeneralDataSAPForm, handleInformacionGeneralSAPChange } = useFormDataInformacionGeneralSAP();
  const { imageData, handleImageChange, error } = useFormDataCargarImagen();
  const { inventorySAPErrors, completeDatosInventario, handleInventorySAPErrors, handleUniqueInventarioSAPError } = useInventoryErrorsSAP(tipoInventario);
  const { informacionGeneralSAPErrors, handleInformacionGeneralSAPErrors, handleUniqueInformacionGeneralError, completeDatosInformacionGeneral } = useInformacionGeneralErrorSAP(selectedPeriferico?.nombre);
  const { cargarImagenErrors, handleCargarImagenErrors, handleUniqueCargarImagenError, completeDatosCargarImagen } = useCargarImagenErrors();

  const handleNext = () => {
    if (activeStep === 0) {
      handleInventorySAPErrors(inventoryDataSAPForm);
      if (!Object.values(inventorySAPErrors).includes(true) && completeDatosInventario(inventoryDataSAPForm)) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
    if (activeStep === 1) {
      handleInformacionGeneralSAPErrors(informacionGeneralDataSAPForm);
      if (!Object.values(informacionGeneralSAPErrors).includes(true) && completeDatosInformacionGeneral(informacionGeneralDataSAPForm)) {
        if(tipoInventario==="activo"){
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }else{
          setActiveStep(3);
        }
      }

    }
    if (activeStep === 2) {
      handleCargarImagenErrors(imageData);
      if (!Object.values(cargarImagenErrors).includes(true) && completeDatosCargarImagen(imageData) && error===null) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };



  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if(tipoInventario!=="activo" && activeStep===3){
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };
  const onClose = () => {
    if (tipoInventario === "activo") {
      navigate("/activos");
    } else if (tipoInventario === "bodega") {
      navigate("/bodega")
    } else {
      navigate("/bajas")
    }
  };
  
  const handleModalBeforeAdd = () => {
    handleCargarImagenErrors(imageData);
    if (!Object.values(cargarImagenErrors).includes(true) && completeDatosCargarImagen(imageData) && !error) {
      setOpenModalObservation(true);
    }
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <StepDatosInventarioSAP
            periferico={selectedPeriferico?.id_periferico ?? ""}
            edificio={selectedEdificio?.id_edificio ?? ""}
            inventoryDataSAPForm={inventoryDataSAPForm}
            handleInventorySAPChange={handleInventorySAPChange}
            inventorySAPErrors={inventorySAPErrors}
            handleUniqueInventarioSAPError={handleUniqueInventarioSAPError}
            tipoInventario={tipoInventario}
          />
        );
        
      case 1:
        return <StepInformacionGeneralSAP
          periferico={selectedPeriferico?.nombre ?? ""}
          informacionGeneralDataSAPForm={informacionGeneralDataSAPForm}
          handleInformacionGeneralSAPChange={handleInformacionGeneralSAPChange}
          informacionGeneralSAPErrors={informacionGeneralSAPErrors}
          handleUniqueInformacionGeneralError={handleUniqueInformacionGeneralError}
        />;
      case 2:
        return (
        <>
            <ModalObservation
              open={openModalObservation}
              onClose={() => setOpenModalObservation(false)}
              onConfirm={(observationValue) => {
                setOpenModalObservation(false);
                handleAgregarEquipoActivo(observationValue);
              }}
              title="Agregar observación"
              message="¿Desea agregar una observación al equipo?"
            />

            <StepCargarImagen
            imageData={imageData}
            handleImageChange={handleImageChange}
            cargarImagenErrors={cargarImagenErrors}
            handleUniqueCargarImagenError={handleUniqueCargarImagenError}
            error={error}/>
        </>
        );
      default:
        return <div>Paso no encontrado</div>;
    }
  };
  const handleAgregarEquipoActivo = async (observationValue: string) => {
    const equipoData = {
      tipo: "activo",
      inventario: inventoryDataSAPForm.inventario || "",
      serie: Number(inventoryDataSAPForm.serie?.id_serie) ?? 0,
      idUbicacion: Number(inventoryDataSAPForm.ubicacion?.id_ubicacion) ?? 0,
      idUsuario: 1,
      imagenRuta: imageData.imagePath,
      observacion: observationValue,
      mac: informacionGeneralDataSAPForm.mac || "",
      puertos: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertos,
      puerto_ftp: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertoFTP,
      idLampara:0,
    };

    try {
      const equipoId = await agregarRedActivo(equipoData);

      setShowSuccessMessage(true);
      navigate("/activos", { state: { equipoAgregado: true } });
    } catch (error) {
      alert("Error al agregar el equipo y componentes.");
    }
  };

  const handleAgregarEquipoBodega = async () => {
    const bodegaComputadoraData = {
      tipo: "bodega",
      inventario: inventoryDataSAPForm.inventario || "",
      serie: Number(inventoryDataSAPForm.serie?.id_serie) ?? 0,
      nombreEquipo: informacionGeneralDataSAPForm.nombreEquipo || "",
      direccionIp: informacionGeneralDataSAPForm.direccionIP,
      versionso: Number(informacionGeneralDataSAPForm.versionSO?.id_versionso) ?? 0,
      versionoffice: Number(informacionGeneralDataSAPForm.versionOffice?.id_versionoffice) ?? 0,
      ram: Number(informacionGeneralDataSAPForm.ram?.id_ram) ?? 0,
      disco: Number(informacionGeneralDataSAPForm.disco?.id_disco) ?? 0,
      procesador: Number(informacionGeneralDataSAPForm.procesador?.id_procesador) ?? 0, 
      antivirus: Number(informacionGeneralDataSAPForm.antivirus?.id_antivirus) ?? 0,
      dominio: Number(informacionGeneralDataSAPForm.dominio?.id_dominio) ?? 0, 
      observacion: observation
    };
    try {
      const equipoId = await agregarComputadoraBodega(bodegaComputadoraData);

      setShowSuccessMessage(true);
      navigate("/bodega", { state: { equipoAgregado: true } });
    } catch (error) {
      alert("Error al agregar el equipo y componentes.");
    }
  }
  


  const stepStyle = {
    "& .Mui-active": {
      "&.MuiStepIcon-root": {
        color: "#83898A",
        fontSize: "2rem",
      },
      "& .MuiStepConnector-line": {
        borderColor: "#00913F",
        borderWidth: "3px",
      },
    },
    "& .Mui-completed": {
      "&.MuiStepIcon-root": {
        color: "#00913F",
        fontSize: "2rem",
      },
      "& .MuiStepConnector-line": {
        borderColor: "#00913F",
        borderWidth: "3px",
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        marginTop: "50px",
        paddingBottom: "30px",
      }}
    >
      <Box sx={{ width: "60%" }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={stepStyle}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

          <Fragment>
            {renderStepContent(activeStep)}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                onClick={onClose}
                color="error"
                variant="contained"
                size="large"
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Atrás
              </Button>

              <Button
                onClick={
                  (activeStep === steps.length - 1 && tipoInventario==="activo")?handleModalBeforeAdd
                    : (activeStep-1 === steps.length - 1 && tipoInventario==="bodega")?handleAgregarEquipoBodega
                      : handleNext
                }
                variant="contained"
                sx={{
                  backgroundColor:
                  (activeStep === steps.length - 1 && tipoInventario==="activo")?"#4CAF50" 
                  : (activeStep-1 === steps.length - 1 && tipoInventario==="bodega")?"#4CAF50" :"#1976d2",
                  "&:hover": {
                    backgroundColor:
                    (activeStep === steps.length - 1 && tipoInventario==="activo")?
                    "#45a049" : (activeStep-1 === steps.length - 1 && tipoInventario==="bodega")? "#45a049":"#1565c0",
                  },
                }}
              >
                {
              (activeStep === steps.length - 1 && tipoInventario==="activo")
                      ? "Finalizar"
                      : (activeStep-1 === steps.length - 1 && tipoInventario==="bodega")?
                         "Agregar Bodega"
                    : "Siguiente"
                }
              </Button>
            </Box>
          </Fragment>
        
      </Box>
    </Box>
  );
};
