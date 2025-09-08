import { useState, Fragment } from "react";
import { Box, Stepper, Step, StepLabel, Button } from "@mui/material";
import { StepDatosInventarioSAP, StepInformacionGeneralSAP } from "./StepsSAP/index.ts"
import { useLocation, useNavigate } from "react-router-dom";
import { Periferico, Edificio } from "../../types/index.ts";
import { useAgregarRedActivo } from "../../features/Equipos/Activos/AgregarActivo/hooks/useAgregarRedActivo.ts";
import { useAgregarRedBodega } from "../../features/Equipos/Bodega/AgregarEquipoBodega/hooks/useAgregarRedBodega.ts";
import { useAgregarRedBaja } from "../../features/Equipos/Baja/AgregarEquipoBaja/hooks/useAgregarRedBaja.ts";
import {useFormDatosInventarioSAP,useFormDataInformacionGeneralSAP,useInventoryErrorsSAP,useInformacionGeneralErrorSAP} from "./StepsSAP/hooks/index.ts"
import { ModalObservation } from "./components/ModalObservation.tsx";
import {useCargarImagenErrors,useFormDataCargarImagen} from "./hooks/index.ts"
import {StepCargarImagen} from "./Steps/StepCargarImagen.tsx"
import { useSnackbar } from "@context/SnackbarContext.tsx";
export const FormSAP = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const [_, setShowSuccessMessage] = useState(false);
  const selectedPeriferico = location.state?.periferico as
    | Periferico
    | undefined;
  const selectedEdificio = location.state?.edificio as
    | Edificio
    | undefined;
  const [openModalObservation, setOpenModalObservation] = useState(false);
  const tipoInventario = location.state?.tipoInventario;
  const steps = location.state?.steps;
  const { agregarRedActivo } = useAgregarRedActivo();
  const { agregarRedBodega } = useAgregarRedBodega();
  const { agregarRedBaja } = useAgregarRedBaja();
  const { inventoryDataSAPForm, handleInventorySAPChange } = useFormDatosInventarioSAP();
  const { informacionGeneralDataSAPForm, handleInformacionGeneralSAPChange } = useFormDataInformacionGeneralSAP();
  const { imageData, handleImageChange, error } = useFormDataCargarImagen();
  const { inventorySAPErrors, completeDatosInventario, handleInventorySAPErrors, handleUniqueInventarioSAPError } = useInventoryErrorsSAP(tipoInventario);
  const { informacionGeneralSAPErrors, handleInformacionGeneralSAPErrors, handleUniqueInformacionGeneralError, completeDatosInformacionGeneral } = useInformacionGeneralErrorSAP(selectedPeriferico?.nombre);
  const { cargarImagenErrors, handleCargarImagenErrors, handleUniqueCargarImagenError, completeDatosCargarImagen } = useCargarImagenErrors();

  const { showMessage } = useSnackbar();
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
    if(tipoInventario==="activo"){
      handleCargarImagenErrors(imageData);
      if (
        !Object.values(cargarImagenErrors).includes(true) &&
        completeDatosCargarImagen(imageData) &&
        !error
      ) {
        setOpenModalObservation(true);
      }
    }else{
      handleInformacionGeneralSAPErrors(informacionGeneralDataSAPForm);
      if (
        !Object.values(informacionGeneralSAPErrors).includes(true) &&
        completeDatosInformacionGeneral(informacionGeneralDataSAPForm)
      ) {
        setOpenModalObservation(true);
      }
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
        return (
          <>
            <ModalObservation
                open={openModalObservation}
                onClose={() => setOpenModalObservation(false)}
                onConfirm={(observationValue) => {
                  setOpenModalObservation(false);
                  handleAgregarEquipo(observationValue)
                  
                }}
                title="Agregar observación"
              />
          <StepInformacionGeneralSAP
            periferico={selectedPeriferico?.nombre ?? ""}
            informacionGeneralDataSAPForm={informacionGeneralDataSAPForm}
            handleInformacionGeneralSAPChange={handleInformacionGeneralSAPChange}
            informacionGeneralSAPErrors={informacionGeneralSAPErrors}
            handleUniqueInformacionGeneralError={handleUniqueInformacionGeneralError}
          />

          </>)
      case 2:
        return (
        <>
            <ModalObservation
                open={openModalObservation}
                onClose={() => setOpenModalObservation(false)}
                onConfirm={(observationValue) => {
                  setOpenModalObservation(false);
                  handleAgregarEquipo(observationValue)
                  
                }}
                title="Agregar observación"
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
  const handleAgregarEquipo = (observationValue: string)=>{
    if(tipoInventario==="activo"){
      handleAgregarEquipoActivo(observationValue);
    }else if(tipoInventario==="bodega"){
      handleAgregarEquipoBodega(observationValue);
      
    }else{
      handleAgregarEquipoBaja(observationValue);
    }
  }
  const handleAgregarEquipoActivo = async (observationValue: string) => {
    const equipoData = {
      tipo: "activo",
      inventario: inventoryDataSAPForm.inventario || "",
      anio_compra: inventoryDataSAPForm.anio_compra,
      perifericoId: Number(selectedPeriferico?.id_periferico) ?? 0,
      serie: inventoryDataSAPForm.serie || "",
      modeloId: Number(inventoryDataSAPForm.modelo?.id_modelo) ?? 0,
      idUbicacion: Number(inventoryDataSAPForm.ubicacion?.id_ubicacion) ?? 0,
      idUsuario: 1,
      imagenRuta: imageData.imagePath,
      observacion: observationValue,
      mac: informacionGeneralDataSAPForm.mac || "",
      puertos: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertos,
      puerto_ftp: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertoFTP,
      idLampara:0,
      nombreEquipo: informacionGeneralDataSAPForm.nombreEquipo || "",
    };

    try {
      await agregarRedActivo(equipoData);


      setShowSuccessMessage(true);
      showMessage("Equipo agregado correctamente", "success");
      navigate("/activos");
    } catch (error) {
      showMessage("Error al agregar el equipo", "error");
    }
  };

  const handleAgregarEquipoBodega = async (observationValue: string) => {
    const bodegaComputadoraData = {
      tipo: "bodega",
      inventario: inventoryDataSAPForm.inventario || "",
      anio_compra: inventoryDataSAPForm.anio_compra,
      perifericoId: Number(selectedPeriferico?.id_periferico) ?? 0,
      serie: inventoryDataSAPForm.serie || "",
      modeloId: Number(inventoryDataSAPForm.modelo?.id_modelo) ?? 0,
      observacion: observationValue,
      mac: informacionGeneralDataSAPForm.mac || "",
      puertos: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertos,
      puerto_ftp: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertoFTP,
      idLampara:0,
      nombre_equipo:informacionGeneralDataSAPForm.nombreEquipo || "",
    };
    try {
      await agregarRedBodega(bodegaComputadoraData);

      setShowSuccessMessage(true);
      showMessage("Equipo agregado correctamente", "success");
      navigate("/bodega");
    } catch (error) {
      showMessage("Error al agregar el equipo", "error");
    }
  }
  const handleAgregarEquipoBaja = async (observationValue: string) => {
    const bodegaComputadoraData = {
      tipo: "baja",
      inventario: inventoryDataSAPForm.inventario || "",
      anio_compra: inventoryDataSAPForm.anio_compra,
      perifericoId: Number(selectedPeriferico?.id_periferico) ?? 0,
      serie: inventoryDataSAPForm.serie || "",
      modeloId: Number(inventoryDataSAPForm.modelo?.id_modelo) ?? 0,
      observacion: observationValue,
      mac: informacionGeneralDataSAPForm.mac || "",
      puertos: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertos,
      puerto_ftp: selectedPeriferico?.nombre==="AP"?"":informacionGeneralDataSAPForm.puertoFTP,
      idLampara:0,
      nombre_equipo:informacionGeneralDataSAPForm.nombreEquipo || "",
    };
    try {
      await agregarRedBaja(bodegaComputadoraData);

      setShowSuccessMessage(true);
      showMessage("Equipo agregado correctamente", "success");
      navigate("/bajas");
    } catch (error) {
      showMessage("Error al agregar el equipo", "error");
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
          {steps.map((label:any, _:any) => {
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

              {steps.length === 1 ? (
                ""
              ) : (
                <Button
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Atrás
                </Button>
              )}

              <Button
                onClick={
                  activeStep === steps.length - 1
                    ? handleModalBeforeAdd
                    : handleNext
                }
                variant="contained"
                sx={{
                  backgroundColor:
                    activeStep === steps.length - 1 ? "#4CAF50" : "#1976d2",
                  "&:hover": {
                    backgroundColor:
                      activeStep === steps.length - 1 ? "#45a049" : "#1565c0",
                  },
                }}
              >
                {activeStep === steps.length - 1
                  ? tipoInventario === "activo"
                    ? "Agregar Activo"
                    : tipoInventario === "bodega"
                    ? "Agregar Bodega"
                    : tipoInventario === "baja"
                    ? "Agregar Baja"
                    : "Siguiente"
                  : "Siguiente"}
              </Button>
            </Box>
          </Fragment>
        
      </Box>
    </Box>
  );
};
