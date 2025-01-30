import { useState } from "react";
import {
  Lampara,
    Marca,
    Modelo,
    Serie,
    Ubicacion,
    Usuario,
  } from "../../../types";

interface InventoryDataForm{
  usuario: Usuario;
  marca: Marca;
  modelo: Modelo;
  serie: Serie;
  inventario: string;
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
    serie: null,
    inventario:  "",
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
      ...(field === 'marca' && value && typeof value !== 'string' && 'id_marca' in value ? { modelo: null, serie: null,lampara:null } : {}),
      ...(field === 'modelo' && value && typeof value !== 'string' && 'id_modelo' in value ? { serie: null,lampara:null } : {}),
      ...(field === 'marca' && value === null? { modelo: null, serie: null, lampara:null } : {}),
      ...(field === 'modelo' && value === null? {serie: null , lampara:null} : {}),
      ...(field === 'usuario' && value === null? { usuarioId: "" } : {}),
      ...(field === 'empresa' && value === null? { inventario: "" } : {}),
      ...(field === 'empresa' && value? { inventario: "" } : {}),
    }));
  };
  
  
  return { inventoryDataForm, handleInventoryChange };
};
