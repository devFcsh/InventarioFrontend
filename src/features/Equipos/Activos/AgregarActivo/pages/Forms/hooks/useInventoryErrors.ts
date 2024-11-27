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
  const [inventoryErrors, setInventoryErrors] = useState({});

  const handleInventoryErrors = (formData: InventoryDataForm) => {
    const errors: Record<string, boolean> = {};
    
    const fieldsToCheck: (keyof InventoryDataForm)[] = [
      "uso",
      "usuario",
      "marca",
      "modelo",
      "serie",
      "inventario",
      "edificio",
      "aula",
      "usoId",
      "usuarioId",
    ];

    fieldsToCheck.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        errors[field] = true;
      }
    });

    setInventoryErrors(errors);
  };

  const handleUniqueError = (tipo: keyof InventoryDataForm)=>{
    setInventoryErrors({
        ...inventoryErrors,
        [tipo]: false
    })
  }

  return { inventoryErrors, handleInventoryErrors,handleUniqueError};
};
