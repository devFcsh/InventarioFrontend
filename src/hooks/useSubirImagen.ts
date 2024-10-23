import { useState } from 'react';
import clienteAxios from '.';

const useSubirImagen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    setLoading(true);
    setError(null); 
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await clienteAxios.post('/equipos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imagePath; 
    } catch (err) {
      setError("Error al cargar la imagen: " + err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading, error };
};

export default useSubirImagen;
