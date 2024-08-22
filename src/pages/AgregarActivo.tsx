import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

interface Item {
  id: string;
  name: string;
}

const perifericos: Item[] = [
  { id: '1', name: 'Computadora' },
  { id: '2', name: 'Laptop' }
];

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

const filas: Item[] = [
  { id: '1', name: '10' },
  { id: '2', name: '20' },
  { id: '3', name: '30' },
  { id: '4', name: '50' },
  { id: '5', name: '100' }
];

const AgregarActivo = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
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

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <div className="flex flex-col p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold my-5">Registro de Activo</h1>
          <div className="flex flex-wrap gap-4 my-14 max-w-5xl mx-auto">
            <p className='text-lg'>Periférico</p>
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Periférico" variant="outlined" />
              )}
              className="w-full md:w-cmbox"
            />
            <p className='text-lg'>Uso</p>
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Uso" variant="outlined" />
              )}
              className="w-full md:w-cmbox"
            />
            <p className='text-lg'>Usuario</p>
            <Autocomplete
              size="small"
              disablePortal
              options={perifericos}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Usuario" variant="outlined" />
              )}
              className="w-full md:w-cmbox"
            />

          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold my-5">Información General</h2>
            <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto">
              {/* Columna 1 */}
              <div className="flex flex-col gap-4">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={marcas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Sistema Operativ" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={modelos}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Antivirus" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={series}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Almacenamiento (Disco)" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Dominio" variant="outlined" />
                  )}
                  className="w-full"
                />
                                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Nombre Equipo" variant="outlined" />
                  )}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-4">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Versión Sistema Operativo" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Protocolo" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Memoria RAM" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Protocolo" variant="outlined" />
                  )}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold my-5">Datos de inventario</h2>
            <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto">
              <div className="flex flex-col gap-4">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={marcas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Marca" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={modelos}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Modelo" variant="outlined" />
                  )}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-4">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Serie" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Inventario" variant="outlined" />
                  )}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold my-5">Cargar Imagen</h2>
            <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
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
                    className="w-200 h-200 object-cover border border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold my-5">Componentes</h2>
            <div className="grid grid-cols-2 gap-4 max-w-5xl mx-auto">
              <div className="flex flex-col gap-4">
               <table >
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Serie</th>
                  <th>Inventario</th>
                </tr>
                <tr>
                  <td>Marca</td>
                  <td>Modelo</td>
                  <td>Serie</td>
                  <td>Inventario</td>
                </tr>
                <tr>
                  <td>Marca</td>
                  <td>Modelo</td>
                  <td>Serie</td>
                  <td>Inventario</td>
                </tr>
                <tr>
                  <td>Marca</td>
                  <td>Modelo</td>
                  <td>Serie</td>
                  <td>Inventario</td>
                </tr>
               </table>
              </div>
              <div className="flex flex-col gap-4">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Versión Sistema Operativo" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Protocolo" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Memoria RAM" variant="outlined" />
                  )}
                  className="w-full"
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={filas}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Protocolo" variant="outlined" />
                  )}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarActivo;
