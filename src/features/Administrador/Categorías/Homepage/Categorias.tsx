import { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import { filas } from "../../../../data";

import ModalAgregarCategoria from "../AgregarCategoria/Homepage/ModalAgregarCategoria";
import ModalEditarCategoria from "../EditarCategoria/Homepage/ModalEditarCategoria";
const categorias = [
  "Uso",
  "Periférico",
  "Marca",
  "Modelo",
  "Serie",
  "Lampara",
  "Edificio",
  "Ubicación",
  "Sistema Operativo",
  "Versión SO",
  "Dominio",
  "Versión Office",
  "RAM",
  "Disco",
  "Procesador"
];

const itemsData = [
  { id: 1, categoria: "Uso" },
  { id: 3, categoria: "Marca" },
  { id: 4, categoria: "Modelo" },
  { id: 5, categoria: "Periférico" },
  { id: 6, categoria: "Serie" },
  { id: 7, categoria: "Edificio" },
  { id: 8, categoria: "Ubicación" },
  { id: 9, categoria: "Sistema Operativo" },
  { id: 10, categoria: "Versión SO" },
  { id: 11, categoria: "Dominio" },
  { id: 12, categoria: "RAM" },
  { id: 13, categoria: "Disco" },
  { id: 14, categoria: "Procesador" },
  { id: 15, categoria: "Versión Office" },
  { id: 16, categoria: "Lampara" },

];

type FilteredItem = {
  id: number;
  categoria: string;
};

const Categorias = () => {
  
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(
    null
  );
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [openModalAgregar, setOpenModalAgregar] = useState<boolean>(false);
  const [openModalEditar, setOpenModalEditar] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemCategoria, setSelectedItemCategoria] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filteredItems, setFilteredItems] = useState<FilteredItem[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning"
  >("success");

  const location = useLocation();

  const handleCategoriaChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: string | null
  ) => {
    setSelectedCategoria(newValue);
  };

  const handleBuscar = () => {
    const filtered: FilteredItem[] = itemsData.filter((item) =>
      selectedCategoria ? item.categoria === selectedCategoria : true
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: { id: number; name: string } | null
  ) => {
    setRowsPerPage(parseInt(newValue?.name || "10", 10));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (filteredItems.length > 0 && rowsPerPage > 0) {
      setTotalPages(Math.ceil(filteredItems.length / rowsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [filteredItems, rowsPerPage]);

  useEffect(() => {
    if (location.state && location.state.snackbarMessage) {
      setSnackbarMessage(location.state.snackbarMessage);
      setSnackbarSeverity(location.state.snackbarSeverity || "success");
      setOpenSnackbar(true);
    }
  }, [location]);

  const handleOpenModalAgregar = () => {
    setOpenModalAgregar(true);
  };

  const handleCloseModalAgregar = () => {
    setOpenModalAgregar(false);
    setError(null);
    setSnackbarMessage("Categoría agregada exitosamente");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCloseCancelarModalAgregar = () => {
    setOpenModalAgregar(false);
    setError(null);
  };
  

  const handleOpenModalEditar = () => {
    setOpenModalEditar(true);
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setError(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="flex flex-col p-4">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          iconMapping={{
            success: (
              <Icon icon="fluent:checkmark-24-regular" width={20} height={20} />
            ),
            error: (
              <Icon
                icon="fluent:error-circle-24-regular"
                width={20}
                height={20}
              />
            ),
            warning: (
              <Icon icon="fluent:warning-24-regular" width={20} height={20} />
            ),
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="mb-4">
        <h1 className="text-2xl font-bold my-5">Consulta de Categorías</h1>

        <div className="flex gap-4 my-10">
          <Autocomplete
            size="small"
            options={categorias}
            getOptionLabel={(option) => option}
            onChange={handleCategoriaChange}
            value={selectedCategoria || null}
            renderInput={(params) => (
              <TextField {...params} label="Categoría" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
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
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500 my-5">No hay datos disponibles. Presiona "Buscar" para cargar resultados.</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Categoría
                </th>
                <th scope="col" className="px-4 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems
                .slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                )
                .map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{item.categoria}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                        <Icon
                          icon="mage:edit"
                          width="30"
                          height="30"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedItemCategoria(item.categoria);
                            handleOpenModalEditar();
                          }}
                        />
                      <Icon
                        icon="gridicons:add"
                        width="30"
                        height="30"
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedItemCategoria(item.categoria);
                          handleOpenModalAgregar();
                        }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <ModalConfirmation
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirmar Acción"
        message="¿Estás seguro de que deseas continuar?"
      />

      <nav
        className="flex flex-col md:flex-row justify-between items-center p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500"></span>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              >
                <Icon icon="iconamoon:arrow-left-2" width="20" height="20" />
              </button>
            </li>
            <li>
              <div className="flex items-center justify-center text-sm py-2 px-5 leading-tight border border-gray-300 text-gray-900 bg-white">
                Página {currentPage} de {totalPages}
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
          </ul>
        </div>
      </nav>
      <ModalAgregarCategoria
        open={openModalAgregar}
        onClose={handleCloseModalAgregar}
        selectedCategoria={selectedItemCategoria}
        error={error}
        setError={setError}
        handleCloseCancelarModalAgregar={handleCloseCancelarModalAgregar}
      />
      <ModalEditarCategoria
        open={openModalEditar}
        onClose={handleCloseModalEditar}
        selectedCategoria={selectedItemCategoria}
        error={error}
        setError={setError}
      />
    </div>
  );
};

export default Categorias;
