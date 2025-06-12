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

export const useInformacionGeneralError = (_: InformacionGeneralDataForm) => {
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

  const completeDatosInformacionGeneral = (dataForm: InformacionGeneralDataForm)=>{
    if(dataForm.sistemaOperativo !==null && dataForm.versionSO!==null
      &&dataForm.dominio !==null && dataForm.nombreEquipo !=="" &&
      dataForm.versionOffice !==null && dataForm.protocolo !=="" && dataForm.antivirus !==null && dataForm.ram!==null &&dataForm.disco!==null
      && (dataForm.protocolo==="0"?validateIP(dataForm.direccionIP):true)
    ) return true
    return false;
  }

  const handleInformacionGeneralErrors = (formData: InformacionGeneralDataForm) => {
    const fieldsToCheck: (keyof InformacionGeneralDataForm)[] = [
        "sistemaOperativo",
        "versionSO",
        "dominio",
        "nombreEquipo",
        "versionOffice",
        "protocolo",
        "direccionIP",
        "antivirus",
        "ram",
        "disco",
        "procesador"
    ];
    fieldsToCheck.forEach((field) => {
      if (formData[field] === null || formData[field] === "") {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          [field]: true,
        }));
      }
      if(field==="direccionIP" && formData["protocolo"]==="1"){
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: false,
        }));
      }
      if(field==="nombreEquipo" && formData["nombreEquipo"].length!==14){
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["nombreEquipo"]: true
        }));
      }
    });
  };

  const handleUniqueInformacionGeneralError = (tipo: keyof InformacionGeneralDataForm, value: SistemaOperativo | VersionSO | Dominio | VersionOffice | Antivirus | string | RAM | Disco |Procesador| null) => {
  
    setInformacionGeneralErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === "" ? true : false,
    }));
    if (tipo === "direccionIP") {
      if (!validateIP(value)) {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: true
        }));
      } else {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: false
        }));
      }
    }  
    if(tipo==="protocolo" && value==="1"){
      setInformacionGeneralErrors((prevErrors) => ({
        ...prevErrors,
        ["direccionIP"]: false
      }));
    }
    if(tipo==="nombreEquipo" && value?.toString().length===14){
      setInformacionGeneralErrors((prevErrors) => ({
        ...prevErrors,
        ["nombreEquipo"]: false
      }));
    }else{
      setInformacionGeneralErrors((prevErrors) => ({
        ...prevErrors,
        ["nombreEquipo"]: true
      }));
    }
    
  };

  return { informacionGeneralErrors,handleInformacionGeneralErrors, handleUniqueInformacionGeneralError,completeDatosInformacionGeneral};
};
