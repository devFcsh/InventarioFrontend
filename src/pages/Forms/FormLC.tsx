import { useState, Fragment } from "react";
import { Box, Stepper, Step, StepLabel, Button } from "@mui/material";
import {
  StepDatosInventario,
  StepInformacionGeneral,
  StepCargarImagen,
  StepComponentes,
} from "./Steps/index.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { Periferico, Edificio, Uso } from "../../types/index.ts";
import { useAgregarComputadoraActivo } from "../../features/Equipos/Activos/AgregarActivo/hooks/useAgregarComputadoraActivo.ts";
import { useAgregarComponentes } from "../../hooks/useAgregarComponentes.ts";
import { useFormDatosInventario } from "./hooks/useFormDatosInventario.ts";
import { useFormDataInformacionGeneral } from "./hooks/useFormDataInformacionGeneral.ts";
import { useFormDataCargarImagen } from "./hooks/useFormDataCargarImagen.ts";
import { useFormDataComponentes } from "./hooks/useFormDataComponentes.ts";
import { useInventoryErrors } from "./hooks/useInventoryErrors.ts";
import { useInformacionGeneralError } from "./hooks/useInformacionGeneralError.ts";
import { useCargarImagenErrors } from "./hooks/useCargarImagenErrors.ts";
import { useAgregarComputadoraBodega } from "../../features/Equipos/Bodega/AgregarEquipoBodega/hooks/useAgregarComputadoraBodega.ts";
import { useAgregarComponentesBodega } from "../../features/Equipos/Bodega/AgregarEquipoBodega/hooks/useAgregarComponentesBodega.ts";
import { ModalObservation } from "./components/ModalObservation.tsx";

export const FormLC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const selectedPeriferico = location.state?.periferico as
    | Periferico
    | undefined;
  const selectedUso = location.state?.uso as Uso | undefined;
  const selectedEdificio = location.state?.edificio as Edificio | undefined;
  const [openModalObservation, setOpenModalObservation] = useState(false);
  const [observation, setObservation] = useState("");
  const perifericos = location.state?.perifericos as Periferico[];
  const tipoInventario = location.state?.tipoInventario;
  const steps = location.state?.steps;
  const { agregarComputadoraActivo } = useAgregarComputadoraActivo();
  const { agregarComputadoraBodega } = useAgregarComputadoraBodega();
  const { inventoryDataForm, handleInventoryChange } = useFormDatosInventario();
  const { agregarComponentes } = useAgregarComponentes();
  const { agregarComponentesBodega } = useAgregarComponentesBodega();
  const { informacionGeneralDataForm, handleInformacionGeneralChange } =
    useFormDataInformacionGeneral();
  const { imageData, handleImageChange, error } = useFormDataCargarImagen();
  const {
    componentes,
    handleAddComponents,
    eliminarComponente,
    showSuccessMessageComponentes,
    setShowSuccessMessageComponentes,
  } = useFormDataComponentes();
  const {
    inventoryErrors,
    completeDatosInventario,
    handleInventoryErrors,
    handleUniqueInventarioError,
  } = useInventoryErrors(tipoInventario,selectedPeriferico?.nombre);
  const {
    informacionGeneralErrors,
    handleInformacionGeneralErrors,
    handleUniqueInformacionGeneralError,
    completeDatosInformacionGeneral,
  } = useInformacionGeneralError();
  const {
    cargarImagenErrors,
    handleCargarImagenErrors,
    handleUniqueCargarImagenError,
    completeDatosCargarImagen,
  } = useCargarImagenErrors();

  const handleNext = () => {
    if (activeStep === 0) {
      handleInventoryErrors(inventoryDataForm);
      if (
        !Object.values(inventoryErrors).includes(true) &&
        completeDatosInventario(inventoryDataForm)
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
    if (activeStep === 1) {
      handleInformacionGeneralErrors(informacionGeneralDataForm);
      if (
        !Object.values(informacionGeneralErrors).includes(true) &&
        completeDatosInformacionGeneral(informacionGeneralDataForm)
      ) {
        if (tipoInventario === "activo") {
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setActiveStep(3);
        }
      }
    }
    if (activeStep === 2) {
      handleCargarImagenErrors(imageData);
      if (
        !Object.values(cargarImagenErrors).includes(true) &&
        completeDatosCargarImagen(imageData) &&
        error === null
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (tipoInventario !== "activo" && activeStep === 3) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };
  const onClose = () => {
    if (tipoInventario === "activo") {
      navigate("/activos");
    } else if (tipoInventario === "bodega") {
      navigate("/bodega");
    } else {
      navigate("/bajas");
    }
  };

  const handleModalBeforeAdd = () => {
    setOpenModalObservation(true);
  };


  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <StepDatosInventario
            periferico={selectedPeriferico}
            uso={selectedUso?.id_uso ?? ""}
            edificio={selectedEdificio?.id_edificio ?? ""}
            inventoryDataForm={inventoryDataForm}
            handleInventoryChange={handleInventoryChange}
            inventoryErrors={inventoryErrors}
            handleUniqueInventarioError={handleUniqueInventarioError}
            tipoInventario={tipoInventario}
          />
        );

      case 1:
        return (
          <StepInformacionGeneral
            informacionGeneralDataForm={informacionGeneralDataForm}
            handleInformacionGeneralChange={handleInformacionGeneralChange}
            informacionGeneralErrors={informacionGeneralErrors}
            handleUniqueInformacionGeneralError={
              handleUniqueInformacionGeneralError
            }
          />
        );
      case 2:
        return (
          <StepCargarImagen
            imageData={imageData}
            handleImageChange={handleImageChange}
            cargarImagenErrors={cargarImagenErrors}
            handleUniqueCargarImagenError={handleUniqueCargarImagenError}
            error={error}
          />
        );
      case 3:
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
            <StepComponentes
              perifericos={perifericos}
              componentes={componentes}
              handleAddComponents={handleAddComponents}
              eliminarComponente={eliminarComponente}
              showSuccessMessageComponentes={showSuccessMessageComponentes}
              setShowSuccessMessageComponentes={
                setShowSuccessMessageComponentes
              }
            />
          </>
        );
      default:
        return <div>Paso no encontrado</div>;
    }
  };
  const handleAgregarEquipoActivo = async (observationValue: string) => {
    setOpenModalObservation(false);
    const equipoData = {
      tipo: "activo",
      inventario: inventoryDataForm.inventario || "",
      serie: Number(inventoryDataForm.serie?.id_serie) ?? 0,
      nombreEquipo: informacionGeneralDataForm.nombreEquipo || "",
      direccionIp: informacionGeneralDataForm.direccionIP,
      versionso:
        Number(informacionGeneralDataForm.versionSO?.id_versionso) ?? 0,
      versionoffice:
        Number(informacionGeneralDataForm.versionOffice?.id_versionoffice) ?? 0,
      ram: Number(informacionGeneralDataForm.ram?.id_ram) ?? 0,
      disco: Number(informacionGeneralDataForm.disco?.id_disco) ?? 0,
      procesador:
        Number(informacionGeneralDataForm.procesador?.id_procesador) ?? 0,
      antivirus:
        Number(informacionGeneralDataForm.antivirus?.id_antivirus) ?? 0,
      dominio: Number(informacionGeneralDataForm.dominio?.id_dominio) ?? 0,
      idUbicacion: Number(inventoryDataForm.ubicacion?.id_ubicacion) ?? 0,
      idUsuario: parseInt(inventoryDataForm.usuarioId || "", 10),
      imagenRuta: imageData.imagePath,
      observacion: observationValue
    };

    try {
      const equipoId = await agregarComputadoraActivo(equipoData);

      if (componentes.length > 0 && equipoId) {
        await agregarComponentes({
          tipo: "activo",
          equipoId: equipoId,
          componentes: componentes.map((comp) => ({
            inventario: comp.inventario,
            serieId: Number(comp.serie?.id_serie) ?? 0,
          })),
          ubicacionId: Number(inventoryDataForm.ubicacion?.id_ubicacion) ?? 0,
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

  const handleAgregarEquipoBodega = async () => {
    const bodegaComputadoraData = {
      tipo: "bodega",
      inventario: inventoryDataForm.inventario || "",
      serie: Number(inventoryDataForm.serie?.id_serie) ?? 0,
      nombreEquipo: informacionGeneralDataForm.nombreEquipo || "",
      direccionIp: informacionGeneralDataForm.direccionIP,
      versionso:
        Number(informacionGeneralDataForm.versionSO?.id_versionso) ?? 0,
      versionoffice:
        Number(informacionGeneralDataForm.versionOffice?.id_versionoffice) ?? 0,
      ram: Number(informacionGeneralDataForm.ram?.id_ram) ?? 0,
      disco: Number(informacionGeneralDataForm.disco?.id_disco) ?? 0,
      procesador:
        Number(informacionGeneralDataForm.procesador?.id_procesador) ?? 0,
      antivirus:
        Number(informacionGeneralDataForm.antivirus?.id_antivirus) ?? 0,
      dominio: Number(informacionGeneralDataForm.dominio?.id_dominio) ?? 0,
      observacion: observation,
    };
    try {
      const equipoId = await agregarComputadoraBodega(bodegaComputadoraData);
      if (componentes.length > 0 && equipoId) {
        await agregarComponentesBodega({
          tipo: "bodega",
          equipoId: equipoId,
          componentes: componentes.map((comp) => ({
            inventario: comp.inventario,
            serieId: Number(comp.serie?.id_serie) ?? 0,
          })),
        });
      }
      setShowSuccessMessage(true);
      navigate("/bodega", { state: { equipoAgregado: true } });
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
                activeStep === steps.length - 1 && tipoInventario === "activo"
                  ? handleModalBeforeAdd
                  : activeStep - 1 === steps.length - 1 &&
                    tipoInventario === "bodega"
                  ? handleAgregarEquipoBodega
                  : handleNext
              }
              variant="contained"
              sx={{
                backgroundColor:
                  activeStep === steps.length - 1 && tipoInventario === "activo"
                    ? "#4CAF50"
                    : activeStep - 1 === steps.length - 1 &&
                      tipoInventario === "bodega"
                    ? "#4CAF50"
                    : "#1976d2",
                "&:hover": {
                  backgroundColor:
                    activeStep === steps.length - 1 &&
                    tipoInventario === "activo"
                      ? "#45a049"
                      : activeStep - 1 === steps.length - 1 &&
                        tipoInventario === "bodega"
                      ? "#45a049"
                      : "#1565c0",
                },
              }}
            >
              {activeStep === steps.length - 1 && tipoInventario === "activo"
                ? "Finalizar"
                : activeStep - 1 === steps.length - 1 &&
                  tipoInventario === "bodega"
                ? "Agregar Bodega"
                : "Siguiente"}
            </Button>
          </Box>
        </Fragment>
      </Box>
    </Box>
  );
};
