import { useState } from "react";
import {
    SistemaOperativo,
    Dominio,
    Antivirus,
    VersionOffice,
    RAM,
    Disco,
    VersionSO,
    Procesador
  } from "../../../types";
import {validateIP} from "../../../pages/Forms/helpers/validateIP.ts"

interface InformacionGeneralDataForm{
  sistemaOperativo: SistemaOperativo;
  versionSO: VersionSO;
  dominio: Dominio;
  nombreEquipo: string;
  versionOffice: VersionOffice;
  protocolo: string;
  direccionIP: string;
  antivirus: Antivirus;
  ram: RAM;
  disco: Disco;
  procesador: Procesador
}

export const useInformacionGeneralError = (dataForm: InformacionGeneralDataForm) => {
  const [informacionGeneralErrors, setInformacionGeneralErrors] = useState<Record<string, boolean>>({
    "sistemaOperativo":false,
    "versionSO":false,
    "dominio":false,
    "nombreEquipo":false,
    "versionOffice":false,
    "protocolo":false,
    "direccionIP":false,
    "antivirus":false,
    "ram":false,
    "disco":false,
    "procesador": false
  });

  const completeDatosInformacionGeneral = ()=>{
    if(dataForm.sistemaOperativo !==null && dataForm.versionSO!==null
      &&dataForm.dominio !==null && dataForm.nombreEquipo !=="" &&
      dataForm.versionOffice !==null && dataForm.protocolo !=="" && dataForm.antivirus !==null && dataForm.ram!==null &&dataForm.disco!==null
      && (dataForm.protocolo==="0"?validateIP(dataForm.direccionIP):true)
      && dataForm.nombreEquipo.length === 14
      && dataForm.procesador !== null
    ) return true
    return false;
  }

  const handleInformacionGeneralErrors = (formData: InformacionGeneralDataForm) => {
    const newErrors: Record<string, boolean> = {};
    
    const fieldsToCheck: (keyof InformacionGeneralDataForm)[] = [
        "sistemaOperativo",
        "versionSO",
        "dominio",
        "nombreEquipo",
        "versionOffice",
        "protocolo",
        "antivirus",
        "ram",
        "disco",
        "procesador"
    ];
    
    fieldsToCheck.forEach((field) => {
      newErrors[field] = formData[field] === null || formData[field] === "";
    });

    if (formData.nombreEquipo && formData.nombreEquipo.length !== 14) {
      newErrors["nombreEquipo"] = true;
    }

    if (formData.protocolo === "0") {
      newErrors["direccionIP"] = !formData.direccionIP || !validateIP(formData.direccionIP);
    } else {
      newErrors["direccionIP"] = false;
    }

    setInformacionGeneralErrors(newErrors);
  };

  const handleUniqueInformacionGeneralError = (tipo: keyof InformacionGeneralDataForm, value: any) => {
    setInformacionGeneralErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      
      switch (tipo) {
        case "direccionIP":
          if (dataForm.protocolo === "0") {
            newErrors["direccionIP"] = !value || !validateIP(value);
          } else {
            newErrors["direccionIP"] = false;
          }
          break;
          
        case "protocolo":
          if (value === "1") {
            newErrors["direccionIP"] = false;
          } else if (value === "0") {
            newErrors["direccionIP"] = !dataForm.direccionIP || !validateIP(dataForm.direccionIP);
          }
          newErrors["protocolo"] = !value;
          break;
          
        case "nombreEquipo":
          newErrors["nombreEquipo"] = !value || value.length !== 14;
          break;
          
        default:
          newErrors[tipo] = value === null || value === "";
          break;
      }
      
      return newErrors;
    });
  };

  return { 
    informacionGeneralErrors,
    handleInformacionGeneralErrors, 
    handleUniqueInformacionGeneralError,
    completeDatosInformacionGeneral
  };
};
