import { useState } from "react";
import {
    Marca,
    Modelo,
    Periferico,
    Serie,
    Ubicacion,
  } from "../../../../types";

interface InventoryDataForm{
  marca: Marca;
  modelo: Modelo;
  serie: string;
  periferico: Periferico;
  inventario: string;
  anio_compra: string,
  empresa:string;
  ubicacion: Ubicacion;
}


export const useFormDatosInventarioSAP = () => {
  const [inventoryDataSAPForm, setInventoryDataSAPForm] = useState<InventoryDataForm>({
    marca: null,
    modelo:  null,
    periferico: null,
    serie: "",
    inventario:  "",
    anio_compra: "",
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
      ...(field === 'marca' && value && typeof value !== 'string' && 'id_marca' in value ? { modelo: null } : {}),
      ...(field === 'marca' && value === null? { modelo: null } : {}),
      ...(field === 'empresa' && value === null? { inventario: "" } : {}),
      ...(field === 'empresa' && value? { inventario: "" } : {}),
    }));
  };
  
  
  return { inventoryDataSAPForm, handleInventorySAPChange };
};
