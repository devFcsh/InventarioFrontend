import { Autocomplete, TextField, Button } from '@mui/material';
import { useState } from 'react';
import AgregarComputadoraActivo from '../components/AgregarComputadoraActivo';
import AgregarOtroActivo from '../components/AgregarOtroActivo';

interface Item {
  id: string;
  name: string;
}

const perifericos: Item[] = [
  { id: '1', name: 'Computadora' },
  { id: '2', name: 'Laptop' },
  { id: '3', name: 'Proyector' },
  { id: '4', name: 'Teclado' }
];

const computadores: string[] = [
  "1", 
  "2"
];


const AgregarActivo = () => {
  
  const [periferico, setPeriferico] = useState<Item | null>(null);

  return (
    <div className='w-full max-w-7xl mx-auto p-4'>
      <h1 className="text-2xl font-bold mb-10">Registro de Activo</h1>

      <div className="flex flex-col gap-4 mb-14">
        <div className="mb-4">
          <Autocomplete
            size="small"
            disablePortal
            options={perifericos}
            value={periferico ? periferico : null}
            onChange={(event, newValue) => setPeriferico(newValue ? newValue : null)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Periférico" variant="outlined" fullWidth />
            )}
          />
        </div>
            {computadores.includes(periferico?.id) ? 
            
            <AgregarComputadoraActivo 
            periferico={periferico}
            /> :

            <AgregarOtroActivo 
            periferico={periferico}
            />
          
            }
        
        </div>
    </div>
  );
};

export default AgregarActivo;
