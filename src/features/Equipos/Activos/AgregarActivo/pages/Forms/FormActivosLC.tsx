import { useState, Fragment } from "react";
import {Box,Stepper,Step,StepLabel,Button,Typography} from "@mui/material";
import {StepDatosInventario, StepInformacionGeneral,StepCargarImagen,StepComponentes} from "../Forms/Steps/index.ts"
import { useLocation, useNavigate } from "react-router-dom";
import { Periferico } from "../../../../../../types";
import { useAgregarComputadoraActivo } from "../../hooks/useAgregarComputadoraActivo";
import { useAgregarComponentes } from "../../hooks/useAgregarComponentes";
import {useFormData} from "./hooks/useFormData.ts"
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
  const {formData,handleFormData} = useFormData();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
            handleFormData={handleFormData}
          />
        );
      case 1:
        return <StepInformacionGeneral handleFormData={handleFormData} />;
      case 2:
        return <StepCargarImagen handleFormData={handleFormData} />;
      case 3:
        return (
          <StepComponentes
            perifericos={perifericos}
            handleFormData={handleFormData}
          />
        );
      default:
        return <div>Paso no encontrado</div>;
    }
  };
  const handleAgregarEquipo = async () => {
    let imagePath = "";
    const equipoData = {
      tipo: "activo",
      inventario: formData.inventario || "",
      serie: formData.serie ?? 0,
      nombreEquipo: formData.nombreEquipo || "",
      direccionIp: formData.direccionIp,
      versionso: formData.versionso ?? 0,
      versionoffice: formData.versionoffice ?? 0,
      ram: formData.ram ?? 0,
      disco: formData.disco ?? 0,
      antivirus: formData.antivirus ?? 0,
      dominio: formData.dominio ?? 0,
      idAula: formData.idAula ?? 0,
      idUsuario: parseInt(formData.idUsuario || "", 10),
      imagenRuta: imagePath,
    };

    try {
      const equipoId = await agregarComputadoraActivo(equipoData);
      if (formData.componentes.length > 0 && equipoId) {
        await agregarComponentes({
          equipoId: equipoId,
          componentes: formData.componentes.map((comp) => ({
            inventario: comp.inventario,
            serieId: Number(comp.serie?.id_serie) ?? 0,
          })),
          aulaId: Number(formData.idAula) ?? 0,
          usuarioId: parseInt(formData.idUsuario || "", 10),
          imagenRuta: imagePath,
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
