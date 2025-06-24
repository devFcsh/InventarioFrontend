import { Autocomplete, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAgregarUsuarioSistema } from "../hooks/useAgregarUsuarioSistema";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useSnackbar } from "@context/SnackbarContext";
import useRoles from "@hooks/useRoles";

const AgregarUsuarioSistema = () => {
  const [correo, setCorreo] = useState<string>("");
  const [selectedRolId, setSelectedRolId] = useState<number | null>(null);

  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);

  const { agregarUsuarioSistema, loading, error, message } = useAgregarUsuarioSistema();
  const { roles, loading: loadingRoles, error: errorRoles } = useRoles();

  const navigate = useNavigate();
  const { showMessage } = useSnackbar();

  const handleRolChange = (
    _: React.SyntheticEvent<Element, Event>,
    value: { id_rol: number; nombre: string } | null
  ) => {
    setSelectedRolId(value ? value.id_rol : null);
  };

  const handleAgregarUsuario = async () => {
    if (validarCampos()) {
      try {
        await agregarUsuarioSistema({ correo, rolId: selectedRolId! });
        setOpenModalAgregar(false);
        setCorreo("");
        setSelectedRolId(null);

        showMessage("Usuario agregado exitosamente", "success");
        navigate("/usuariosSistema");
      } catch (err) {
        showMessage("Error al agregar el usuario", "error");
      }
    }
  };

  const validarCampos = () => {
    if (!correo || !selectedRolId) {
      showMessage("Por favor, complete todos los campos.", "error");
      return false;
    }
    return true;
  };

  const handleConfirmAgregarUsuario = () => {
    if (validarCampos()) {
      setOpenModalAgregar(true);
    }
  };

  const handleConfirmCancelar = () => {
    setOpenModalCancelar(true);
  };

  const handleCancelar = () => {
    setOpenModalCancelar(false);
    setCorreo("");
    setSelectedRolId(null);
    navigate("/usuariosSistema");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10">Registro de Usuario Sistema</h1>

      <div className="flex flex-col gap-4 mb-14">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextField
            label="Correo"
            placeholder="Correo"
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
            size="small"
            disablePortal
            options={roles}
            loading={loadingRoles}
            value={
              selectedRolId
                ? roles.find((r) => r.id_rol === selectedRolId) ?? null
                : null
            }
            onChange={handleRolChange}
            getOptionLabel={(option) => option?.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rol"
                variant="outlined"
                error={!!errorRoles}
                helperText={errorRoles ? "Error al cargar los roles" : ""}
                fullWidth
              />
            )}
          />
        </div>
      </div>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmAgregarUsuario}
          fullWidth
          disabled={loading}
        >
          {loading ? "Agregando..." : "Agregar Usuario"}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleConfirmCancelar}
          fullWidth
        >
          Cancelar
        </Button>
      </div>

      <ModalConfirmation
        open={openModalAgregar}
        onClose={() => setOpenModalAgregar(false)}
        onConfirm={handleAgregarUsuario}
        title="Confirmar Agregar Usuario"
        message="¿Está seguro de que desea agregar este usuario?"
      />

      <ModalConfirmation
        open={openModalCancelar}
        onClose={() => setOpenModalCancelar(false)}
        onConfirm={handleCancelar}
        title="Confirmar Cancelar"
        message="¿Está seguro de que desea cancelar? Todos los cambios no guardados se perderán."
      />
    </div>
  );
};

export default AgregarUsuarioSistema;