import React, { useRef, useState } from "react";
import { Box } from "@mui/material";

interface StepCargarImagenProps {
  imageData: any;
  handleImageChange:any;
}

export const StepCargarImagen = ({
  imageData,
  handleImageChange,
}: StepCargarImagenProps) => {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
            {imageData.image ? (
              <img
                src={URL.createObjectURL(imageData.image)}
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

