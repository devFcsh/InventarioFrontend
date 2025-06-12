import React, { useEffect, useState } from "react";
import { Autocomplete, IconButton } from "@mui/material";
import { TextField, Snackbar, Alert } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import useUsos from "@hooks/useUsos";
import { useUsuariosFiltrados } from "../hooks/useUsuariosFiltrados";
import { FiltrosUsuario, Uso, Usuario } from "../../../../types/index";
import { filas } from "../../../../data";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import useEliminarUsuario from "../hooks/useEliminarUsuario";

const Usuarios = () => {
  const [selectedUso, setSelectedUso] = useState<string | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning">("success"); 
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [openModal, setOpenModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

  const { eliminarUsuario } = useEliminarUsuario();
  const { usos } = useUsos();
  const { usuarios } = useUsuariosPorUso(selectedUso || "");

  const filtros: FiltrosUsuario = {
    usoId: selectedUso,
    usuarioId: selectedUsuario,
  };

  const { usuariosFiltrados, totalCount, loading, error } =
    useUsuariosFiltrados(filtros, currentPage, rowsPerPage, shouldFetch);

  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.snackbarMessage) {
      setSnackbarMessage(location.state.snackbarMessage);
      setSnackbarSeverity(location.state.snackbarSeverity || "success");
      setOpenSnackbar(true);
    }
  }, [location]);

  useEffect(() => {
    if (totalCount > 0 && rowsPerPage > 0) {
      setTotalPages(Math.ceil(totalCount / rowsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [totalCount, rowsPerPage]);

  useEffect(() => {
    if (shouldFetch) {
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const handleUsoChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: Uso | null
  ) => {
    setSelectedUso(newValue ? newValue.id_uso : null);
    setSelectedUsuario(null);
  };

  const handleUsuarioChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: Usuario | null
  ) => {
    setSelectedUsuario(newValue ? newValue.id_usuario : null);
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    setShouldFetch(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setShouldFetch(true);
    }
  };

  const handleRowsPerPageChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: { id: number; name: string } | null
  ) => {
    const rows = parseInt(newValue?.name || "10", 10);
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (usuarioToDelete) {
      try {
        const result = await eliminarUsuario(usuarioToDelete.id_usuario);
        
        if (result.success) {
          setOpenModal(false);
          setSnackbarMessage("Usuario eliminado con éxito.");
          setSnackbarSeverity("success"); 
          setShouldFetch(true);
        } else {
          setSnackbarMessage("No se puede eliminar el usuario porque tiene equipos asociados.");
          setSnackbarSeverity("error"); 
        }
  
        setOpenSnackbar(true); 
      } catch (error) {
        setSnackbarMessage("Error al eliminar el usuario.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenModal(false);
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
            success: <Icon icon="fluent:checkmark-24-regular" width={20} height={20} />,
            error: <Icon icon="fluent:error-circle-24-regular" width={20} height={20} />,
            warning: <Icon icon="fluent:warning-24-regular" width={20} height={20} />
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold my-5">Consulta de Usuarios</h1>
          <Link to={{ pathname: "/agregarUsuario" }}>
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
            options={usos}
            getOptionLabel={(option) => option?.nombre || ""}
            onChange={handleUsoChange}
            value={usos.find((uso) => uso?.id_uso === selectedUso) || null}
            renderInput={(params) => (
              <TextField {...params} label="Uso" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
          />

          <Autocomplete
            size="small"
            options={usuarios}
            getOptionLabel={(option) => option?.nombre || ""}
            onChange={handleUsuarioChange}
            value={
              usuarios.find(
                (usuario) => usuario?.id_usuario === selectedUsuario
              ) || null
            }
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" />
            )}
            className="w-full md:w-cmbox"
            disabled={!selectedUso}
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
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p>Error al cargar los usuarios</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Uso
                </th>
                <th scope="col" className="px-4 py-3">
                  Usuario
                </th>
                <th scope="col" className="px-4 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr
                  key={usuario.id_usuario}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{usuario.uso}</td>
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <IconButton onClick={() => handleDeleteClick(usuario)}>
                      <Icon
                        icon="weui:delete-outlined"
                        width="25"
                        height="25"
                        className="cursor-pointer"
                      />
                    </IconButton>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Link
                        to={{ pathname: "/editarUsuario" }}
                        state={{ usuario }}
                      >
                        <Icon
                          icon="mage:edit"
                          width="25"
                          height="25"
                          className="cursor-pointer"
                        />
                      </Link>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ModalConfirmation
        open={openModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar a este usuario?"
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
    </div>
  );
};

export default Usuarios;
