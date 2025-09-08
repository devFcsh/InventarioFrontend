import { useState } from "react";
import {
  Lampara,
    Marca,
    Modelo,
    Periferico,
    Serie,
    Ubicacion,
    Usuario,
  } from "../../../types";

interface InventoryDataForm{
  usuario: Usuario;
  marca: Marca;
  modelo: Modelo;
  periferico: Periferico;
  serie: string;
  inventario: string;
  anio_compra: string;
  empresa:string;
  lampara: Lampara;
  ubicacion: Ubicacion;
  usuarioId: string;
}


export const useFormDatosInventario = () => {
  const [inventoryDataForm, setInventoryDataForm] = useState<InventoryDataForm>({
    usuario:  null,
    marca: null,
    modelo:  null,
    periferico: null,
    serie: "",
    inventario:  "",
    anio_compra: "",
    empresa:"",
    ubicacion: null,
    lampara: null,
    usuarioId: "",
  });

  const handleInventoryChange = (
    field: keyof InventoryDataForm,
    value: Usuario | Marca | Modelo | Serie | string  | Ubicacion | Lampara | null
  ) => {
    setInventoryDataForm((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === 'usuario' && value && typeof value !== 'string' && 'id_usuario' in value ? { usuarioId: value.id_usuario } : {}),
      ...(field === 'marca' && value && typeof value !== 'string' && 'id_marca' in value ? { modelo: null,lampara:null } : {}),
      ...(field === 'modelo' && value && typeof value !== 'string' && 'id_modelo' in value ? {lampara:null } : {}),
      ...(field === 'marca' && value === null? { modelo: null, lampara:null } : {}),
      ...(field === 'modelo' && value === null? {lampara:null} : {}),
      ...(field === 'usuario' && value === null? { usuarioId: "" } : {}),
      ...(field === 'empresa' && value === null? { inventario: "" } : {}),
      ...(field === 'empresa' && value? { inventario: "" } : {}),
    }));
  };
  
  
  return { inventoryDataForm, handleInventoryChange };
};
