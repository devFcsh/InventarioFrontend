import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import useSubirImagen from "@hooks/useSubirImagen";

interface StepCargarImagenProps {
  handleFormData: any
}

export const StepCargarImagen = ({
  handleFormData
}: StepCargarImagenProps) => {
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadImage } = useSubirImagen();

  const handleImageChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      handleUploadImage(file);
    }
  };
  const handleUploadImage = async(file: File)=>{ 
    let imagePath = "";
    if (file) {
      try {
        imagePath = await uploadImage(file);
      } catch (error) {
        alert("Error al cargar la imagen.");
        return;
      }
    }
    handleFormData(imagePath,"image") 
  }
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <Box>
      <div className="mt-8">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div
            onClick={handleImageClick}
            className="w-full max-w-sm h-48 border border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">Haz clic para cargar una imagen</p>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

