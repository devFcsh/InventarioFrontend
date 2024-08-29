import { useState } from "react";
import { Autocomplete, TextField, Button } from '@mui/material';
import { Equipo } from "../types";

interface Item {
    id: string;
    name: string;
}
  
  const marcas: Item[] = [
    { id: '1', name: 'Lenovo' },
    { id: '2', name: 'Dell' },
    { id: '3', name: 'Asus' },
    { id: '4', name: 'HP' }
  ];
  
  const modelos: Item[] = [
    { id: '1', name: 'Ideapad' },
    { id: '2', name: 'Lexus' },
    { id: '3', name: 'Vostro' }
  ];
  
  const series: Item[] = [
    { id: '1', name: '3000' },
    { id: '2', name: '2832' },
    { id: '3', name: '9343' }
  ];
  
  interface EditarOtroActivoProps {
    equipo: Equipo;
  }

const EditarOtroActivo = ({ equipo }: EditarOtroActivoProps) => {
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

    
      const handleAgregarEquipo = () => {
        console.log('Imagen:', image);
      };

    return (
        <>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Uso" variant="outlined" fullWidth />
            )}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" fullWidth />
            )}
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-5">Información de Inventario</h2>
          <div className="grid grid-cols-2 gap-4">
            <Autocomplete
              size="small"
              disablePortal
              options={marcas}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Marca" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={modelos}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Modelo" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={series}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Serie" variant="outlined" fullWidth />
              )}
            />
            <TextField
              label="Inventario"
              placeholder="Inventario"
              variant="outlined"
              fullWidth
              size='small'
            />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-5">Cargar Imagen</h2>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
            <div className="w-full flex justify-center">
              <img
                src={image ? image.toString() : 'https://via.placeholder.com/150'}
                alt="Vista previa"
                className="w-full max-w-xs h-auto object-cover border border-gray-300"
              />
            </div>
          </div>
        </div>

      <div className="flex gap-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleAgregarEquipo}
          fullWidth
        >
          Agregar Equipo
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {}}
          fullWidth
        >
          Cancelar
        </Button>
      </div>
      </>
    )
}

export default EditarOtroActivo
