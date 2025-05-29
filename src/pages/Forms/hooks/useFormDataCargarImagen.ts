import { useState } from "react";
import useSubirImagen from "@hooks/useSubirImagen";

interface imagenDataForm {
  image: File | null;
  imagePath: string;
}

export const useFormDataCargarImagen = () => {
  const [imageData, setImageData] = useState<imagenDataForm>({
    image: null,
    imagePath: "",
  });

  const { uploadImage, error } = useSubirImagen();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImagenDataForm("image", file);
      handleUploadImage(file);
    }
  };
  const handleUploadImage = async (file: File) => {
    let imagePath = "";
    if (file) {
      try {
        imagePath = await uploadImage(file);
        handleImagenDataForm("imagePath", imagePath);
      } catch (error) {
        alert("Error al cargar la imagen.");
        return;
      }
    }
  };

  const handleImagenDataForm = (
    field: keyof imagenDataForm,
    value: File | string | null
  ) => {
    setImageData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return { imageData, handleImageChange, error };
};
