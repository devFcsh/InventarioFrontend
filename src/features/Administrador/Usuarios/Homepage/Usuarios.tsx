import React, { useEffect, useState } from "react";
import { Autocomplete, IconButton, Tooltip } from "@mui/material";
import { TextField } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import useUsos from "@hooks/useUsos";
import { useUsuariosFiltrados } from "../hooks/useUsuariosFiltrados";
import { FiltrosUsuario, Uso, Usuario } from "../../../../types/index";
import { filas } from "../../../../data";
import ModalConfirmation from "../../../../components/ModalConfirmation";
import useEliminarUsuario from "../hooks/useEliminarUsuario";
import { useSnackbar } from "@context/SnackbarContext";

const Usuarios = () => {
  const [selectedUso, setSelectedUso] = useState<string | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [openModal, setOpenModal] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

  const { showMessage } = useSnackbar();
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
      showMessage(location.state.snackbarMessage, location.state.snackbarSeverity || "success");
    }
  }, [location, showMessage]);

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
          showMessage("Usuario eliminado con éxito.", "success");
          setShouldFetch(true);
        } else {
          showMessage(
            "No se puede eliminar el usuario porque tiene equipos asociados.", "error");
        }

      } catch (error) {
        showMessage("Error al eliminar el usuario.", "error");
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenModal(false);
  };

  return (
    <div className="flex flex-col p-4">
      <div className="mb-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold my-5">Usuarios Responsables</h1>
          <Link to={{ pathname: "/agregarUsuario" }}>
            <Tooltip title="Agregar Usuario">
              <span>
                <Icon
                  icon="gridicons:add"
                  width="30"
                  height="30"
                  className="text-green-900 hover:text-green-950"
                />
              </span>
            </Tooltip>
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
          <p>Cargando usuarios responsables...</p>
        ) : error ? (
          <p>Error al cargar los usuarios responsables</p>
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
                      <Tooltip title="Eliminar Usuario">
                        <span>
                          <Icon
                            icon="weui:delete-outlined"
                            width="25"
                            height="25"
                            className="cursor-pointer"
                          />
                        </span>
                      </Tooltip>
                    </IconButton>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Link
                        to={{ pathname: "/editarUsuario" }}
                        state={{ usuario }}
                      >
                        <Tooltip title="Editar Usuario">
                          <span>
                            <Icon
                              icon="mage:edit"
                              width="25"
                              height="25"
                              className="cursor-pointer"
                            />
                          </span>
                        </Tooltip>
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
              <Tooltip title="Página Anterior">
                <span>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <Icon
                      icon="iconamoon:arrow-left-2"
                      width="20"
                      height="20"
                    />
                  </button>
                </span>
              </Tooltip>
            </li>
            <li>
              <div className="flex items-center justify-center text-sm py-2 px-5 leading-tight border border-gray-300 text-gray-900 bg-white">
                Página {currentPage} de {totalPages}
              </div>
            </li>
            <li>
              <Tooltip title="Siguiente Página">
                <span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-full py-1.5 px-3 text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <Icon
                      icon="iconamoon:arrow-right-2"
                      width="20"
                      height="20"
                    />
                  </button>
                </span>
              </Tooltip>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Usuarios;
