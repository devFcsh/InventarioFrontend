import { useState } from "react";
import {
    SistemaOperativo,
    Dominio,
    Antivirus,
    VersionOffice,
    RAM,
    Disco,
    VersionSO
  } from "../../../../../../../types";

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
}

export const useInformacionGeneralError = () => {
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
  });

  const completeDatosInformacionGeneral = (dataForm: InformacionGeneralDataForm)=>{
    console.log(dataForm)
    if(dataForm.sistemaOperativo !==null && dataForm.versionSO!==null
      &&dataForm.dominio !==null && dataForm.nombreEquipo !=="" &&
      dataForm.versionOffice !==null && dataForm.protocolo !=="" && dataForm.antivirus !==null && dataForm.ram!==null &&dataForm.disco!==null
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
    ];

    fieldsToCheck.forEach((field) => {
      if (formData[field] === null || formData[field] === "") {
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          [field]: true,
        }));
      }
      if(field==="direccionIP" && formData["protocolo"]==="0"){
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: true,
        }));
      }
      if(field==="direccionIP" && formData["protocolo"]==="1"){
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: false,
        }));
      }
    });
  };

  const handleUniqueInformacionGeneralError = (tipo: keyof InformacionGeneralDataForm, value: SistemaOperativo | VersionSO | Dominio | VersionOffice | Antivirus | string | RAM | Disco | null) => {
    if(tipo==="protocolo" || tipo==="direccionIP"){
      if(value==="0"){
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: true,
          ["protocolo"]:false
        }));
      }
      else if(value==="1"){
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: false,
          ["protocolo"]:false
        }));
      }else{
        setInformacionGeneralErrors((prevErrors) => ({
          ...prevErrors,
          ["direccionIP"]: true,
          ["protocolo"]:true
        }));
      }
    }else{
      setInformacionGeneralErrors((prevErrors) => ({
        ...prevErrors,
        [tipo]: value === null || value === "" ? true : false,
      }));
    }
  };

  return { informacionGeneralErrors,handleInformacionGeneralErrors, handleUniqueInformacionGeneralError,completeDatosInformacionGeneral};
};
