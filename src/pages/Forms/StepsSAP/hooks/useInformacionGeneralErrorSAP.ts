import { useState } from "react";
import { validateMAC } from "../helpers/validateMAC";

interface InformacionGeneralDataForm{
  mac: string;
  puertos: string;
  puertoFTP: string;
  nombreEquipo: string;
}

export const useInformacionGeneralErrorSAP = (periferico:string | undefined) => {
  const [informacionGeneralSAPErrors, setInformacionGeneralErrors] = useState<Record<string, boolean>>({
    "mac":false,
    "puertos":false,
    "puertoFTP":false,
    "nombreEquipo":false
  });

  const completeDatosInformacionGeneral = (dataForm: InformacionGeneralDataForm)=>{
    if(dataForm.nombreEquipo!== "" && dataForm.mac !=="" && (periferico==="AP"?true:dataForm.puertos !=="")
      && (periferico==="AP"?true:(dataForm.puertoFTP!=="" && validateMAC(dataForm.mac)))
    ) return true
    return false;
  }

  const handleInformacionGeneralSAPErrors = (formData: InformacionGeneralDataForm) => {
    const fieldsToCheck: (keyof InformacionGeneralDataForm)[] = [
        "mac",
        "puertos",
        "puertoFTP",
        "nombreEquipo"
    ];
    fieldsToCheck.forEach((field) => {
      if (formData[field] === null || formData[field] === "") {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          [field]: true,
        }));
      }
    });
    if(periferico==="AP"){
      setInformacionGeneralErrors((prevErrors) => ({
        ...prevErrors,
        ["puertos"]: false,
        ["puertoFTP"]: false,
      }));
    }
  };

  const handleUniqueInformacionGeneralError = (tipo: keyof InformacionGeneralDataForm, value: string | null) => {
  
    setInformacionGeneralErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === "" ? true : false,
    }));
    if (tipo === "mac") {
      if (!validateMAC(value)) {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["mac"]: true
        }));
      } else {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["mac"]: false
        }));
      }
    }
    if (tipo === "puertos" || tipo === "puertoFTP") {
      if (value !== null && /^\d+$/.test(value)) {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          [tipo]: false
        }));
      } else {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          [tipo]: true
        }));
      }
    }
    if(value!==null && tipo==="nombreEquipo" && (value.length>10 || value.length<10)){
      setInformacionGeneralErrors((prevErrors) => ({
        ...prevErrors,
        [tipo]: true
      }));
    }else if(value!==null && tipo==="nombreEquipo" && value.length===10){
      setInformacionGeneralErrors((prevErrors) => ({
        ...prevErrors,
        [tipo]: false
      }));
    }
  };

  return { informacionGeneralSAPErrors,handleInformacionGeneralSAPErrors, handleUniqueInformacionGeneralError,completeDatosInformacionGeneral};
};
