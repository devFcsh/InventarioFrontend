import { useState } from "react";
import { Componente } from "../../../../../../../types/Activo/Componente/index.ts";

interface FormData{
  tipo: string;
  inventario: string;
  serie: number;
  nombreEquipo: string;
  direccionIp: string;
  versionso: number;
  versionoffice: number;
  ram: number;
  disco: number;
  antivirus: number;
  dominio: number;
  idAula: number;
  idUsuario: string | null;
  image: File | null;
  componentes: Componente[];
}

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    tipo: "activo",
    inventario: "",
    serie: 0,
    nombreEquipo: "",
    direccionIp: "",
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

  const handleFormData = (newData: any, tipo: keyof FormData) => {
    setFormData((prevData) => ({
      ...prevData,
      [tipo]: newData,
    }));
  };

  return { formData, handleFormData };
};
