import { useState } from "react";
import {
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
    usuarioId: "",
  });

  const handleInventoryChange = (
    field: keyof InventoryDataForm,
    value: Usuario | Marca | Modelo | Serie | string  | Ubicacion | null
  ) => {
    setInventoryDataForm((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === 'usuario' && value && typeof value !== 'string' && 'id_usuario' in value ? { usuarioId: value.id_usuario } : {}),
      ...(field === 'marca' && value && typeof value !== 'string' && 'id_marca' in value ? { modelo: null, serie: null } : {}),
      ...(field === 'modelo' && value && typeof value !== 'string' && 'id_modelo' in value ? { serie: null } : {}),
      ...(field === 'marca' && value === null? { modelo: null, serie: null } : {}),
      ...(field === 'modelo' && value === null? {serie: null } : {}),
      ...(field === 'usuario' && value === null? { usuarioId: "" } : {}),
      ...(field === 'empresa' && value === null? { inventario: "" } : {}),
      ...(field === 'empresa' && value? { inventario: "" } : {}),
    }));
  };
  
  
  return { inventoryDataForm, handleInventoryChange };
};
