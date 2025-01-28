import { useState } from "react";
import {
    Marca,
    Modelo,
    Serie,
    Ubicacion,
  } from "../../../../types";

interface InventoryDataForm{
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  inventario: string;
  empresa:string;
  ubicacion: Ubicacion;
}


export const useFormDatosInventarioSAP = () => {
  const [inventoryDataSAPForm, setInventoryDataSAPForm] = useState<InventoryDataForm>({
    marca: null,
    modelo:  null,
    serie: null,
    inventario:  "",
    empresa:"",
    ubicacion: null,
  });

  const handleInventorySAPChange = (
    field: keyof InventoryDataForm,
    value:  Marca | Modelo | Serie | string  | Ubicacion | null
  ) => {
    setInventoryDataSAPForm((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === 'marca' && value && typeof value !== 'string' && 'id_marca' in value ? { modelo: null, serie: null } : {}),
      ...(field === 'modelo' && value && typeof value !== 'string' && 'id_modelo' in value ? { serie: null } : {}),
      ...(field === 'marca' && value === null? { modelo: null, serie: null } : {}),
      ...(field === 'modelo' && value === null? {serie: null } : {}),
      ...(field === 'empresa' && value === null? { inventario: "" } : {}),
      ...(field === 'empresa' && value? { inventario: "" } : {}),
    }));
  };
  
  
  return { inventoryDataSAPForm, handleInventorySAPChange };
};
