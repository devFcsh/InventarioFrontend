import { useLocation } from 'react-router-dom'
import { Autocomplete, TextField, Button } from '@mui/material';
import EditarComputadoraActivo from '../components/EditarComputadoraActivo';
import EditarOtroActivo from '../components/EditarOtroActivo';

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
  "Computadora", 
  "Laptop"
];

const EditarActivo = () => {

    const location = useLocation()
    const { equipo } = location.state
    console.log(equipo)

  return (
    <div className='w-full max-w-7xl mx-auto p-4'>
      <h1 className="text-2xl font-bold mb-10">Edición de Activo</h1>

      <div className="flex flex-col gap-4 mb-14">
        <div className="mb-4">
          <Autocomplete
            size="small"
            disablePortal
            options={["Computadora", "Laptop"]}
            defaultValue={equipo ? equipo.periferico : null}
            disabled
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Periférico" variant="outlined" fullWidth />
            )}
          />
        </div>
            {computadores.includes(equipo?.periferico) ? 
            
            <EditarComputadoraActivo 
            equipo={equipo}
            /> :

            <EditarOtroActivo 
            equipo={equipo}
            />
          
            }
        
        </div>
    </div>
  );
};

export default EditarActivo
