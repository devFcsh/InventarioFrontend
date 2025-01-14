import { FC, useState } from "react";
import { Dialog, TextField } from "@mui/material";
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
  selectedCategoria}) => {
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

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Opcion | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

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
      switch (selectedCategoria) {
        case "Dominio":
          editarDominio({ id_dominio: selectedOption.id_dominio, nuevoNombre: editedValue });
          break;
          case "Periférico":
          editarPeriferico({ id_periferico: selectedOption.id_periferico, nuevoNombre: editedValue });
          break;
          case "Uso":
          editarUso({ id_uso: selectedOption.id_uso, nuevoNombre: editedValue });
          break;
          case "Disco":
          editarDisco({ id_disco: selectedOption.id_disco, nuevoNombre: editedValue });
          break;
          case "Marca":
          editarMarca({ id_marca: selectedOption.id_marca, nuevoNombre: editedValue });
          break;
          case "Modelo":
          editarModelo({ id_modelo: selectedOption.id_modelo, nuevoNombre: editedValue });
          break;
          case "Serie":
          editarSerie({ id_serie: selectedOption.id_serie, nuevoNombre: editedValue });
          break;
          case "Sistema Operativo":
          editarSistemaOperativo({ id_sistemaoperativo: selectedOption.id_sistemaoperativo, nuevoNombre: editedValue });
          break;
          case "Edificio":
          editarEdificio({ id_edificio: selectedOption.id_edificio, nuevoNombre: editedValue });
          break;
          case "Ubicación":
          editarUbicacion({ id_ubicacion: selectedOption.id_ubicacion, nuevoNombre: editedValue });
          break;
          case "Versión SO":
          editarVersionSO({ id_versionso: selectedOption.id_versionso, nuevoNombre: editedValue });
          break;
          case "RAM":
          editarSerie({ id_serie: selectedOption.id_serie, nuevoNombre: editedValue });
          break;
          case "Procesador":
          editarProcesador({ id_procesador: selectedOption.id_procesador, nuevoNombre: editedValue });
          break;
          case "Versión Office":
          editarVersionOffice({ id_versionoffice: selectedOption.id_versionoffice, nuevoNombre: editedValue });
          break;
        default:
          console.log(`No hay función para editar la categoría ${selectedCategoria}`);
          break;
      }
    }
    setOpenEditModal(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="py-5 px-10">
        <h2 className="text-xl font-semibold mb-4">Editar {selectedCategoria}</h2>
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
                      {(selectedCategoria === "RAM" || selectedCategoria === "Disco")
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
  );
};

export default ModalEditarCategoria;
