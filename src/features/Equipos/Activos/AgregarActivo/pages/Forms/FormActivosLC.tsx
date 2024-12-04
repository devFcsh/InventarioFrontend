import { useState, Fragment,useEffect } from "react";
import {Box,Stepper,Step,StepLabel,Button,Typography} from "@mui/material";
import {StepDatosInventario, StepInformacionGeneral,StepCargarImagen,StepComponentes} from "../Forms/Steps/index.ts"
import { useLocation, useNavigate } from "react-router-dom";
import { Periferico } from "../../../../../../types";
import { useAgregarComputadoraActivo } from "../../hooks/useAgregarComputadoraActivo";
import { useAgregarComponentes } from "../../hooks/useAgregarComponentes";
import { useFormDatosInventario } from "./hooks/useFormDatosInventario.ts";
import { useFormDataInformacionGeneral } from "./hooks/useFormDataInformacionGeneral.ts";
import { useFormDataCargarImagen } from "./hooks/useFormDataCargarImagen.ts";
import { useFormDataComponentes } from "./hooks/useFormDataComponentes.ts";
import { useInventoryErrors } from './hooks/useInventoryErrors';
const steps = [
  "Datos de inventario",
  "Información general",
  "Cargar imagen",
  "Componentes",
];

export const FormActivosLC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const selectedPeriferico = location.state?.periferico as
    | Periferico
    | undefined;
  const perifericos = location.state?.perifericos as Periferico[];
  const { agregarComputadoraActivo } = useAgregarComputadoraActivo();
  const { agregarComponentes } = useAgregarComponentes();
  const {inventoryDataForm, handleInventoryChange} = useFormDatosInventario();
  const {informacionGeneralDataForm, handleInformacionGeneralChange} = useFormDataInformacionGeneral();
  const { imageData, handleImageChange} = useFormDataCargarImagen();
  const {componentes, handleAddComponents,eliminarComponente,showSuccessMessageComponentes,setShowSuccessMessageComponentes} = useFormDataComponentes();
  const { inventoryErrors, completeDatosInventario,handleInventoryErrors,handleUniqueError } =  useInventoryErrors();

  const handleNext = () => {
    handleInventoryErrors(inventoryDataForm);
    if (!Object.values(inventoryErrors).includes(true) && completeDatosInventario(inventoryDataForm)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const onClose = () => {
    navigate("/activos");
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <StepDatosInventario
            periferico={selectedPeriferico?.id_periferico ?? ""}
            inventoryDataForm={inventoryDataForm}
            handleInventoryChange={handleInventoryChange}
            inventoryErrors={inventoryErrors}
            handleUniqueError={handleUniqueError}
          />
        );
      case 1:
        return <StepInformacionGeneral 
        informacionGeneralDataForm={informacionGeneralDataForm}
        handleInformacionGeneralChange={handleInformacionGeneralChange} />;
      case 2:
        return <StepCargarImagen
        imageData={imageData}
        handleImageChange={handleImageChange}/>;
      case 3:
        return (
          <StepComponentes
            perifericos={perifericos}
            componentes={componentes}
            handleAddComponents={handleAddComponents}
            eliminarComponente={eliminarComponente}
            showSuccessMessageComponentes={showSuccessMessageComponentes}
            setShowSuccessMessageComponentes={setShowSuccessMessageComponentes}
          />
        );
      default:
        return <div>Paso no encontrado</div>;
    }
  };
  const handleAgregarEquipo = async () => {
    const equipoData = {
      tipo: "activo",
      inventario: inventoryDataForm.inventario || "",
      serie: Number(inventoryDataForm.serie?.id_serie) ?? 0,
      nombreEquipo: informacionGeneralDataForm.nombreEquipo || "",
      direccionIp: informacionGeneralDataForm.direccionIP,
      versionso: Number(informacionGeneralDataForm.versionSO?.id_versionso) ?? 0,
      versionoffice: Number(informacionGeneralDataForm.versionOffice?.id_versionoffice) ?? 0,
      ram: Number(informacionGeneralDataForm.ram?.id_ram) ?? 0,
      disco: Number(informacionGeneralDataForm.disco?.id_disco) ?? 0,
      antivirus: Number(informacionGeneralDataForm.antivirus?.id_antivirus) ?? 0,
      dominio: Number(informacionGeneralDataForm.dominio?.id_dominio) ?? 0,
      idAula: Number(inventoryDataForm.aula?.id_aula) ?? 0,
      idUsuario: parseInt(inventoryDataForm.usuarioId || "", 10),
      imagenRuta: imageData.imagePath,
    };

    try {
      const equipoId = await agregarComputadoraActivo(equipoData);
      
      if (componentes.length > 0 && equipoId) {
        await agregarComponentes({
          equipoId: equipoId,
          componentes: componentes.map((comp) => ({
            inventario: comp.inventario,
            serieId: Number(comp.serie?.id_serie) ?? 0,
          })),
          aulaId: Number(inventoryDataForm.aula?.id_aula) ?? 0,
          usuarioId: parseInt(inventoryDataForm.usuarioId || "", 10),
          imagenRuta: imageData.imagePath,
        });
      }
      setShowSuccessMessage(true);
      navigate("/activos", { state: { equipoAgregado: true } });
    } catch (error) {
      alert("Error al agregar el equipo y componentes.");
    }
  };

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
