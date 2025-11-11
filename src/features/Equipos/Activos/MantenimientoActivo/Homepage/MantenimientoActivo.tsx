import { useState } from "react";
import { MantenimientosComputadoraActivo } from "../pages/MantenimientoComputadoraActivo";
import { MantenimientosProyectorActivo } from "../pages/MantenimientoProyector";
import { MantenimientosSimpleActivo } from "../pages/MantenimientoSimpleActivo";
import { MantenimientosRedActivo } from "../pages/MatenimientoRedActivo";
import { useMantenimientos } from "../hooks/useMantenimientos";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import Loader from "@pages/Loader";
import { AgregarMantenimiento } from "../pages/AgregarMantenimiento";

interface MantenimientoProps {
  open: boolean;
  onClose: () => void;
  id_equipo: string;
  tipoEquipo: string;
}

export const MantenimientoActivo: React.FC<MantenimientoProps> = ({
  open,
  onClose,
  id_equipo,
  tipoEquipo,
}) => {
  const { mantenimientos, loading, error } = useMantenimientos(
    open && id_equipo ? id_equipo : null
  );
  const [openAgregar, setOpenAgregar] = useState<boolean>(false);

  if (!open) return null;
  if (loading) {
    return (
          <Loader />
    );
  }

  if (!loading && error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>Error al cargar los mantenimientos: {error}</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!mantenimientos.length) {
    return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>Mantenimientos</DialogTitle>
          <DialogContent>
            <Typography>
              No hay mantenimientos registrados para este equipo.
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={() => setOpenAgregar(true)}
              >
                Agregar mantenimiento
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
        <AgregarMantenimiento
          open={openAgregar}
          onClose={() => setOpenAgregar(false)}
          id_equipo={id_equipo}
          onSuccess={() => {
            setOpenAgregar(false);
            onClose();
          }}
        />
      </>
    );
  }

  let MantenimientoComponent: React.FC<any> = MantenimientosSimpleActivo;
  if (tipoEquipo === "Computadora" || tipoEquipo === "Laptop") {
    MantenimientoComponent = MantenimientosComputadoraActivo;
  } else if (tipoEquipo === "Switch" || tipoEquipo === "AP") {
    MantenimientoComponent = MantenimientosRedActivo;
  } else if (tipoEquipo === "Proyector") {
    MantenimientoComponent = MantenimientosProyectorActivo;
  }

  return (
    <>
      <MantenimientoComponent
        open={open}
        onClose={onClose}
        id_equipo={id_equipo}
        mantenimientos={mantenimientos}
        onOpenAgregar={() => setOpenAgregar(true)}
      />
      <AgregarMantenimiento
        open={openAgregar}
        onClose={() => setOpenAgregar(false)}
        id_equipo={id_equipo}
        onSuccess={() => {
          setOpenAgregar(false);
          onClose();
        }}
      />
    </>
  );
};