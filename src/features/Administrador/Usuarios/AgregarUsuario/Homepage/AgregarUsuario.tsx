import { Autocomplete, TextField, Button } from "@mui/material";
import { useState } from "react";
import { Uso } from "../../../../../types";
import useUsos from "@hooks/useUsos";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useAgregarUsuario } from "../hooks/useAgregarUsuario";
import ModalConfirmation from "../../../../../components/ModalConfirmation";

const AgregarUsuario = () => {
  const [selectedUsoId, setSelectedUsoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);

  const [openModalAgregar, setOpenModalAgregar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);

  const { agregarUsuario, loading, error, message } = useAgregarUsuario();

  const { usos, loading: loadingUsos, error: errorUsos } = useUsos();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  const handleUsoChange = (event: any, newValue: Uso | null) => {
    if (newValue) {
      setSelectedUsoId(newValue.id_uso);
    } else {
      setSelectedUsoId(null);
    }
  };

  const handleAgregarUsuario = async () => {
    if (validarCampos()) {
      try {
        await agregarUsuario({ nombre: nombre!, usoId: Number(selectedUsoId!) });
        setShowSuccessMessage(true); 
        setOpenModalAgregar(false);
        setNombre(""); 
        setSelectedUsoId(null);
  
        navigate("/usuarios", {
          state: { snackbarMessage: "Usuario agregado exitosamente" },
        });
      } catch (err) {
        console.error("Error al agregar el usuario:", err);
      }
    }
  };

  const validarCampos = () => {
    if (!nombre || !selectedUsoId) {
      alert("Por favor, complete todos los campos.");
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
    setNombre(""); 
    setSelectedUsoId(null);
    navigate("/usuarios"); 
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-10">Registro de Usuario</h1>

      <div className="flex flex-col gap-4 mb-14">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextField
            label="Nombre del Usuario"
            placeholder="Nombre del Usuario"
            variant="outlined"
            fullWidth
            size="small"
            value={nombre || ""}
            onChange={(e) => setNombre(e.target.value)}
          />
          <Autocomplete
            size="small"
            disablePortal
            options={usos}
            loading={loadingUsos}
            value={
              selectedUsoId
                ? usos.find((u) => u.id_uso === selectedUsoId) ?? null
                : null
            }
            onChange={handleUsoChange}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Uso"
                variant="outlined"
                error={!!errorUsos}
                helperText={errorUsos ? "Error al cargar los usos" : ""}
                fullWidth
              />
            )}
          />
        </div>
      </div>

      {/* Mensajes de estado */}
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Botones */}
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

      {/* Modal de confirmación de agregar */}
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

      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessage(false)}
      >
        <Alert severity="success">Usuario agregado exitosamente</Alert>
      </Snackbar>
    </div>
  );
};

export default AgregarUsuario;
