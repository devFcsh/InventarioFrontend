import { useState } from "react";
interface imagenDataForm {
    image: File | null;
  }

export const useCargarImagenErrors = () => {
  const [cargarImagenErrors, setCargarImagenErrors] = useState<Record<string, boolean>>({
    "image":false
  });

  const completeDatosCargarImagen = (dataForm: imagenDataForm)=>{
    if(dataForm.image !==null) return true
    return false;
  }

  const handleCargarImagenErrors = (formData: imagenDataForm) => {
    const fieldsToCheck: (keyof imagenDataForm)[] = [
      "image",
    ];

    fieldsToCheck.forEach((field) => {
      if (formData[field] === null) {
        setCargarImagenErrors((prevErrors) => ({
          ...prevErrors,
          [field]: true,
        }));
      }
    });
  };

  const handleUniqueCargarImagenError = (tipo: keyof imagenDataForm, value: File | null) => {
    setCargarImagenErrors((prevErrors) => ({
      ...prevErrors,
      [tipo]: value === null? true : false,
    }));
  };

  return { cargarImagenErrors,handleCargarImagenErrors, handleUniqueCargarImagenError,completeDatosCargarImagen};
};
