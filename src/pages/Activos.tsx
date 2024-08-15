import { Autocomplete, TextField } from "@mui/material";
import { Icon } from "@iconify/react";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import ModalConfirmation from "../components/ModalConfirmation";

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
    id: "1",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV001",
    usuario: "Juan Pérez",
    uso: "Oficina",
    ubicacion: "Sala 1",
  },
  {
    id: "2",
    periferico: "Computadora",
    marca: "Dell",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV002",
    usuario: "Ana Gómez",
    uso: "Diseño",
    ubicacion: "Sala 2",
  },
  {
    id: "3",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV003",
    usuario: "Carlos Díaz",
    uso: "Trabajo remoto",
    ubicacion: "Oficina en casa",
  },
  {
    id: "4",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV004",
    usuario: "María López",
    uso: "Administración",
    ubicacion: "Sala 3",
  },
  {
    id: "5",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "2832",
    inventario: "INV005",
    usuario: "José Martínez",
    uso: "Desarrollo",
    ubicacion: "Sala 4",
  },
  {
    id: "6",
    periferico: "Laptop",
    marca: "Dell",
    modelo: "Lexus",
    serie: "9343",
    inventario: "INV006",
    usuario: "Laura Fernández",
    uso: "Investigación",
    ubicacion: "Sala 5",
  },
  {
    id: "7",
    periferico: "Computadora",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV007",
    usuario: "Roberto Silva",
    uso: "Soporte técnico",
    ubicacion: "Sala 6",
  },
  {
    id: "8",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV008",
    usuario: "Patricia Morales",
    uso: "Gerencia",
    ubicacion: "Sala 7",
  },
  {
    id: "9",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV009",
    usuario: "Luis Sánchez",
    uso: "Contabilidad",
    ubicacion: "Sala 8",
  },
  {
    id: "10",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV010",
    usuario: "Elena Torres",
    uso: "Marketing",
    ubicacion: "Sala 9",
  },
  {
    id: "11",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV001",
    usuario: "Juan Pérez",
    uso: "Oficina",
    ubicacion: "Sala 1",
  },
  {
    id: "12",
    periferico: "Computadora",
    marca: "Dell",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV002",
    usuario: "Ana Gómez",
    uso: "Diseño",
    ubicacion: "Sala 2",
  },
  {
    id: "13",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV003",
    usuario: "Carlos Díaz",
    uso: "Trabajo remoto",
    ubicacion: "Oficina en casa",
  },
  {
    id: "14",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV004",
    usuario: "María López",
    uso: "Administración",
    ubicacion: "Sala 3",
  },
  {
    id: "15",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "2832",
    inventario: "INV005",
    usuario: "José Martínez",
    uso: "Desarrollo",
    ubicacion: "Sala 4",
  },
  {
    id: "16",
    periferico: "Laptop",
    marca: "Dell",
    modelo: "Lexus",
    serie: "9343",
    inventario: "INV006",
    usuario: "Laura Fernández",
    uso: "Investigación",
    ubicacion: "Sala 5",
  },
  {
    id: "17",
    periferico: "Computadora",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV007",
    usuario: "Roberto Silva",
    uso: "Soporte técnico",
    ubicacion: "Sala 6",
  },
  {
    id: "18",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV008",
    usuario: "Patricia Morales",
    uso: "Gerencia",
    ubicacion: "Sala 7",
  },
  {
    id: "19",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV009",
    usuario: "Luis Sánchez",
    uso: "Contabilidad",
    ubicacion: "Sala 8",
  },
  {
    id: "20",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV010",
    usuario: "Elena Torres",
    uso: "Marketing",
    ubicacion: "Sala 9",
  },
  {
    id: "1",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV001",
    usuario: "Juan Pérez",
    uso: "Oficina",
    ubicacion: "Sala 1",
  },
  {
    id: "2",
    periferico: "Computadora",
    marca: "Dell",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV002",
    usuario: "Ana Gómez",
    uso: "Diseño",
    ubicacion: "Sala 2",
  },
  {
    id: "3",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV003",
    usuario: "Carlos Díaz",
    uso: "Trabajo remoto",
    ubicacion: "Oficina en casa",
  },
  {
    id: "4",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV004",
    usuario: "María López",
    uso: "Administración",
    ubicacion: "Sala 3",
  },
  {
    id: "5",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "2832",
    inventario: "INV005",
    usuario: "José Martínez",
    uso: "Desarrollo",
    ubicacion: "Sala 4",
  },
  {
    id: "6",
    periferico: "Laptop",
    marca: "Dell",
    modelo: "Lexus",
    serie: "9343",
    inventario: "INV006",
    usuario: "Laura Fernández",
    uso: "Investigación",
    ubicacion: "Sala 5",
  },
  {
    id: "7",
    periferico: "Computadora",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV007",
    usuario: "Roberto Silva",
    uso: "Soporte técnico",
    ubicacion: "Sala 6",
  },
  {
    id: "8",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV008",
    usuario: "Patricia Morales",
    uso: "Gerencia",
    ubicacion: "Sala 7",
  },
  {
    id: "9",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV009",
    usuario: "Luis Sánchez",
    uso: "Contabilidad",
    ubicacion: "Sala 8",
  },
  {
    id: "10",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV010",
    usuario: "Elena Torres",
    uso: "Marketing",
    ubicacion: "Sala 9",
  },
  {
    id: "11",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV001",
    usuario: "Juan Pérez",
    uso: "Oficina",
    ubicacion: "Sala 1",
  },
  {
    id: "12",
    periferico: "Computadora",
    marca: "Dell",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV002",
    usuario: "Ana Gómez",
    uso: "Diseño",
    ubicacion: "Sala 2",
  },
  {
    id: "13",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV003",
    usuario: "Carlos Díaz",
    uso: "Trabajo remoto",
    ubicacion: "Oficina en casa",
  },
  {
    id: "14",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV004",
    usuario: "María López",
    uso: "Administración",
    ubicacion: "Sala 3",
  },
  {
    id: "15",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "2832",
    inventario: "INV005",
    usuario: "José Martínez",
    uso: "Desarrollo",
    ubicacion: "Sala 4",
  },
  {
    id: "16",
    periferico: "Laptop",
    marca: "Dell",
    modelo: "Lexus",
    serie: "9343",
    inventario: "INV006",
    usuario: "Laura Fernández",
    uso: "Investigación",
    ubicacion: "Sala 5",
  },
  {
    id: "17",
    periferico: "Computadora",
    marca: "Asus",
    modelo: "Ideapad",
    serie: "3000",
    inventario: "INV007",
    usuario: "Roberto Silva",
    uso: "Soporte técnico",
    ubicacion: "Sala 6",
  },
  {
    id: "18",
    periferico: "Laptop",
    marca: "HP",
    modelo: "Lexus",
    serie: "2832",
    inventario: "INV008",
    usuario: "Patricia Morales",
    uso: "Gerencia",
    ubicacion: "Sala 7",
  },
  {
    id: "19",
    periferico: "Computadora",
    marca: "Lenovo",
    modelo: "Ideapad",
    serie: "9343",
    inventario: "INV009",
    usuario: "Luis Sánchez",
    uso: "Contabilidad",
    ubicacion: "Sala 8",
  },
  {
    id: "20",
    periferico: "Laptop",
    marca: "Asus",
    modelo: "Lexus",
    serie: "3000",
    inventario: "INV010",
    usuario: "Elena Torres",
    uso: "Marketing",
    ubicacion: "Sala 9",
  },
];

const perifericos: Item[] = [
  { id: "1", name: "Computadora" },
  { id: "2", name: "Laptop" },
];

const filas = [
  { id: 10, name: "10" },
  { id: 20, name: "20" },
  { id: 50, name: "50" },
  { id: 100, name: "100" },
];

const Activos = () => {
  const [selectedPeriferico, setSelectedPeriferico] = useState<Item | null>(
    null
  );
  const [selectedMarca, setSelectedMarca] = useState<Item | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<Item | null>(null);
  const [selectedSerie, setSelectedSerie] = useState<Item | null>(null);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>(equipos);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({
    title: "Confirmar",
    message: "¿Estás seguro de que deseas realizar esta acción?",
  });

  const marcas = useMemo(() => {
    if (!selectedPeriferico) return [];
    return Array.from(
      new Set(
        equipos
          .filter((equipo) => equipo.periferico === selectedPeriferico.name)
          .map((equipo) => equipo.marca)
      )
    ).map((marca) => ({ id: marca, name: marca }));
  }, [selectedPeriferico]);

  const modelos = useMemo(() => {
    if (!selectedPeriferico || !selectedMarca) return [];
    return Array.from(
      new Set(
        equipos
          .filter(
            (equipo) =>
              equipo.periferico === selectedPeriferico.name &&
              equipo.marca === selectedMarca.name
          )
          .map((equipo) => equipo.modelo)
      )
    ).map((modelo) => ({ id: modelo, name: modelo }));
  }, [selectedPeriferico, selectedMarca]);

  const series = useMemo(() => {
    if (!selectedPeriferico || !selectedMarca || !selectedModelo) return [];
    return Array.from(
      new Set(
        equipos
          .filter(
            (equipo) =>
              equipo.periferico === selectedPeriferico.name &&
              equipo.marca === selectedMarca.name &&
              equipo.modelo === selectedModelo.name
          )
          .map((equipo) => equipo.serie)
      )
    ).map((serie) => ({ id: serie, name: serie }));
  }, [selectedPeriferico, selectedMarca, selectedModelo]);

  const inventarios = useMemo(() => {
    if (
      !selectedPeriferico ||
      !selectedMarca ||
      !selectedModelo ||
      !selectedSerie
    )
      return [];
    return Array.from(
      new Set(
        equipos
          .filter(
            (equipo) =>
              equipo.periferico === selectedPeriferico.name &&
              equipo.marca === selectedMarca.name &&
              equipo.modelo === selectedModelo.name &&
              equipo.serie === selectedSerie.name
          )
          .map((equipo) => equipo.inventario)
      )
    ).map((inventario) => ({ id: inventario, name: inventario }));
  }, [selectedPeriferico, selectedMarca, selectedModelo, selectedSerie]);

  const handleOpenModal = (
    id: string,
    title: string,
    message: string,
    action: () => void
  ) => {
    setSelectedEquipoId(id);
    setModalContent({ title, message });
    setConfirmAction(() => action);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEquipoId(null);
  };

  const handleConfirm = () => {
    console.log("entrando a handleconfirm");
    confirmAction();
    handleCloseModal();
  };

  const deleteEquipo = () => {
    console.log(`entrando a delete con id ${selectedEquipoId}`)
    if (selectedEquipoId) {
      console.log(`Equipo con ID ${selectedEquipoId} eliminado`);
    }
  };

  const bajaEquipo = () => {
    if (selectedEquipoId) {
      console.log(`Equipo con ID ${selectedEquipoId} dado de baja`);
    }
  };

  const handlePerifericoChange = (
    _event: React.ChangeEvent<HTMLElement>,
    newValue: Item | null
  ) => {
    setSelectedPeriferico(newValue);
    setSelectedMarca(null);
    setSelectedModelo(null);
    setSelectedSerie(null);
  };

  const handleMarcaChange = (
    _event: React.ChangeEvent<HTMLElement>,
    newValue: Item | null
  ) => {
    setSelectedMarca(newValue);
    setSelectedModelo(null);
    setSelectedSerie(null);
  };

  const handleModeloChange = (
    _event: React.ChangeEvent<HTMLElement>,
    newValue: Item | null
  ) => {
    setSelectedModelo(newValue);
    setSelectedSerie(null);
  };

  const handleSerieChange = (
    _event: React.ChangeEvent<HTMLElement>,
    newValue: Item | null
  ) => {
    setSelectedSerie(newValue);
  };

  const handleBuscar = () => {
    const filtered = equipos.filter((equipo) => {
      return (
        (selectedPeriferico
          ? equipo.periferico === selectedPeriferico.name
          : true) &&
        (selectedMarca ? equipo.marca === selectedMarca.name : true) &&
        (selectedModelo ? equipo.modelo === selectedModelo.name : true) &&
        (selectedSerie ? equipo.serie === selectedSerie.name : true)
      );
    });
    setFilteredEquipos(filtered);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelectedItems, id];
      }
    });
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedItems(equipos.map((equipo) => equipo.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleRowsPerPageChange = (
    _event: React.ChangeEvent<HTMLElement>,
    newValue: Item | null
  ) => {
    const rows = parseInt(newValue?.name || "10", 10);
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredEquipos.length / rowsPerPage);
  const paginatedEquipos = filteredEquipos.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      paginatedEquipos.map(
        ({
          id,
          periferico,
          marca,
          modelo,
          serie,
          inventario,
          usuario,
          uso,
          ubicacion,
        }) => ({
          Periférico: periferico,
          Marca: marca,
          Modelo: modelo,
          Serie: serie,
          Inventario: inventario,
          Usuario: usuario,
          Uso: uso,
          Ubicación: ubicacion,
        })
      )
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    XLSX.writeFile(wb, "datos_equipos.xlsx");
  };

  return (
    <div className="flex flex-col p-4">
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold my-5">Consulta de Activos</h1>
          <Link to={"/agregarActivo"}>
            <Icon
              icon="gridicons:add"
              width="30"
              height="30"
              className="text-green-900 hover:text-green-950"
            />
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 my-10">
          <Autocomplete
            size="small"
            disablePortal
            options={perifericos}
            getOptionLabel={(option) => option.name}
            onChange={handlePerifericoChange}
            value={selectedPeriferico}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label="Periférico" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />
          <Autocomplete
            size="small"
            disablePortal
            options={marcas}
            getOptionLabel={(option) => option.name}
            onChange={handleMarcaChange}
            value={selectedMarca}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label="Marca" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
            disabled={!selectedPeriferico}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={modelos}
            getOptionLabel={(option) => option.name}
            onChange={handleModeloChange}
            value={selectedModelo}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label="Modelo" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
            disabled={!selectedMarca}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={series}
            getOptionLabel={(option) => option.name}
            onChange={handleSerieChange}
            value={selectedSerie}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField {...params} label="Serie" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
            disabled={!selectedModelo}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={inventarios}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Inventario" variant="outlined" />
            )}
            value={null}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            className="w-full md:w-cmbox"
            disabled={!selectedSerie}
          />
          <div className="flex flex-col w-full md:w-1/5 md:flex-row gap-4 md:gap-2 lg:ml-2">
            <Autocomplete
              size="small"
              disablePortal
              options={filas}
              onChange={handleRowsPerPageChange}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Filas" variant="outlined" />
              )}
              value={filas.find((option) => option.id === rowsPerPage)}
              className="w-full md:w-1/2"
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full md:w-1/2"
              onClick={handleBuscar}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs uppercase bg-gray-50 text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={handleSelectAllChange}
                  checked={selectedItems.length === equipos.length}
                />
              </th>
              <th scope="col" className="px-4 py-3">
                Periférico
              </th>
              <th scope="col" className="px-4 py-3">
                Marca
              </th>
              <th scope="col" className="px-4 py-3">
                Modelo
              </th>
              <th scope="col" className="px-4 py-3">
                Serie
              </th>
              <th scope="col" className="px-4 py-3">
                Inventario
              </th>
              <th scope="col" className="px-4 py-3">
                Usuario
              </th>
              <th scope="col" className="px-4 py-3">
                Uso
              </th>
              <th scope="col" className="px-4 py-3">
                Ubicación
              </th>
              <th scope="col" className="px-4 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEquipos.map((equipo) => (
              <tr
                key={equipo.id}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(equipo.id)}
                    onChange={() => handleCheckboxChange(equipo.id)}
                  />
                </td>
                <td className="px-4 py-2">{equipo.periferico}</td>
                <td className="px-4 py-2">{equipo.marca}</td>
                <td className="px-4 py-2">{equipo.modelo}</td>
                <td className="px-4 py-2">{equipo.serie}</td>
                <td className="px-4 py-2">{equipo.inventario}</td>
                <td className="px-4 py-2">{equipo.usuario}</td>
                <td className="px-4 py-2">{equipo.uso}</td>
                <td className="px-4 py-2">{equipo.ubicacion}</td>
                <td className="px-4 py-3 flex items-center gap-2 max-w-[15rem] truncate text-black">
                  <Icon
                    icon="ph:arrow-fat-down-light"
                    width="25"
                    height="25"
                    onClick={() =>
                      handleOpenModal(
                        equipo.id,
                        "Dar de baja equipo",
                        `¿Estás seguro de que deseas dar de baja el equipo ${equipo.id}?`,
                        bajaEquipo
                      )
                    }
                    className="cursor-pointer"
                  />
                  <Icon
                    icon="weui:delete-outlined"
                    width="25"
                    height="25"
                    onClick={() =>
                      handleOpenModal(
                        equipo.id,
                        "Eliminar equipo",
                        `¿Estás seguro de que deseas eliminar el equipo ${equipo.id}?`,
                        deleteEquipo
                      )
                    }
                    className="cursor-pointer"
                  />
                  <Icon icon="mage:edit" width="25" height="25" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500">
          Mostrando
          <span className="font-semibold text-gray-900">
            {" "}
            {paginatedEquipos.length}{" "}
          </span>
          de
          <span className="font-semibold text-gray-900">
            {" "}
            {filteredEquipos.length}{" "}
          </span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              <Icon icon="iconamoon:arrow-left-2" width="20" height="20" />
            </button>
          </li>
          <li>
            <div className="flex items-center justify-center text-sm py-2 px-5 leading-tight border border-gray-300 text-gray-500 bg-white">
              {currentPage}
            </div>
          </li>
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              <Icon icon="iconamoon:arrow-right-2" width="20" height="20" />
            </button>
          </li>
          <li>
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight ml-5 text-darkgray bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-black"
            >
              <Icon icon="ph:export" width="20" height="20" />
            </button>
          </li>
        </ul>
      </nav>
      <ModalConfirmation
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={modalContent.title}
        message={modalContent.message}
      />
    </div>
  );
};

export default Activos;
