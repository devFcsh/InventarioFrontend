import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete, TextField, Button, Snackbar, Alert } from "@mui/material";
import { Icon } from "@iconify/react";
import useUsos from "@hooks/useUsos";
import useEquiposPorUsuario from "../hooks/useEquiposPorUsuario";
const EditarUsuario = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { usuario } = location.state || {}; 

  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [uso, setUso] = useState(usuario?.id_uso || "");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { usos } = useUsos();

  const { equipos, loading: loadingEquipos, error: errorEquipos } = useEquiposPorUsuario(usuario?.id_usuario || "");

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
          <Autocomplete
            size="small"
            disablePortal
            options={usos}
            value={usos.find((u) => u.id_uso === uso) || null}
            onChange={(e, newValue) => setUso(newValue ? newValue.id_uso : "")}
            getOptionLabel={(option) => option.nombre}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Uso"
                variant="outlined"
                fullWidth
                size="small"
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
                        icon="weui:delete-outlined"
                        width="25"
                        height="25"
                        className="cursor-pointer"
                        onClick={() => alert(`Eliminar componente ${equipo.periferico}`)}
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
    </div>
  );
};

export default EditarUsuario;
