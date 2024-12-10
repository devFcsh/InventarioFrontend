import { useState } from "react";
import { Componente } from "../../../types/Activo/Componente/index.ts";


export const useFormDataComponentes = () => {
    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [showSuccessMessageComponentes, setShowSuccessMessageComponentes] = useState(false);

  const eliminarComponente = (index: number) => {
    setComponentes(componentes.filter((_, i) => i !== index));
  };




  const handleAddComponents = (nuevoComponente:Componente) => {
    const existeInventario = componentes.some(componente => componente.inventario === nuevoComponente.inventario);
    if(existeInventario) return;
    setShowSuccessMessageComponentes(true);
    setComponentes([...componentes, nuevoComponente]);
  };
  
  
  return { componentes, handleAddComponents,eliminarComponente,showSuccessMessageComponentes,setShowSuccessMessageComponentes };
};
