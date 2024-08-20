import { Autocomplete, TextField, Label } from '@mui/material';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface Item {
  id: string;
  name: string;
}

interface Equipo {
  id: string;
  periferico: string;
  marca: string;
  modelo: string;
  serie: string;
  inventario: string;
  usuario: string;
  uso: string;
  ubicacion: string;
}

const equipos: Equipo[] = [
  {
    id: '1',
    periferico: 'Computadora',
    marca: 'Lenovo',
    modelo: 'Ideapad',
    serie: '3000',
    inventario: 'INV001',
    usuario: 'Juan Pérez',
    uso: 'Oficina',
    ubicacion: 'Sala 1'
  },
  {
    id: '2',
    periferico: 'Computadora',
    marca: 'Dell',
    modelo: 'Lexus',
    serie: '2832',
    inventario: 'INV002',
    usuario: 'Ana Gómez',
    uso: 'Diseño',
    ubicacion: 'Sala 2'
  },
  {
    id: '3',
    periferico: 'Laptop',
    marca: 'Asus',
    modelo: 'Ideapad',
    serie: '9343',
    inventario: 'INV003',
    usuario: 'Carlos Díaz',
    uso: 'Trabajo remoto',
    ubicacion: 'Oficina en casa'
  },
  {
    id: '4',
    periferico: 'Laptop',
    marca: 'HP',
    modelo: 'Lexus',
    serie: '3000',
    inventario: 'INV004',
    usuario: 'María López',
    uso: 'Administración',
    ubicacion: 'Sala 3'
  },
  {
    id: '5',
    periferico: 'Computadora',
    marca: 'Lenovo',
    modelo: 'Ideapad',
    serie: '2832',
    inventario: 'INV005',
    usuario: 'José Martínez',
    uso: 'Desarrollo',
    ubicacion: 'Sala 4'
  },
  {
    id: '6',
    periferico: 'Laptop',
    marca: 'Dell',
    modelo: 'Lexus',
    serie: '9343',
    inventario: 'INV006',
    usuario: 'Laura Fernández',
    uso: 'Investigación',
    ubicacion: 'Sala 5'
  },
  {
    id: '7',
    periferico: 'Computadora',
    marca: 'Asus',
    modelo: 'Ideapad',
    serie: '3000',
    inventario: 'INV007',
    usuario: 'Roberto Silva',
    uso: 'Soporte técnico',
    ubicacion: 'Sala 6'
  },
  {
    id: '8',
    periferico: 'Laptop',
    marca: 'HP',
    modelo: 'Lexus',
    serie: '2832',
    inventario: 'INV008',
    usuario: 'Patricia Morales',
    uso: 'Gerencia',
    ubicacion: 'Sala 7'
  },
  {
    id: '9',
    periferico: 'Computadora',
    marca: 'Lenovo',
    modelo: 'Ideapad',
    serie: '9343',
    inventario: 'INV009',
    usuario: 'Luis Sánchez',
    uso: 'Contabilidad',
    ubicacion: 'Sala 8'
  },
  {
    id: '10',
    periferico: 'Laptop',
    marca: 'Asus',
    modelo: 'Lexus',
    serie: '3000',
    inventario: 'INV010',
    usuario: 'Elena Torres',
    uso: 'Marketing',
    ubicacion: 'Sala 9'
  }
];

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
          <p className='ml-5 text-lg'>Uso</p>
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Uso" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />
          <p className='ml-5 text-lg'>Usuario</p>
          <Autocomplete
            size="small"
            disablePortal
            options={modelos}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />
        </div>
      </div>

      <div className="mb-4">
      
      </div>
    </div>
    </div>
  );
};

export default AgregarActivo;