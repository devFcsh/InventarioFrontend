import useDiscos from "@hooks/useDiscos";
import useUsos from "@hooks/useUsos";
import { Disco, Uso } from "../../../../../types/index";
import { Icon } from "@iconify/react/dist/iconify.js";
import { FC } from "react";
import { Dialog } from "@mui/material";

type Opcion = Uso | Disco; 

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

  const elementos: Opcion[] =
  selectedCategoria === 'Uso' ? usos : selectedCategoria === 'Disco' ? discos : [];

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
