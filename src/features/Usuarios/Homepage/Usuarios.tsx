import React, { useEffect, useState } from "react";
import { Autocomplete } from "@mui/material";
import { TextField, Snackbar, Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import useUsuariosPorUso from "@hooks/useUsuariosPorUso";
import useUsos from "@hooks/useUsos";
import { useUsuariosFiltrados } from "../hooks/useUsuariosFiltrados";
import { FiltrosUsuario } from "../../../types/index";

const Usuarios = () => {
  const [selectedUso, setSelectedUso] = useState<string>();
  const [selectedUsuario, setSelectedUsuario] = useState<string>();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const { usos } = useUsos();
  const { usuarios } = useUsuariosPorUso(selectedUso || "");
  
  const filtros: FiltrosUsuario = {
    usoId: selectedUso,
    usuarioId: selectedUsuario,
  };

  const { usuariosFiltrados, totalCount, loading, error } = useUsuariosFiltrados(
    filtros,
    currentPage,
    rowsPerPage,
    shouldFetch
  );

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

  const handleUsoChange = (event, newValue) => {
    setSelectedUso(newValue);
    setSelectedUsuario(undefined); 
  };

  const handleUsuarioChange = (event, newValue) => {
    setSelectedUsuario(newValue);
  };

  const handleBuscar = () => {
    setCurrentPage(1);
    setShouldFetch(true);
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
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="mb-4">
        <h1 className="text-2xl font-bold my-5">Consulta de Usuarios</h1>
        <div className="flex flex-wrap gap-4 my-10">
          <Autocomplete
            size="small"
            options={usos}
            getOptionLabel={(option) => option.nombre}
            onChange={handleUsoChange}
            value={selectedUso}
            renderInput={(params) => (
              <TextField {...params} label="Uso" variant="outlined" />
            )}
          />

          <Autocomplete
            size="small"
            options={usuarios}
            getOptionLabel={(option) => option.nombre}
            onChange={handleUsuarioChange}
            value={selectedUsuario}
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" />
            )}
            disabled={!selectedUso}
          />

          <div className="flex flex-col w-full md:w-1/5 md:flex-row gap-4 md:gap-2 lg:ml-2">
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
          <p>Cargando equipos...</p>
        ) : error ? (
          <p>Error al cargar los equipos</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3">Uso</th>
                <th scope="col" className="px-4 py-3">Usuario</th>
                <th scope="col" className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id_usuario} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{usuario.uso}</td>
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Link to={`/editarActivo/${usuario.nombre}`}>
                      <Icon icon="mage:edit" width="25" height="25" className="cursor-pointer" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
