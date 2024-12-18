import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, TextField, Button, Snackbar, Alert } from "@mui/material";
import {
  Marca,
  Modelo,
  Serie,
  Aula,
  Edificio,
} from "../../../../../types";
import { ActivoSimpleEdit } from "../../../../../types/Activo";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import useEdificios from "../../../../../hooks/useEdificios";
import useAulas from "../../../../../hooks/useAulas";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import useSubirImagen from "../../../../../hooks/useSubirImagen";
import useEditarActivoSimple from "../hooks/useEditarActivoSimple";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";

interface EditarActivoSimpleProps {
    equipoSimpleActivo: ActivoSimpleEdit;
    idUsuario: string | null;
}

const EditarActivoSimple = ({
    equipoSimpleActivo,
  idUsuario
}: EditarActivoSimpleProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [errorMensajeEquipo, setErrorMensajeEquipo] = useState<string | null>(null);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  

  const navigate = useNavigate();
  const [selectedEdificio, setSelectedEdificio] = useState<Edificio | null>(
    null
  );
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

  const { uploadImage } = useSubirImagen();
  const { marcas } = useMarcasPorPeriferico(equipoSimpleActivo?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipoSimpleActivo?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoSimpleActivo?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  
  const { edificios } = useEdificios();
  const { aulas } = useAulas(selectedEdificio?.id_edificio ?? "");
  const { editarActivoSimple } = useEditarActivoSimple();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (equipoSimpleActivo) {
      setSelectedInventarioInv(equipoSimpleActivo.inventario);
      setCurrentImagePath(equipoSimpleActivo.imagenRuta);
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipoSimpleActivo.id_marca) || null
      );
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipoSimpleActivo.id_modelo) || null
      );
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoSimpleActivo.id_serie) || null
      );
      setSelectedEdificio(
        edificios.find(
          (edificio) => edificio?.id_edificio === equipoSimpleActivo.id_edificio
        ) || null
      );
      setSelectedAula(
        aulas.find((aula) => aula?.id_aula === equipoSimpleActivo.id_aula) || null
      );
    }
  }, [equipoSimpleActivo, marcas, modelos, series]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEditEquipo = async () => {
    let nuevaImagen = currentImagePath;
    
    if (image) {
      try {
        nuevaImagen = await uploadImage(image);
      } catch (error) {
        alert('Error al cargar la imagen.');
        return;
      }
    }

    const payload = {
      tipo: "activo",
      inventario: selectedInventarioInv,
      id_usuario: idUsuario ?? "",
      imagenRuta: image ? nuevaImagen : "",
      id_aula: selectedAula?.id_aula ?? "",
      id_serie: selectedInventarioSerie?.id_serie ?? "",
    };
    try {
      await editarActivoSimple(equipoSimpleActivo.id_equipo, payload);
        setShowSuccessMessage(true);
        navigate("/activos", { state: { equipoEditado: true } });
      
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
    }
  };

  const handleConfirmEditarEquipo = () => {
    if (validarCamposEquipo()) {
      setOpenModalEditar(true);
    }
  };

  const handleModalConfirmEditar = async () => {
    setOpenModalEditar(false);
    await handleEditEquipo();
  };

  const handleCancelar = () => {
    setOpenModalCancelar(false);
    navigate("/activos");
  };

  const handleConfirmCancelar = () => {
    setOpenModalCancelar(true);
  };
  const validarCamposEquipo = () => {
    if (
      !selectedInventarioInv ||
      !selectedInventarioSerie ||
      !selectedAula
    ) {
      setErrorMensajeEquipo("Por favor, complete todos los campos del equipo.");
      return false;
    }
    setErrorMensajeEquipo(null);
    return true;
  };

  return (
    <div>
      <ModalConfirmation
        open={openModalEditar}
        onClose={() => setOpenModalEditar(false)}
        onConfirm={handleModalConfirmEditar}
        title="Confirmar Editar Equipo"
        message="¿Está seguro de que desea editar este equipo?"
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
        <Alert severity="success">Equipo agregado exitosamente</Alert>
      </Snackbar>
      <h2 className="text-xl font-semibold mb-5">Información de Inventario</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Autocomplete
          size="small"
          disablePortal
          options={marcas}
          value={selectedInventarioMarca}
          onChange={(_, newValue) => {
            setSelectedInventarioMarca(newValue);
            setSelectedInventarioModelo(null);
            setSelectedInventarioSerie(null);
          }}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Marca" variant="outlined" fullWidth />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={modelos}
          value={selectedInventarioModelo}
          onChange={(_, newValue) => {
            setSelectedInventarioModelo(newValue);
            setSelectedInventarioSerie(null);
          }}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Modelo"
              variant="outlined"
              fullWidth
            />
          )}
          disabled
        />
        <Autocomplete
          size="small"
          disablePortal
          options={series}
          value={selectedInventarioSerie}
          onChange={(_, newValue) => setSelectedInventarioSerie(newValue)}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Serie" variant="outlined" fullWidth />
          )}
          disabled
        />
        <TextField
          label="Inventario"
          variant="outlined"
          fullWidth
          size="small"
          value={selectedInventarioInv}
          onChange={(e) => setSelectedInventarioInv(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-5">Información General</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">

        <Autocomplete
          size="small"
          disablePortal
          options={edificios}
          value={selectedEdificio}
          onChange={(_, newValue) => {
            setSelectedEdificio(newValue);
            setSelectedAula(null);
          }}
          getOptionLabel={(option) => option? option.nombre : ""}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Edificio"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <Autocomplete
          size="small"
          disablePortal
          options={aulas}
          value={selectedAula}
          onChange={(_, newValue) => setSelectedAula(newValue)}
          getOptionLabel={(option) => option? option.nombre : ""}
          renderInput={(params) => (
            <TextField {...params} label="Aula" variant="outlined" fullWidth />
          )}
          disabled={!selectedEdificio}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-5">Cargar Imagen</h2>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div
            onClick={handleImageClick}
            className="w-full max-w-sm h-48 border border-dashed border-gray-300 flex items-center justify-center cursor-pointer"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            ) : equipoSimpleActivo.imagenRuta ? (
              <img
                src={`http://localhost:5000${equipoSimpleActivo.imagenRuta}`}
                alt="Imagen del equipo"
                className="w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">Haz clic para cargar una imagen</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <Button
          variant="contained"
          sx={{
            backgroundColor:
              "#4CAF50",
            "&:hover": {
              backgroundColor:
                "#45a049"
            },
          }}
          onClick={handleConfirmEditarEquipo}
          fullWidth
        >
          Editar Activo
        </Button>
        <Button
                onClick={handleConfirmCancelar}
                color="error"
                variant="contained"
                fullWidth
              >
                Cancelar
              </Button>
      </div>
      {errorMensajeEquipo && (
        <div className="text-red-500 mt-2">{errorMensajeEquipo}</div>
      )}
    </div>
  );
};

export default EditarActivoSimple;
