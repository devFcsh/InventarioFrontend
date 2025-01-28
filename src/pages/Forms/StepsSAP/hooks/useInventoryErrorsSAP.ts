import { useState } from "react";
import {
  Marca,
  Modelo,
  Serie,
  Ubicacion,
} from "../../../../types";
import {validateInventario} from "../../../../pages/Forms/helpers/validateInventario.ts"

interface InventoryDataForm {
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  inventario: string;
  empresa:string
  ubicacion: Ubicacion;
}

export const useInventoryErrorsSAP = (tipoInventario: string) => {
  const [inventorySAPErrors, setInventorySAPErrors] = useState<Record<string, boolean>>({
    "marca":false,
    "modelo":false,
    "serie":false,
    "inventario":false,
    "empresa":false,
    "ubicacion":false,
  });

  const completeDatosInventario = (dataForm: InventoryDataForm)=>{
    if(tipoInventario==="activo"){
      if(dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !==null &&
        dataForm.inventario !==""  && dataForm.ubicacion!==null && dataForm.empresa!=""
      ) return true
      return false;
    }else{
      if(dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !==null &&
        dataForm.inventario !==""
      ) return true
      return false;
    }
  }

  const handleInventorySAPErrors = (formData: InventoryDataForm) => {
    const fieldsToCheck: (keyof InventoryDataForm)[] = [
      "marca",
      "modelo",
      "serie",
      "inventario",
      "empresa",
      "ubicacion",
    ];
    if(tipoInventario==="activo"){
      fieldsToCheck.forEach((field) => {
        if (formData[field] === null || formData[field] === "") {
          setInventorySAPErrors((prevErrors) => ({
            ...prevErrors,
            [field]: true,
          }));
        }
      });
    }else{
      fieldsToCheck.forEach((field) => {
        if(field==="ubicacion") return
        if (formData[field] === null || formData[field] === "") {
          setInventorySAPErrors((prevErrors) => ({
            ...prevErrors,
            [field]: true,
          }));
        }
      });
    }
  };

  const handleUniqueInventarioSAPError = (tipo: keyof InventoryDataForm, value:  Marca | Modelo | Serie | string  | Ubicacion | null,formData:InventoryDataForm) => {
    setInventorySAPErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === ""? true : false,
    }));
    if (tipo === "inventario") {
      if (!validateInventario(value,formData.empresa)) {
        setInventorySAPErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: true
        }));
      } else {
        setInventorySAPErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: false
        }));
      }
    } 
  };

  return { inventorySAPErrors,handleInventorySAPErrors, handleUniqueInventarioSAPError,completeDatosInventario};
};
