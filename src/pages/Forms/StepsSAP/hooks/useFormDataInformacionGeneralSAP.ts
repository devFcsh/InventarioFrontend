import { useState } from "react";

interface InformacionGeneralDataForm{
  mac: string;
  puertos: string;
  puertoFTP: string;
  nombreEquipo:string;
}


export const useFormDataInformacionGeneralSAP = () => {
  const [informacionGeneralDataSAPForm, setInformacionGeneralDataSAPForm] = useState<InformacionGeneralDataForm>({
    mac: "",
    puertos: "",
    puertoFTP: "",
    nombreEquipo: ""
  });

  const handleInformacionGeneralSAPChange = (
    field: keyof InformacionGeneralDataForm,
    value: string | null
  ) => {
    setInformacionGeneralDataSAPForm((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };
  
  
  return { informacionGeneralDataSAPForm, handleInformacionGeneralSAPChange };
};
