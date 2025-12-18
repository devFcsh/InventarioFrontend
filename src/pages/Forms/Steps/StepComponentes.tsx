import { useState } from "react";
import { Alert, Box, Button, Snackbar } from "@mui/material";
import { Icon } from "@iconify/react";
import { ModalAgregarComponenteActivo } from "./ModalAgregarComponenteActivo.tsx";
import { Periferico } from "../../../types/index.ts";

interface FormProps {
  perifericos: Periferico[];
  componentes: any;
  handleAddComponents: any;
  eliminarComponente: any;
  showSuccessMessageComponentes: any;
  setShowSuccessMessageComponentes: any;
  empresaComputadora?: string;
  inventarioComputadora?: string;
  esComputadora?: boolean;
}

export const StepComponentes: React.FC<FormProps> = ({
  perifericos = [],
  componentes,
  handleAddComponents,
  eliminarComponente,
  showSuccessMessageComponentes,
  setShowSuccessMessageComponentes,
  empresaComputadora = "",
  inventarioComputadora = "",
  esComputadora = false
}) => {
  const [openModalComponentes, setOpenModalComponentes] =
    useState<boolean>(false);

  const [modalContentComponentes, _] = useState<{
    title: string;
    message: string;
  }>({
    title: "Agregar Componentes",
    message: "Seleccione el componente a registrar",
  });
  
  const handleOpenModalComponentes = () => setOpenModalComponentes(true);
  const handleCloseModalComponentes = () => setOpenModalComponentes(false);

  // Verificar componentes requeridos para Computadora
  const tieneMonitor = componentes.some(
    (comp: any) => comp.periferico?.nombre?.toLowerCase() === "monitor"
  );
  const tieneMouse = componentes.some(
    (comp: any) => comp.periferico?.nombre?.toLowerCase() === "mouse"
  );
  const tieneTeclado = componentes.some(
    (comp: any) => comp.periferico?.nombre?.toLowerCase() === "teclado"
  );

  const componentesFaltantes = esComputadora
    ? [
        !tieneMonitor && "Monitor",
        !tieneMouse && "Mouse",
        !tieneTeclado && "Teclado",
      ].filter(Boolean)
    : [];

  return (
    <div className="mt-8">
      {esComputadora && componentesFaltantes.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Se requiere agregar los siguientes componentes para poder finalizar: {componentesFaltantes.join(", ")}
        </Alert>
      )}
      <Button
        onClick={handleOpenModalComponentes}
        color="primary"
        variant="contained"
        size="large"
        sx={{ margin: "1rem", display: "flex", alignContent: "end" }}
      >
        Agregar Componente
      </Button>
      <ModalAgregarComponenteActivo
        open={openModalComponentes}
        onClose={handleCloseModalComponentes}
        title={modalContentComponentes.title}
        perifericos={perifericos}
        onAddComponent={handleAddComponents}
        addedPerifericos={componentes}
        empresaComputadora={empresaComputadora}
        inventarioComputadora={inventarioComputadora}
      />
      <Snackbar
        open={showSuccessMessageComponentes}
        autoHideDuration={3000}
        onClose={() => setShowSuccessMessageComponentes(false)}
      >
        <Alert severity="success">Componente agregado exitosamente</Alert>
      </Snackbar>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 border">Periférico</th>
                <th className="py-2 px-4 border">Marca</th>
                <th className="py-2 px-4 border">Modelo</th>
                <th className="py-2 px-4 border">Serie</th>
                <th className="py-2 px-4 border">Inventario</th>
                <th className="py-2 px-1 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {componentes.map((comp: any, index: any) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">
                    {comp.periferico?.nombre}
                  </td>
                  <td className="py-2 px-4 border">{comp.marca?.nombre}</td>
                  <td className="py-2 px-4 border">{comp.modelo?.nombre}</td>
                  <td className="py-2 px-4 border">{comp.serie}</td>
                  <td className="py-2 px-4 border">{comp.inventario}</td>
                  <td className="py-2 px-1 border">
                    <Icon
                      icon="weui:delete-outlined"
                      width="25"
                      height="25"
                      onClick={() => eliminarComponente(index)}
                      className="cursor-pointer mx-auto"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {componentes.length === 0 && (
            <Box sx={{ background: "#9c9c9c", marginBottom: 8, height: 100 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <h1 className="text-xl">No existen componentes agregados</h1>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};
