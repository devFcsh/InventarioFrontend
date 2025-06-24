import { useState } from "react";
import { Marca, Modelo, Serie, Periferico } from "../../../types/index.ts";
import { validateInventario } from "../helpers/validateInventario.ts";

interface ComponentsData {
  periferico: Periferico;
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  empresa: string;
  inventario: string;
}

export const useErrorsComponents = () => {
  const [componentsErrors, setComponentsErrors] = useState<
    Record<string, boolean>
  >({
    periferico: false,
    marca: false,
    modelo: false,
    serie: false,
    inventario: false,
    empresa: false,
  });

  const completeDatosComponents = (components: ComponentsData) => {
    if (
      components.periferico !== null &&
      components.marca !== null &&
      components.modelo !== null &&
      components.serie !== null &&
      components.inventario !== "" &&
      components.empresa != ""
    )
      return true;

    return false;
  };

  const handleComponentsErrors = (components: ComponentsData) => {
    const fieldsToCheck: (keyof ComponentsData)[] = [
      "periferico",
      "marca",
      "modelo",
      "serie",
      "inventario",
      "empresa",
    ];
    const newErrors: Record<string, boolean> = {};
    fieldsToCheck.forEach((field) => {
      if (components[field] === null || components[field] === "") {
        newErrors[field] = true;
      } else {
        newErrors[field] = false;
      }
    });
    setComponentsErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
    return newErrors;
  };

  const handleUniqueComponentsError = (
    tipo: keyof ComponentsData,
    value: any,
    componentsData: ComponentsData
  ) => {
    setComponentsErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === "" ? true : false,
    }));
    if (tipo === "inventario") {
      if (!validateInventario(value, componentsData.empresa)) {
        setComponentsErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: true,
        }));
      } else {
        setComponentsErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: false,
        }));
      }
    }
  };

  return {
    componentsErrors,
    handleComponentsErrors,
    handleUniqueComponentsError,
    completeDatosComponents,
  };
};
