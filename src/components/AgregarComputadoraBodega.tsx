import { useState } from "react";
import { Autocomplete, TextField, Button } from '@mui/material';

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
  
  interface Componente {
    periferico: string;
    marca: string;
    modelo: string;
    serie: string;
    inventario: string;
  }

  interface AgregarComputadoraActivoProps {
    periferico: Item;
  }

const AgregarComputadoraBodega = ({ periferico }: AgregarComputadoraActivoProps) => {
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [nuevoComponente, setNuevoComponente] = useState<Componente>({
        periferico: '',
        marca: '',
        modelo: '',
        serie: '',
        inventario: ''
    });
    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [protocolo, setProtocolo] = useState<string | null>(null);
    const [direccionIP, setDireccionIP] = useState<string>('');

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
    
      const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>, field: keyof Componente) => {
        const { value } = e.target;
        setNuevoComponente((prev) => ({
          ...prev,
          [field]: value as string
        }));
      };
    
      const handleAutocompleteChange = (event: any, newValue: Item | null, field: keyof Componente) => {
        setNuevoComponente((prev) => ({
          ...prev,
          [field]: newValue ? newValue.name : ''
        }));
      };
    
      const agregarComponente = () => {
        setComponentes([...componentes, nuevoComponente]);
        setNuevoComponente({
          periferico: '',
          marca: '',
          modelo: '',
          serie: '',
          inventario: ''
        });
      };
    
      const handleAgregarEquipo = () => {
        console.log('Componentes:', componentes);
        console.log('Protocolo:', protocolo);
        console.log('Dirección IP:', direccionIP);
        console.log('Periferico:', periferico?.name)
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
          <h2 className="text-xl font-semibold mb-5">Información General</h2>
          <div className="grid grid-cols-2 gap-4">
            <Autocomplete
              size="small"
              disablePortal
              options={marcas}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Sistema Operativo" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={modelos}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Versión Sistema Operativo" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={series}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Antivirus" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Versión Office" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Cantidad RAM" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Tipo RAM" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={[{ id: '1', name: 'Estático' }, { id: '2', name: 'Dinámico' }]}
              getOptionLabel={(option) => option.name}
              value={protocolo ? { name: protocolo } : null}
              onChange={(event, newValue) => setProtocolo(newValue ? newValue.name : '')}
              renderInput={(params) => (
                <TextField {...params} label="Protocolo" variant="outlined" fullWidth />
              )}
            />
            <TextField
              label="Dirección IP"
              placeholder="Dirección IP"
              variant="outlined"
              fullWidth
              size='small'
              value={direccionIP}
              onChange={(e) => setDireccionIP(e.target.value)}
              disabled={protocolo !== 'Estático'}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Almacenamiento Disco" variant="outlined" fullWidth />
              )}
            />
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Dominio" variant="outlined" fullWidth />
              )}
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

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-5">Componentes</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 border">Periférico</th>
                    <th className="py-2 px-4 border">Marca</th>
                    <th className="py-2 px-4 border">Modelo</th>
                    <th className="py-2 px-4 border">Serie</th>
                    <th className="py-2 px-4 border">Inventario</th>
                  </tr>
                </thead>
                <tbody>
                  {componentes.map((comp, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">{comp.periferico}</td>
                      <td className="py-2 px-4 border">{comp.marca}</td>
                      <td className="py-2 px-4 border">{comp.modelo}</td>
                      <td className="py-2 px-4 border">{comp.serie}</td>
                      <td className="py-2 px-4 border">{comp.inventario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={perifericos}
                  getOptionLabel={(option) => option.name}
                  value={perifericos.find(p => p.name === nuevoComponente.periferico) || null}
                  onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'periferico')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Periférico"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={marcas}
                  getOptionLabel={(option) => option.name}
                  value={marcas.find(m => m.name === nuevoComponente.marca) || null}
                  onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'marca')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Marca"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={modelos}
                  getOptionLabel={(option) => option.name}
                  value={modelos.find(m => m.name === nuevoComponente.modelo) || null}
                  onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'modelo')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Modelo"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Autocomplete
                  size="small"
                  disablePortal
                  options={series}
                  getOptionLabel={(option) => option.name}
                  value={series.find(s => s.name === nuevoComponente.serie) || null}
                  onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'serie')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Serie"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <TextField
                  label="Inventario"
                  placeholder="Inventario"
                  variant="outlined"
                  fullWidth
                  size='small'
                  value={nuevoComponente.inventario}
                  onChange={(e) => handleChange(e, 'inventario')}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={agregarComponente}
                  fullWidth
                >
                  Agregar Componente
                </Button>
              </div>
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

export default AgregarComputadoraBodega
