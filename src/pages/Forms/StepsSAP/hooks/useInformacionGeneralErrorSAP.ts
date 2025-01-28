import { useState } from "react";
import { validateMAC } from "../helpers/validateMAC";

interface InformacionGeneralDataForm{
  mac: string;
  puertos: string;
  puertoFTP: string;
}

export const useInformacionGeneralErrorSAP = () => {
  const [informacionGeneralSAPErrors, setInformacionGeneralErrors] = useState<Record<string, boolean>>({
    "mac":false,
    "puertos":false,
    "puertoFTP":false,
  });

  const completeDatosInformacionGeneral = (dataForm: InformacionGeneralDataForm)=>{
    if(dataForm.mac !=="" && dataForm.puertos !=="" 
      && dataForm.puertoFTP!=="" && validateMAC(dataForm.mac)
    ) return true
    return false;
  }

  const handleInformacionGeneralSAPErrors = (formData: InformacionGeneralDataForm) => {
    const fieldsToCheck: (keyof InformacionGeneralDataForm)[] = [
        "mac",
        "puertos",
        "puertoFTP",
    ];
    fieldsToCheck.forEach((field) => {
      if (formData[field] === null || formData[field] === "") {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          [field]: true,
        }));
      }
    });
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

  };

  return { informacionGeneralSAPErrors,handleInformacionGeneralSAPErrors, handleUniqueInformacionGeneralError,completeDatosInformacionGeneral};
};
