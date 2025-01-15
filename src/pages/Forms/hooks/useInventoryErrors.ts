import { useState } from "react";
import {
  Marca,
  Modelo,
  Serie,
  Ubicacion,
  Usuario,
} from "../../../types";


interface InventoryDataForm {
  usuario: Usuario;
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  inventario: string;
  ubicacion: Ubicacion;
  usuarioId: string;
}

export const useInventoryErrors = (tipoInventario: string) => {
  const [inventoryErrors, setInventoryErrors] = useState<Record<string, boolean>>({
    "usuario":false,
    "marca":false,
    "modelo":false,
    "serie":false,
    "inventario":false,
    "ubicacion":false,
  });

  const completeDatosInventario = (dataForm: InventoryDataForm)=>{
    if(tipoInventario==="activo"){
      if(dataForm.usuario!==null
        &&dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !==null &&
        dataForm.inventario !==""  && dataForm.ubicacion!==null
      ) return true
      return false;
    }else{
      if(dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !==null &&
        dataForm.inventario !==""
      ) return true
      return false;
    }
  }

  const handleInventoryErrors = (formData: InventoryDataForm) => {
    const fieldsToCheck: (keyof InventoryDataForm)[] = [
      "usuario",
      "marca",
      "modelo",
      "serie",
      "inventario",
      "ubicacion",
    ];
    if(tipoInventario==="activo"){
      fieldsToCheck.forEach((field) => {
        if (formData[field] === null || formData[field] === "") {
          setInventoryErrors((prevErrors) => ({
            ...prevErrors,
            [field]: true,
          }));
        }
      });
    }else{
      fieldsToCheck.forEach((field) => {
        if(field === "usuario") return
        if(field==="ubicacion") return
        if (formData[field] === null || formData[field] === "") {
          setInventoryErrors((prevErrors) => ({
            ...prevErrors,
            [field]: true,
          }));
        }
      });
    }
  };

  const handleUniqueInventarioError = (tipo: keyof InventoryDataForm, value: Usuario | Marca | Modelo | Serie | string  | Ubicacion | null) => {
    setInventoryErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === ""? true : false,
    }));
  };

  return { inventoryErrors,handleInventoryErrors, handleUniqueInventarioError,completeDatosInventario};
};
