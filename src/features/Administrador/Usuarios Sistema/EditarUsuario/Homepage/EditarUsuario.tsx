import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import useEditarUsuarioSistema from "../hooks/useEditarUsuarioSistema";
import { useSnackbar } from "@context/SnackbarContext";
import useRoles from "@hooks/useRoles";

const EditarUsuarioSistema = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { usuario } = location.state || {};

  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [selectedRolId, setSelectedRolId] = useState<number | null>(
  usuario?.id_rol ?? null
);

  const { showMessage } = useSnackbar();
  const { roles, loading: loadingRoles, error: errorRoles } = useRoles();

  const {
    editarUsuarioSistema,
    loading,
    error,
  } = useEditarUsuarioSistema();

  useEffect(() => {
    if (!usuario) {
      navigate("/usuariosSistema");
    }
  }, [usuario, navigate]);

  const handleSave = async () => {
    try {
      if (correo && selectedRolId) {
        await editarUsuarioSistema(
          usuario.id_usuario_sistema,
          correo,
          String(selectedRolId)
        );
        showMessage("Usuario actualizado correctamente", "success");
        setTimeout(() => {
          navigate("/usuariosSistema");
        }, 1000);
      } else {
        showMessage("Por favor, complete todos los campos.", "error");
      }
    } catch (error) {
      showMessage("Error al actualizar el usuario", "error");
      setTimeout(() => {
        navigate("/usuariosSistema");
      }, 1000);
    }
  };

  if (loading || loadingRoles) {
    return <div>Cargando...</div>;
  }

  if (error || errorRoles) {
    return <div>{error || errorRoles}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10">Editar Usuario Sistema</h1>

      <div className="flex flex-col gap-4 mb-14">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextField
            label="Correo"
            variant="outlined"
            fullWidth
            size="small"
            value={correo}
            onChange={(e) => {
              const value = e.target.value;
              if (value !== null && value.length > 50) {
                return;
              }
              setCorreo(value);
            }}
          />

          <Autocomplete
  value={roles.find((rol) => rol.id_rol === selectedRolId) || null}
  options={roles}
  getOptionLabel={(option) => option?.nombre || ""}
  onChange={(_, newValue) => {
    setSelectedRolId(newValue ? newValue.id_rol : null);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Rol"
      variant="outlined"
      size="small"
      fullWidth
    />
  )}
/>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          disabled={loading}
        >
          Guardar cambios
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/usuariosSistema")}
          fullWidth
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default EditarUsuarioSistema;