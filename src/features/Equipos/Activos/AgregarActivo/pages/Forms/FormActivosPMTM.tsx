import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./FormStyle.css"

const steps = [
  'Datos de inventario',
  'Cargar imagen',
];

export const FormActivosPMTM = () => {
    const [activeStep, setActiveStep] = React.useState(0);
  
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };

    const stepStyle = {
      "& .Mui-active":{
        "&.MuiStepIcon-root":{
          color: "#83898A",
          fontSize: "2rem",
        },
        "& .MuiStepConnector-line":{
          borderColor: "#00913F",
          borderWidth: "3px",
        }
      },
      "& .Mui-completed":{
        "&.MuiStepIcon-root":{
          color: "#00913F",
          fontSize: "2rem"
        },
        "& .MuiStepConnector-line":{
          borderColor: "#00913F",
          borderWidth: "3px",
        }
      }
    }

    return (
        <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '40vh'
        }}
      >
        <Box sx={{ width: '60%'}}>
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
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
      </Box>
      );
}



