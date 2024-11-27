import { useState } from "react";
import {
  Marca,
  Modelo,
  Serie,
  Edificio,
  Aula,
  Usuario,
  Uso,
} from "../../../../../../../types";


interface InventoryDataForm {
  uso: Uso;
  usuario: Usuario;
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  inventario: string;
  edificio: Edificio;
  aula: Aula;
  usoId: string;
  usuarioId: string;
}

export const useInventoryErrors = () => {
  const [inventoryErrors, setInventoryErrors] = useState<Record<string, boolean>>({
    "uso":false,
    "usuario":false,
    "marca":false,
    "modelo":false,
    "serie":false,
    "inventario":false,
    "edificio":false,
    "aula":false,
  });

  const completeDatosInventario = (dataForm: InventoryDataForm)=>{
    if(dataForm.uso !==null && dataForm.usuario!==null
      &&dataForm.marca !==null && dataForm.modelo !==null &&
      dataForm.modelo !==null && dataForm.serie !==null &&
      dataForm.inventario !=="" && dataForm.edificio !==null && dataForm.aula &&null
    ) return true
    return false;
  }

  const handleInventoryErrors = (formData: InventoryDataForm) => {
    const fieldsToCheck: (keyof InventoryDataForm)[] = [
      "uso",
      "usuario",
      "marca",
      "modelo",
      "serie",
      "inventario",
      "edificio",
      "aula",
    ];

    fieldsToCheck.forEach((field) => {
      if (formData[field] === null || formData[field] === "") {
        setInventoryErrors((prevErrors) => ({
          ...prevErrors,
          [field]: true,
        }));
      }
    });
  };

  const handleUniqueError = (tipo: keyof InventoryDataForm, value: Uso | Usuario | Marca | Modelo | Serie | string | Edificio | Aula | null) => {
    setInventoryErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null || value === "" ? true : false,
    }));
  };

  return { inventoryErrors,handleInventoryErrors, handleUniqueError,completeDatosInventario};
};
