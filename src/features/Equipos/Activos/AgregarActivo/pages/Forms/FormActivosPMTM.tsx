import {useState, Fragment} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {Box,Stepper, Step, StepLabel, Button, Typography} from "@mui/material";
import { Periferico } from "../../../../../../types";
import {StepDatosInventario, StepCargarImagen} from "./Steps/index";
import {useFormDatosInventario,useFormDataCargarImagen} from "./hooks/index"
import { useAgregarComputadoraActivo } from "../../hooks/useAgregarComputadoraActivo";
import { useInventoryErrors,useCargarImagenErrors } from './hooks/index';
const steps = ["Datos de inventario", "Cargar imagen"];

export const FormActivosPMTM = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const selectedPeriferico = location.state?.periferico as
  | Periferico
  | undefined;
  const {inventoryDataForm, handleInventoryChange} = useFormDatosInventario();
  const { imageData, handleImageChange} = useFormDataCargarImagen();
  const { agregarComputadoraActivo } = useAgregarComputadoraActivo();
  const { inventoryErrors, completeDatosInventario,handleInventoryErrors,handleUniqueInventarioError } =  useInventoryErrors();
  const { cargarImagenErrors,handleCargarImagenErrors, handleUniqueCargarImagenError,completeDatosCargarImagen } =  useCargarImagenErrors();
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

  const handleNext = () => {
    if(activeStep===0){
      handleInventoryErrors(inventoryDataForm);
      if (!Object.values(inventoryErrors).includes(true) && completeDatosInventario(inventoryDataForm)) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const onClose = () => {
    navigate("/activos");
  };



  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <StepDatosInventario
        periferico={selectedPeriferico?.id_periferico ?? ""}
        inventoryDataForm={inventoryDataForm}
        handleInventoryChange={handleInventoryChange}
        inventoryErrors={inventoryErrors}
        handleUniqueInventarioError={handleUniqueInventarioError}/>;
      case 1:
        return <StepCargarImagen 
        imageData={imageData}
        handleImageChange={handleImageChange}
        cargarImagenErrors={cargarImagenErrors}
        handleUniqueCargarImagenError={handleUniqueCargarImagenError}/>;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  const handleAgregarEquipo = async () => {
    try {
      if(activeStep===1){
        handleCargarImagenErrors(imageData);
        if (!Object.values(cargarImagenErrors).includes(true) && completeDatosCargarImagen(imageData)) {




          setShowSuccessMessage(true);
          navigate("/activos", { state: { equipoAgregado: true } });
        }
      }
    } catch (error) {
      alert("Error al agregar el componente");
    }

  }
  

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
        {activeStep === steps.length ? (
          <Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </Fragment>
        ) : (
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
                  activeStep === steps.length - 1
                    ? handleAgregarEquipo
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
                  ? "Agregar Activo"
                  : "Siguiente"}
              </Button>
            </Box>
          </Fragment>
        )}
      </Box>
    </Box>
  );
};
