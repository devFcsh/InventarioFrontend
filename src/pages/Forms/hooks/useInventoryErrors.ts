import { useState } from "react";
import {
  Lampara,
  Marca,
  Modelo,
  Ubicacion,
  Usuario,
} from "../../../types";
import {validateInventario} from "../../../pages/Forms/helpers/validateInventario.ts"

interface InventoryDataForm {
  usuario: Usuario;
  marca: Marca;
  modelo: Modelo;
  serie: string;
  inventario: string;
  anio_compra: string;
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
    "anio_compra": false,
    "empresa":false,
    "ubicacion":false,
    "lampara":false
  });

  const completeDatosInventario = (dataForm: InventoryDataForm)=>{
    if(tipoInventario==="activo"){
      if((periferico==="Proyector"?true:dataForm.usuario!==null)
        &&dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !=="" &&
        dataForm.inventario !=="" && dataForm.anio_compra !=="" && dataForm.ubicacion!==null && dataForm.empresa!=""
        && (periferico!=="Proyector"?true:dataForm.lampara!==null)
      ) return true
      return false;
    }else{
      if(dataForm.marca !==null && dataForm.modelo !==null && dataForm.serie !=="" &&
        dataForm.inventario !=="" && dataForm.anio_compra !=="" && (periferico!=="Proyector"?true:dataForm.lampara!==null)
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
      "anio_compra",
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
    if(periferico!=="Proyector"){
      setInventoryErrors((prevErrors) => ({
        ...prevErrors,
        ["lampara"]: false
      }));
    }
  };

  const handleUniqueInventarioError = (tipo: keyof InventoryDataForm, value: any,formData:InventoryDataForm) => {
    setInventoryErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === ""? true : false,
    }));
    if (tipo === "inventario") {
      if (value === "S/N" || validateInventario(value,formData.empresa)) {
        setInventoryErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: false
        }));
      } else {
        setInventoryErrors((prevErrors) => ({
          ...prevErrors,
          ["inventario"]: true
        }));
      }
    } 
  };

  return { inventoryErrors,handleInventoryErrors, handleUniqueInventarioError,completeDatosInventario};
};
