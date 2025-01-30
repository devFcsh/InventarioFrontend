import { useState } from "react";
import {
  Lampara,
  Marca,
  Modelo,
  Serie,
  Ubicacion,
  Usuario,
} from "../../../types";
import {validateInventario} from "../../../pages/Forms/helpers/validateInventario.ts"

interface InventoryDataForm {
  usuario: Usuario;
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  inventario: string;
  empresa:string
  ubicacion: Ubicacion;
  usuarioId: string;
  lampara:Lampara;
}

export const useInventoryErrors = (tipoInventario: string,periferico:string | undefined) => {
  const [inventoryErrors, setInventoryErrors] = useState<Record<string, boolean>>({
    "usuario":false,
    "marca":false,
    "modelo":false,
    "serie":false,
    "inventario":false,
    "empresa":false,
    "ubicacion":false,
    "lampara":false
  });

  const completeDatosInventario = (dataForm: InventoryDataForm)=>{
    if(tipoInventario==="activo"){
      if((periferico==="Proyector"?true:dataForm.usuario!==null)
        &&dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !==null &&
        dataForm.inventario !==""  && dataForm.ubicacion!==null && dataForm.empresa!=""
        && (periferico!=="Proyector"?true:dataForm.lampara!==null)
      ) return true
      return false;
    }else{
      if(dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !==null &&
        dataForm.inventario !=="" && (periferico!=="Proyector"?true:dataForm.lampara!==null)
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
      "empresa",
      "ubicacion",
      "lampara"
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
    if(periferico==="Proyector"){
      setInventoryErrors((prevErrors) => ({
        ...prevErrors,
        ["usuario"]: false
      }));
    }
  };

  const handleUniqueInventarioError = (tipo: keyof InventoryDataForm, value: Usuario | Marca | Modelo | Serie | string  | Ubicacion | Lampara | null,formData:InventoryDataForm) => {
    setInventoryErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === ""? true : false,
    }));
    if (tipo === "inventario") {
      if (!validateInventario(value,formData.empresa)) {
        setInventoryErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: true
        }));
      } else {
        setInventoryErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: false
        }));
      }
    } 
  };

  return { inventoryErrors,handleInventoryErrors, handleUniqueInventarioError,completeDatosInventario};
};
