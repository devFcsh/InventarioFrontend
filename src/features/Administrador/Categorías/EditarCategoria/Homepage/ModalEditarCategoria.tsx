import { FC, useState } from "react";
import { Alert, Dialog, Snackbar, TextField } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import useUsos from "@hooks/useUsos";
import useDiscos from "@hooks/useDiscos";
import useMarcas from "@hooks/useMarcas";
import useModelos from "@hooks/useModelos";
import usePerifericos from "@hooks/usePerifericos";
import useSeries from "@hooks/useSeries";
import useEdificios from "@hooks/useEdificios";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
import useRam from "@hooks/useRam";
import useProcesadores from "@hooks/useProcesadores";
import useVersionesOffice from "@hooks/useVersionesOffice";
import useDominios from "@hooks/useDominios";
import useVersionesCompletasSO from "@hooks/useVersionesCompletasSO";
import useUbicacionesCompletas from "@hooks/useUbicacionesCompletas";
import {
  Disco,
  Uso,
  Marca,
  Modelo,
  Periferico,
  Serie,
  Edificio,
  SistemaOperativo,
  VersionOffice,
  VersionSO,
  Ubicacion,
  Dominio,
  Procesador,
  RAM,
} from "../../../../../types/index";
import { useEditarDominio } from "../../AgregarCategoria/hooks/useEditarDominio";
import { useEditarPeriferico } from "../../AgregarCategoria/hooks/useEditarPeriferico";
import { useEditarUso } from "../../AgregarCategoria/hooks/useEditarUso";
import { useEditarDisco } from "../../AgregarCategoria/hooks/useEditarDisco";
import { useEditarMarca } from "../../AgregarCategoria/hooks/useEditarMarca";
import { useEditarModelo } from "../../AgregarCategoria/hooks/useEditarModelo";
import { useEditarSerie } from "../../AgregarCategoria/hooks/useEditarSerie";
import { useEditarSistemaOperativo } from "../../AgregarCategoria/hooks/useEditarSistemaOperativo";
import { useEditarEdificio } from "../../AgregarCategoria/hooks/useEditarEdificio";
import { useEditarUbicacion } from "../../AgregarCategoria/hooks/useEditarUbicacion";
import { useEditarVersionSO } from "../../AgregarCategoria/hooks/useEditarVersionSO";
import { useEditarProcesador } from "../../AgregarCategoria/hooks/useEditarProcesador";
import { useEditarVersionOffice } from "../../AgregarCategoria/hooks/useEditarVersionOffice";
import { useEliminarDominio } from "../../AgregarCategoria/hooks/useEliminarDominio";
import { useEliminarPeriferico } from "../../AgregarCategoria/hooks/useEliminarPeriferico";
import { useEliminarUso } from "../../AgregarCategoria/hooks/useEliiminarUso";
import { useEliminarDisco } from "../../AgregarCategoria/hooks/useEliminarDisco";
import { useEliminarMarca } from "../../AgregarCategoria/hooks/useEliminarMarca";
import { useEliminarSerie } from "../../AgregarCategoria/hooks/useEliminarSerie";
import { useEliminarSistemaOperativo } from "../../AgregarCategoria/hooks/useEliminarSistemaOperativo";
import { useEliminarEdificio } from "../../AgregarCategoria/hooks/useEliminarEdificio";
import { useEliminarUbicacion } from "../../AgregarCategoria/hooks/useEliminarUbicacion";
import { useEliminarVersionSO } from "../../AgregarCategoria/hooks/useEliminarVersionSO";
import { useEliminarProcesador } from "../../AgregarCategoria/hooks/useEliminarProcesador";
import { useEliminarVersionOffice } from "../../AgregarCategoria/hooks/useEliminarVersionOffice";
import { useEliminarModelo } from "../../AgregarCategoria/hooks/useEliminarModelo";
import { useNavigate } from "react-router-dom";

type Opcion =
  | Uso
  | Disco
  | Marca
  | Modelo
  | Periferico
  | Serie
  | Dominio
  | Edificio
  | Ubicacion
  | SistemaOperativo
  | VersionOffice
  | VersionSO
  | Procesador
  | RAM;

interface ModalEditarCategoriaProps {
  open: boolean;
  onClose: () => void;
  selectedCategoria: string | null;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ModalEditarCategoria: FC<ModalEditarCategoriaProps> = ({
  open,
  onClose,
  selectedCategoria,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const { usos } = useUsos();
  const { discos } = useDiscos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { perifericos } = usePerifericos();
  const { series } = useSeries();
  const { edificios } = useEdificios();
  const { sistemasOperativos } = useSistemasOperativos();
  const { ubicaciones } = useUbicacionesCompletas();
  const { versionesSO } = useVersionesCompletasSO();
  const { dominios } = useDominios();
  const { ram } = useRam();
  const { procesadores } = useProcesadores();
  const { versionesOffice } = useVersionesOffice();

  const { editarDominio } = useEditarDominio();
  const { editarPeriferico } = useEditarPeriferico();
  const { editarUso } = useEditarUso();
  const { editarDisco } = useEditarDisco();
  const { editarMarca } = useEditarMarca();
  const { editarModelo } = useEditarModelo();
  const { editarSerie } = useEditarSerie();
  const { editarSistemaOperativo } = useEditarSistemaOperativo();
  const { editarEdificio } = useEditarEdificio();
  const { editarUbicacion } = useEditarUbicacion();
  const { editarVersionSO } = useEditarVersionSO();
  const { editarProcesador } = useEditarProcesador();
  const { editarVersionOffice } = useEditarVersionOffice();

  const { eliminarDominio } = useEliminarDominio();
  const { eliminarPeriferico } = useEliminarPeriferico();
  const { eliminarUso } = useEliminarUso();
  const { eliminarDisco } = useEliminarDisco();
  const { eliminarMarca } = useEliminarMarca();
  const { eliminarModelo } = useEliminarModelo();
  const { eliminarSerie } = useEliminarSerie();
  const { eliminarSistemaOperativo } = useEliminarSistemaOperativo();
  const { eliminarEdificio } = useEliminarEdificio();
  const { eliminarUbicacion } = useEliminarUbicacion();
  const { eliminarVersionSO } = useEliminarVersionSO();
  const { eliminarProcesador } = useEliminarProcesador();
  const { eliminarVersionOffice } = useEliminarVersionOffice();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Opcion | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const navigate = useNavigate();


  const elementos: Opcion[] =
    selectedCategoria === "Uso"
      ? usos
      : selectedCategoria === "Disco"
      ? discos
      : selectedCategoria === "Marca"
      ? marcas
      : selectedCategoria === "Modelo"
      ? modelos
      : selectedCategoria === "Serie"
      ? series
      : selectedCategoria === "Periférico"
      ? perifericos
      : selectedCategoria === "Edificio"
      ? edificios
      : selectedCategoria === "Ubicación"
      ? ubicaciones
      : selectedCategoria === "Versión SO"
      ? versionesSO
      : selectedCategoria === "Sistema Operativo"
      ? sistemasOperativos
      : selectedCategoria === "Dominio"
      ? dominios
      : selectedCategoria === "RAM"
      ? ram
      : selectedCategoria === "Procesador"
      ? procesadores
      : selectedCategoria === "Versión Office"
      ? versionesOffice
      : [];

  const handleEditarCategoria = (elemento: Opcion) => {
    setSelectedOption(elemento);
    setEditedValue(elemento?.nombre || "");
    setOpenEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedOption) {
      try {
        switch (selectedCategoria) {
          case "Dominio":
            editarDominio({
              id_dominio: selectedOption.id_dominio,
              nuevoNombre: editedValue,
            });
            break;
          case "Periférico":
            editarPeriferico({
              id_periferico: selectedOption.id_periferico,
              nuevoNombre: editedValue,
            });
            break;
          case "Uso":
            editarUso({
              id_uso: selectedOption.id_uso,
              nuevoNombre: editedValue,
            });
            break;
          case "Disco":
            editarDisco({
              id_disco: selectedOption.id_disco,
              nuevoNombre: editedValue,
            });
            break;
          case "Marca":
            editarMarca({
              id_marca: selectedOption.id_marca,
              nuevoNombre: editedValue,
            });
            break;
          case "Modelo":
            editarModelo({
              id_modelo: selectedOption.id_modelo,
              nuevoNombre: editedValue,
            });
            break;
          case "Serie":
            editarSerie({
              id_serie: selectedOption.id_serie,
              nuevoNombre: editedValue,
            });
            break;
          case "Sistema Operativo":
            editarSistemaOperativo({
              id_sistemaoperativo: selectedOption.id_sistemaoperativo,
              nuevoNombre: editedValue,
            });
            break;
          case "Edificio":
            editarEdificio({
              id_edificio: selectedOption.id_edificio,
              nuevoNombre: editedValue,
            });
            break;
          case "Ubicación":
            editarUbicacion({
              id_ubicacion: selectedOption.id_ubicacion,
              nuevoNombre: editedValue,
            });
            break;
          case "Versión SO":
            editarVersionSO({
              id_versionso: selectedOption.id_versionso,
              nuevoNombre: editedValue,
            });
            break;
          case "RAM":
            editarSerie({
              id_serie: selectedOption.id_serie,
              nuevoNombre: editedValue,
            });
            break;
          case "Procesador":
            editarProcesador({
              id_procesador: selectedOption.id_procesador,
              nuevoNombre: editedValue,
            });
            break;
          case "Versión Office":
            editarVersionOffice({
              id_versionoffice: selectedOption.id_versionoffice,
              nuevoNombre: editedValue,
            });
            break;
          default:
            console.log(
              `No hay función para editar la categoría ${selectedCategoria}`
            );
            break;
        }

        setSnackbarMessage("Opción editada correctamente");
        setSnackbarSeverity("success");
        navigate("/categorias");
        
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage("Error al editar la opción");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
    setOpenEditModal(false);
  };

  const handleEliminarCategoria = async (elemento: Opcion) => {
    if (elemento) {
      try {
        switch (selectedCategoria) {
          case "Dominio":
            await eliminarDominio(elemento.id_dominio);
            break;
          case "Periférico":
            await eliminarPeriferico(elemento.id_periferico);
            break;
          case "Uso":
            await eliminarUso(elemento.id_uso);
            break;
          case "Disco":
            await eliminarDisco(elemento.id_disco);
            break;
          case "Marca":
            await eliminarMarca(elemento.id_marca);
            break;
          case "Modelo":
            await eliminarModelo(elemento.id_modelo);
            break;
          case "Serie":
            await eliminarSerie(elemento.id_serie);
            break;
          case "Sistema Operativo":
            await eliminarSistemaOperativo(elemento.id_sistemaoperativo);
            break;
          case "Edificio":
            await eliminarEdificio(elemento.id_edificio);
            break;
          case "Ubicación":
            await eliminarUbicacion(elemento.id_ubicacion);
            break;
          case "Versión SO":
            await eliminarVersionSO(elemento.id_versionso);
            break;
          case "RAM":
            await eliminarSerie(elemento.id_serie);
            break;
          case "Procesador":
            await eliminarProcesador(elemento.id_procesador);
            break;
          case "Versión Office":
            await eliminarVersionOffice(elemento.id_versionoffice);
            break;
          default:
            console.log(
              `No hay función para eliminar la categoría ${selectedCategoria}`
            );
            break;
        }
        setSnackbarMessage("Opción eliminada correctamente");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage("Desligue la opción antes de eliminarla");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={onClose}>
        <div className="py-5 px-10">
          <h2 className="text-xl font-semibold mb-4">
            Editar {selectedCategoria}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-4 border">Opción</th>
                  {selectedCategoria === "RAM" ? (
                    <th className="py-2 px-4 border">Opción Tipo</th>
                  ) : (
                    <></>
                  )}
                  <th className="py-2 px-4 border">Acción</th>
                </tr>
              </thead>
              <tbody>
                {elementos.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      No hay opciones para esta categoría.
                    </td>
                  </tr>
                ) : (
                  elementos.map((elemento, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">
                        {selectedCategoria === "RAM" ||
                        selectedCategoria === "Disco"
                          ? elemento?.capacidad
                          : elemento?.nombre}
                      </td>
                      {selectedCategoria === "RAM" ? (
                        <td className="py-2 px-4 border">{elemento?.tipo}</td>
                      ) : (
                        <></>
                      )}
                      <td className="py-2 px-3 border flex gap-2 items-center">
                        <Icon
                          icon="mage:edit"
                          width="25"
                          height="25"
                          className="cursor-pointer"
                          onClick={() => handleEditarCategoria(elemento)}
                        />
                        <Icon
                          icon="weui:delete-outlined"
                          width="25"
                          height="25"
                          className="cursor-pointer"
                          onClick={() => handleEliminarCategoria(elemento)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-4">Editar Opción</h3>
            <TextField
              label="Nuevo Valor"
              variant="outlined"
              fullWidth
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="py-2 px-4 bg-gray-300 rounded"
                onClick={() => setOpenEditModal(false)}
              >
                Cancelar
              </button>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded"
                onClick={handleSaveEdit}
              >
                Guardar
              </button>
            </div>
          </div>
        </Dialog>
      </Dialog>
    </>
  );
};

export default ModalEditarCategoria;
