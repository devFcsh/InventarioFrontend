import React, { useEffect, useState, useRef } from "react";
import { Autocomplete, TextField, Button, Snackbar, Alert, Box } from "@mui/material";
import {
  Marca,
  Modelo,
  Serie,
  Lampara,
} from "../../../../../types";
import { BodegaSimpleEdit } from "../../../../../types/Bodega/index";
import useMarcasPorPeriferico from "../../../../../hooks/useMarcasPorPeriferico";
import { useModelosPorMarcaPeriferico } from "../../../../../hooks/useModelosPorMarcaPeriferico";
import { useSeriesPorModelo } from "../../../../../hooks/useSeriesPorModelo";
import useEditarBodegaSimple from "../hooks/useEditarBodegaSimple";
import ModalConfirmation from "../../../../../components/ModalConfirmation";
import { useNavigate } from "react-router-dom";
import { validateInventario } from "@pages/Forms/helpers/validateInventario";
import { useLamparasPorModelo } from "@hooks/useLamparasPorModelo";
import useLamparas from "@hooks/useLamparas";

interface EditarBodegaSimpleProps {
    equipoSimpleBodega: BodegaSimpleEdit;
    perifericoName: string;
}

const EditarBodegaSimple = ({
  perifericoName,
  equipoSimpleBodega
}: EditarBodegaSimpleProps) => {
  const [selectedInventarioMarca, setSelectedInventarioMarca] =
    useState<Marca | null>(null);
  const [selectedInventarioModelo, setSelectedInventarioModelo] =
    useState<Modelo | null>(null);
  const [selectedLampara, setSelectedLampara] =
    useState<Lampara | null>(null);
  const [selectedInventarioSerie, setSelectedInventarioSerie] =
    useState<Serie | null>(null);
  const [selectedInventarioInv, setSelectedInventarioInv] =
    useState<string>("");
  const [newObservation, setNewObservation] = useState<string>("");
  const [errorMensajeComponente, setErrorMensajeComponente] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<string | null>("");
  const [errorEmpresa, setErrorEmpresa] = useState<boolean>(false);
  const [errorInventario, setErrorInventario] = useState<boolean>(false);
  const [errorMensajeEquipo, setErrorMensajeEquipo] = useState<string | null>(null);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalCancelar, setOpenModalCancelar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const navigate = useNavigate();
  const { marcas } = useMarcasPorPeriferico(equipoSimpleBodega?.id_periferico ?? "");
  const { modelos } = useModelosPorMarcaPeriferico(
    selectedInventarioMarca?.id_marca ?? "",
    equipoSimpleBodega?.id_periferico ?? ""
  );
  const { series } = useSeriesPorModelo(
    equipoSimpleBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const { lamparas } = useLamparasPorModelo(
    equipoSimpleBodega?.id_periferico ?? "",
    selectedInventarioMarca?.id_marca ?? "",
    selectedInventarioModelo?.id_modelo ?? ""
  );
  const [errorLampara, setErrorLampara] = useState(false);
  
  const { lamparasTotales } = useLamparas();
  const { editarBodegaSimple } = useEditarBodegaSimple();

  useEffect(() => {
    if (equipoSimpleBodega) {
      setSelectedInventarioInv(equipoSimpleBodega.inventario);
      setNewObservation(equipoSimpleBodega.observacion);
      equipoSimpleBodega.inventario.length===10?setEmpresa("EspolTech"):setEmpresa("Espol")
    }
  }, [equipoSimpleBodega]);

  useEffect(() => {
    if (equipoSimpleBodega && marcas.length > 0) {
      setSelectedInventarioMarca(
        marcas.find((marca) => marca?.id_marca === equipoSimpleBodega.id_marca) || null
      );
    }
  }, [equipoSimpleBodega, marcas]);

  useEffect(() => {
    if (equipoSimpleBodega && modelos.length > 0) {
      setSelectedInventarioModelo(
        modelos.find((modelo) => modelo?.id_modelo === equipoSimpleBodega.id_modelo) || null
      );
    }
  }, [equipoSimpleBodega, modelos]);

  useEffect(() => {
    if (equipoSimpleBodega && series.length > 0) {
      setSelectedInventarioSerie(
        series.find((serie) => serie?.id_serie === equipoSimpleBodega.id_serie) || null
      );
    }
  }, [equipoSimpleBodega, series]);


  useEffect(() => {
    if (equipoSimpleBodega && lamparasTotales.length > 0) {
      setSelectedLampara(
        lamparasTotales.find((lampara) => lampara?.id_lampara === equipoSimpleBodega.id_lampara) || null
      );
    }
  }, [equipoSimpleBodega, lamparasTotales]);


  const handleEditEquipo = async (observationValue : string) => {

    const payload = {
      tipo: "bodega",
      inventario: selectedInventarioInv,
      id_serie: selectedInventarioSerie?.id_serie ?? "",
      observacion: observationValue,
      id_lampara: selectedLampara?.id_lampara ?? "",
    };
    try {
      await editarBodegaSimple(equipoSimpleBodega.id_equipo, payload);
        setShowSuccessMessage(true);
        navigate("/bodega", { state: { equipoEditado: true } });
      
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
    await handleEditEquipo(newObservation);
  };
  const handleObservation = (newObservation :string)=>{
    if(newObservation.length <= 200){
      setNewObservation(newObservation);
      setErrorMensajeComponente("");
    }else{
      setErrorMensajeComponente("La observación no puede tener más de 200 caracteres.");
    }
  }

  const handleChangeEmpresa = (newEmpresa :string | null)=>{
      setEmpresa(newEmpresa);
      if(newEmpresa===null){
        setErrorEmpresa(true);
        setSelectedInventarioInv("")
        setErrorInventario(true)
      }else{
        setErrorEmpresa(false);
        !validateInventario(selectedInventarioInv,newEmpresa)?setErrorInventario(true):setErrorInventario(false)
      }
    }

    const handleChangeInventario = (inventario :string)=>{
      setSelectedInventarioInv(inventario)
      if(empresa==="Espol"){
        !validateInventario(inventario?inventario:"",empresa)?setErrorInventario(true):setErrorInventario(false)
      }else if(empresa==="EspolTech"){
        !validateInventario(inventario?inventario:"",empresa)?setErrorInventario(true):setErrorInventario(false)
      }
    }
    const handleLamparaChange = (lampara :Lampara)=>{
      setSelectedLampara(lampara)
      if(lampara===null){
        setErrorLampara(true)
      }else{
        setErrorLampara(false)
      }
    }

  const handleCancelar = () => {
    setOpenModalCancelar(false);
    navigate("/bodega");
  };

  const handleConfirmCancelar = () => {
    setOpenModalCancelar(true);
  };
  const validarCamposEquipo = () => {
    if (
      !selectedInventarioInv ||
      !selectedInventarioSerie ||
      perifericoName!=="Proyector"?false:!selectedLampara
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
            setSelectedLampara(null);
          }}
          getOptionLabel={(option) => option?.nombre || ""}
          renderInput={(params) => (
            <TextField {...params} label="Marca" variant="outlined" fullWidth />
          )}
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
        />
        <Box
          sx={{
            display: "inline-flex",
          }}
        >
          <Autocomplete
            size="small"
            disablePortal
            sx={{ width: "50%" }}
            options={["Espol", "EspolTech"]}
            getOptionLabel={(option) => (option ? option : "")}
            value={empresa}
            onChange={(event, newValue) => {
              handleChangeEmpresa(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Empresa"
                variant="outlined"
                error={!!errorEmpresa}
                helperText={
                  errorEmpresa ? "Por favor seleccionar una empresa" : ""
                }
                fullWidth
                sx={{ marginRight: 8, width: "100%" }}
              />
            )}
          />
          <TextField
            label="Inventario"
            placeholder="Inventario"
            variant="outlined"
            fullWidth
            size="small"
            value={selectedInventarioInv}
            error={!!errorInventario}
            helperText={
              errorInventario ? "Por favor escribir un inventario válido" : ""
            }
            onChange={(e) => handleChangeInventario(e.target.value)}
            disabled={empresa === ""}
          />
        </Box>
        {perifericoName === "Proyector" ? (
            <Autocomplete
              size="small"
              disablePortal
              options={lamparas}
              value={selectedLampara}
              onChange={(_, newValue: Lampara | null) => {
                handleLamparaChange(newValue)
              }}
              getOptionLabel={(option) => (option ? option.nombre : "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lámpara"
                  variant="outlined"
                  error={!!errorLampara}
                  helperText={
                    errorLampara
                      ? "Por favor seleccionar una lámpara"
                      : ""
                  }
                  fullWidth
                />
              )}
              disabled={!selectedInventarioModelo}
            />
          ) : (
            ""
          )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-10">Observación</h2>
        <TextField
                label="Observación"
                variant="outlined"
                fullWidth
                multiline
                minRows={2}
                value={newObservation}
                onChange={(e) => {
                  handleObservation(e.target.value)
                }}
                error={!!errorMensajeComponente}
                helperText={errorMensajeComponente}
          />
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
          Editar Bodega
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

export default EditarBodegaSimple;
