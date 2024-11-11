import {useState,Fragment} from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./FormStyle.css";
import StepDatosInventario from "./Steps/StepDatosInventario";
import StepCargarImagen from "./Steps/StepCargarImagen";
import { useLocation, useNavigate } from "react-router-dom";
import { StepComponentes } from "./Steps/StepComponentes";
import { StepInformacionGeneral } from "./Steps/StepInformacionGeneral";
import {
  Periferico,
} from "../../../../../../types";
import useSubirImagen from "@hooks/useSubirImagen";
import { useAgregarComputadoraActivo } from "../../hooks/useAgregarComputadoraActivo";

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
  const selectedPeriferico = location.state?.periferico as Periferico | undefined;
  const perifericos = location.state?.perifericos as Periferico[];
  const { uploadImage } = useSubirImagen();
  const { agregarComputadoraActivo } = useAgregarComputadoraActivo();
  const [formData, setFormData] = useState({
    inventario: '',
    serie: 0,
    nombreEquipo: '',
    direccionIp: '',
    versionso: 0,
    versionoffice: 0,
    ram: 0,
    disco: 0,
    antivirus: 0,
    dominio: 0,
    idAula: 0,
    idUsuario: null,
    image: null,  
    componentes: [],
  });
  
  const handleFormData = (newData : any, tipo:any) =>{
    setFormData({
      ...formData,
      [tipo]: newData
    })
    console.log(formData)
  }

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
        return <StepDatosInventario periferico={selectedPeriferico?.id_periferico ?? ''} handleFormData={handleFormData} />;
      case 1:
        return <StepInformacionGeneral handleFormData={handleFormData}/>;
      case 2:
        return <StepCargarImagen handleFormData={handleFormData}/>;
      case 3:
        return <StepComponentes perifericos={perifericos} handleFormData={handleFormData}/>;
      default:
        return <div>Paso no encontrado</div>;
    }
  };
  const handleAgregarEquipo = async () => {
    let imagePath = "";

    const equipoData = {
      tipo: "activo",
      inventario: formData.inventario || "",
      serie: Number(formData.serie) ?? 0,
      nombreEquipo: formData.nombreEquipo || "",
      direccionIp: formData.direccionIp,
      versionso: Number(formData.versionso) ?? 0,
      versionoffice: Number(formData.versionoffice) ?? 0,
      ram: Number(formData.ram) ?? 0,
      disco: Number(formData.disco) ?? 0,
      antivirus: Number(formData.antivirus) ?? 0,
      dominio: Number(formData.dominio) ?? 0,
      idAula: Number(formData.idAula) ?? 0,
      idUsuario: parseInt(formData.idUsuario || "" , 10),
      imagenRuta: imagePath,
    };

    try {
      const equipoId = await agregarComputadoraActivo(equipoData);
      navigate("/activos", { state: { equipoAgregado: true } });
    } catch (error) {
      console.error("Error al agregar el equipo y componentes:", error);
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
                onClick={handleNext}
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
