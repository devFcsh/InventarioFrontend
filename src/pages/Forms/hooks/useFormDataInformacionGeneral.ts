import { useState } from "react";
import {
    SistemaOperativo,
    Dominio,
    Antivirus,
    VersionOffice,
    RAM,
    Disco,
    VersionSO
  } from "../../../types/index";

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


export const useFormDataInformacionGeneral = () => {
  const [informacionGeneralDataForm, setInformacionGeneralDataForm] = useState<InformacionGeneralDataForm>({
    sistemaOperativo: null,
    versionSO: null,
    dominio: null,
    nombreEquipo: "",
    versionOffice: null,
    protocolo: "",
    direccionIP: "",
    antivirus: null,
    ram: null,
    disco: null,
  });

  const handleInformacionGeneralChange = (
    field: keyof InformacionGeneralDataForm,
    value: SistemaOperativo | VersionSO | Dominio | VersionOffice | Antivirus | RAM | Disco | string | null
  ) => {
    setInformacionGeneralDataForm((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === 'sistemaOperativo' && value && typeof value !== 'string' && 'id_sistemaoperativo' in value ? { versionSO: null} : {}),
      ...(field === 'protocolo' && value && typeof value === 'string'? { direccionIP: "" } : {}),
      ...(field === 'sistemaOperativo' && value === null? { versionSO: null} : {}),
      ...(field === 'protocolo' && value === null? { direccionIP: "" } : {}),
    }));
  };
  
  
  return { informacionGeneralDataForm, handleInformacionGeneralChange };
};
