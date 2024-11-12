import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import { Icon } from "@iconify/react";
import useEquiposPorUsuario from "../hooks/useEquiposPorUsuario";
import useCambiarUsuarioEquipo from "../hooks/useCambiarUsuarioEquipo";
import ModalCambiarUsuario from "../../pages/ModalCambiarUsuario";

const EditarUsuario = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { usuario } = location.state || {}; 

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [equipoId, setEquipoId] = useState<string | null>(null);

  const { equipos, loading: loadingEquipos, error: errorEquipos, refetch: refetchEquipos } = useEquiposPorUsuario(usuario?.id_usuario || "");

  const { cambiarUsuario, loading: loadingCambio } = useCambiarUsuarioEquipo();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate("/usuarios"); 
    }
  }, [usuario, navigate]);

  const handleSave = () => {
    setSnackbarMessage("Usuario actualizado correctamente");
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCambiarUsuario = (equipoId: string) => {
    setEquipoId(equipoId);
    setOpenModal(true); 
  };

  const handleConfirmarCambio = async (usuarioId: string) => {
    if (equipoId) {
      try {
        await cambiarUsuario(equipoId, usuarioId);
        setSnackbarMessage("Usuario cambiado correctamente al equipo");
        setOpenSnackbar(true);
        setOpenModal(false); 

        refetchEquipos(); 

      } catch (error) {
        setSnackbarMessage("Error al cambiar el usuario del equipo");
        setOpenSnackbar(true);
      }
    }
  };

  if (loadingEquipos) {
    return <div>Cargando equipos...</div>; 
  }

  if (errorEquipos) {
    return <div>Error al obtener los equipos: {errorEquipos}</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10">Editar Usuario</h1>

      <div className="flex flex-col gap-4 mb-14">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextField
            label="Nombre del Usuario"
            variant="outlined"
            fullWidth
            size="small"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Equipos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border">Periférico</th>
                <th className="py-2 px-4 border">Marca</th>
                <th className="py-2 px-4 border">Modelo</th>
                <th className="py-2 px-4 border">Serie</th>
                <th className="py-2 px-4 border">Inventario</th>
                <th className="py-2 px-4 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">No hay equipos asignados a este usuario.</td>
                </tr>
              ) : (
                equipos.map((equipo, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">{equipo.periferico}</td>
                    <td className="py-2 px-4 border">{equipo.marca}</td>
                    <td className="py-2 px-4 border">{equipo.modelo}</td>
                    <td className="py-2 px-4 border">{equipo.serie}</td>
                    <td className="py-2 px-4 border">{equipo.inventario}</td>
                    <td className="py-2 px-4 border">
                      <Icon
                        icon="material-symbols:compare-arrows-rounded"
                        width="25"
                        height="25"
                        className="cursor-pointer"
                        onClick={() => handleCambiarUsuario(equipo.id_equipo)} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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

      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          disabled={loadingCambio}
        >
          Guardar cambios
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/usuarios")}
          fullWidth
        >
          Cancelar
        </Button>
      </div>

      <ModalCambiarUsuario
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmarCambio}
      />
    </div>
  );
};

export default EditarUsuario;