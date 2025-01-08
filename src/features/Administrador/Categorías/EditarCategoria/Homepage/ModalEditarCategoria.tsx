import useDiscos from "@hooks/useDiscos";
import useUsos from "@hooks/useUsos";
import { Disco, Uso, Marca, Modelo, Serie, Periferico, Edificio, SistemaOperativo, VersionOffice, VersionSO, Ubicacion, Dominio, Procesador, RAM } from "../../../../../types/index";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FC } from "react";
import { Dialog } from "@mui/material";
import useMarcas from "@hooks/useMarcas";
import useModelos from "@hooks/useModelos";
import usePerifericos from "@hooks/usePerifericos";
import useSeries from "@hooks/useSeries";
import useEdificios from "@hooks/useEdificios";
import useSistemasOperativos from "@hooks/useSistemasOperativos";
/*import useUbicaciones from "@hooks/useUbicaciones";
import useVersionesSO from "@hooks/useVersionesSO"; */
import useRam from "@hooks/useRam";
import useProcesadores from "@hooks/useProcesadores";
import useVersionesOffice from "@hooks/useVersionesOffice";
import useDominios from "@hooks/useDominios";

type Opcion = Uso | Disco | Marca | Modelo | Periferico | Serie | Dominio | Edificio | Ubicacion | SistemaOperativo | VersionOffice | VersionSO | Procesador | RAM; 

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
    error,
    setError,
  }) => {
  const { usos } = useUsos();
  const { discos } = useDiscos();
  const { marcas } = useMarcas();
  const { modelos } = useModelos();
  const { perifericos } = usePerifericos();
  const { series } = useSeries();
  const { edificios } = useEdificios();
  const { sistemasOperativos } = useSistemasOperativos();
  /*const { ubicaciones } = useUbicaciones();
  const { versionesSO } = useVersionesSO(); */
  const { dominios } = useDominios();
  const { ram } = useRam();
  const { procesadores } = useProcesadores();
  const { versionesOffice } = useVersionesOffice();

  const elementos: Opcion[] =
  selectedCategoria === 'Uso' ? usos : 
  selectedCategoria === 'Disco' ? discos : 
  selectedCategoria === 'Marca' ? marcas :
  selectedCategoria === 'Modelo' ? modelos :
  selectedCategoria === 'Serie' ? series :
  selectedCategoria === 'Periferico' ? perifericos :
  selectedCategoria === 'Edificio' ? edificios :
  /*selectedCategoria === 'Ubicacion' ? ubicaciones :
  selectedCategoria === 'Version SO' ? versionesSO :
  */
  selectedCategoria === 'Sistema Operativo' ? sistemasOperativos :
  selectedCategoria === 'Dominio' ? dominios :
  selectedCategoria === 'Ram' ? ram :
  selectedCategoria === 'Procesador' ? procesadores :
  selectedCategoria === 'Version Office' ? versionesOffice :
  [];

  const handleEditarCategoria = () => {
    console.log("golA" + error);
    setError(error);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Editar {selectedCategoria}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 border">Opción</th>
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
                    {selectedCategoria === 'Uso' ? elemento?.nombre : elemento?.capacidad}
                  </td>
                  <td className="py-2 px-4 border">
                  <Icon
                        icon="mage:edit"
                        width="30"
                        height="30"
                        className="cursor-pointer"
                        onClick={() => {
                          handleEditarCategoria();
                        }}
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
    </Dialog>
  );
};

export default ModalEditarCategoria;
