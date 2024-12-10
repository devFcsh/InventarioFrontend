import { useState } from "react";
import {
    Marca,
    Modelo,
    Serie,
    Edificio,
    Aula,
    Usuario,
    Uso,
  } from "../../../types";

interface InventoryDataForm{
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


export const useFormDatosInventario = () => {
  const [inventoryDataForm, setInventoryDataForm] = useState<InventoryDataForm>({
    uso: null,
    usuario:  null,
    marca: null,
    modelo:  null,
    serie: null,
    inventario:  "",
    edificio:  null,
    aula: null,
    usoId: "",
    usuarioId: "",
  });

  const handleInventoryChange = (
    field: keyof InventoryDataForm,
    value: Uso | Usuario | Marca | Modelo | Serie | string | Edificio | Aula | null
  ) => {
    setInventoryDataForm((prevState) => ({
      ...prevState,
      [field]: value,
      ...(field === 'uso' && value && typeof value !== 'string' && 'id_uso' in value ? { usoId: value.id_uso } : {}),
      ...(field === 'usuario' && value && typeof value !== 'string' && 'id_usuario' in value ? { usuarioId: value.id_usuario } : {}),
      ...(field === 'marca' && value && typeof value !== 'string' && 'id_marca' in value ? { modelo: null, serie: null } : {}),
      ...(field === 'modelo' && value && typeof value !== 'string' && 'id_modelo' in value ? { serie: null } : {}),
      ...(field === 'edificio' && value && typeof value !== 'string' && 'id_edificio' in value ? { aula: null } : {}),
      ...(field === 'uso' && value === null? { usoId: "" } : {}),
      ...(field === 'marca' && value === null? { modelo: null, serie: null } : {}),
      ...(field === 'modelo' && value === null? {serie: null } : {}),
      ...(field === 'edificio' && value === null? { aula: null } : {}),
    }));
  };
  
  
  return { inventoryDataForm, handleInventoryChange };
};
