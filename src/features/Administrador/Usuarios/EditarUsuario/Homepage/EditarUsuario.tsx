import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import useEquiposPorUsuario from "../hooks/useEquiposPorUsuario";
import useCambiarUsuarioEquipo from "../hooks/useCambiarUsuarioEquipo";
import useEditarUsuario from "../hooks/useEditarUsuario";
import ModalCambiarUsuario from "../components/ModalCambiarUsuario";
import useUsos from "@hooks/useUsos";

const EditarUsuario = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { usuario } = location.state || {};

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [selectedUsoId, setSelectedUsoId] = useState<string | null>(
    usuario?.id_uso || null
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [equipoId, setEquipoId] = useState<string | null>(null);

  const { usos, loading: loadingUsos, error: errorUsos } = useUsos();
  const {
    equipos,
    loading: loadingEquipos,
    error: errorEquipos,
    refetch: refetchEquipos,
  } = useEquiposPorUsuario(usuario?.id_usuario || "");

  const {
    cambiarUsuario,
    loading: loadingCambio,
    error,
    success,
  } = useCambiarUsuarioEquipo();

  const {
    editarUsuario,
    loading: loadingEdicion,
    error: errorEdicion,
  } = useEditarUsuario();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate("/usuarios");
    }
  }, [usuario, navigate]);

  const handleSave = async () => {
    try {
      if (nombre && selectedUsoId) {
        await editarUsuario(usuario.id_usuario, nombre, selectedUsoId);
        setSnackbarMessage("Usuario actualizado correctamente");
        setOpenSnackbar(true);

        setTimeout(() => {
          navigate("/usuarios");
        }, 1000);
      } else {
        setSnackbarMessage("Por favor, complete todos los campos.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Error al actualizar el usuario");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/usuarios");
      }, 1000);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCambiarUsuario = (equipoId: string) => {
    setEquipoId(equipoId);
    setOpenModal(true);
  };

  useEffect(() => {
    if (success) {
      setSnackbarMessage("Usuario cambiado correctamente al equipo");
      refetchEquipos();
      setOpenModal(false);
    }
    if (error) {
      setSnackbarMessage("No se puede cambiar de usuario a un componente");
    }
    if (success || error) {
      setOpenSnackbar(true);
    }
  }, [success, error]);

  const handleConfirmarCambio = async (usuarioId: string) => {
    if (equipoId) {
      await cambiarUsuario(equipoId, usuarioId);
    }
  };

  if (loadingEquipos || loadingEdicion || loadingUsos) {
    return <div>Cargando...</div>;
  }

  if (errorEquipos || errorEdicion || errorUsos) {
    return <div> {errorEquipos || errorEdicion || errorUsos}</div>;
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

          <Autocomplete
            value={usos.find((uso) => uso?.id_uso === selectedUsoId) || null}
            options={usos}
            getOptionLabel={(option) => option?.nombre || ""}
            onChange={(_, newValue) => {
              setSelectedUsoId(newValue ? newValue.id_uso : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Uso"
                variant="outlined"
                size="small"
                fullWidth
              />
            )}
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
                  <td colSpan={6} className="text-center py-4">
                    No hay equipos asignados a este usuario.
                  </td>
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
                      <Tooltip title="Asignar a otro usuario">
                        <span>
                          <Icon
                            icon="material-symbols:compare-arrows-rounded"
                            width="25"
                            height="25"
                            className="cursor-pointer"
                            onClick={() =>
                              handleCambiarUsuario(equipo.id_equipo)
                            }
                          />
                        </span>
                      </Tooltip>
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
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          disabled={loadingEdicion || loadingCambio}
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
