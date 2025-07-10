import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Periferico } from "../types";
import { useObtenerComputadoraBodega } from "../features/Equipos/Bodega/EditarBodega/hooks/useObtenerComputadoraBodega";
import { useObtenerEquipoSimpleBodega } from "../features/Equipos/Bodega/EditarBodega/hooks/useObtenerEquipoSimpleBodega";
import { useObtenerRedBodega } from "../features/Equipos/Bodega/EditarBodega/hooks/useObtenerEquipoRedBodega";
import VisualizarComputadoraBodega from "../features/Equipos/Bodega/EditarBodega/Pages/VisualizarComputadoraBodega";
import VisualizarBodegaRed from "../features/Equipos/Bodega/EditarBodega/Pages/VisualizarBodegaRed";
import VisualizarBodegaSimple from "../features/Equipos/Bodega/EditarBodega/Pages/VisualizarBodegaSimple";

const computadores: string[] = ["Laptop", "Computadora"];

const VisualizarBodega = () => {
  const [perifericoId, setPerifericoId] = useState<string | null>(null);
  const location = useLocation();
  const {
    equipoId,
    perifericos,
    equipoName
  }: { equipoId: string; perifericos: Periferico[], equipoName: string } = location.state || {};

  // Computadora o Laptop
  if (equipoName === "Computadora" || equipoName === "Laptop") {
    const { equipoBodega, componentesBodega, loading, error } = useObtenerComputadoraBodega(equipoId);

    useEffect(() => {
      if (equipoBodega && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoBodega.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoBodega, perifericos]);

    if (loading) return <CircularProgress />;
    if (error) return <div>Error al cargar los datos del equipo</div>;

    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Visualizar Bodega</h1>
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Periférico:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">
                {perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre || ""}
              </div>
            </div>
          </div>
          {perifericoId &&
          computadores.includes(
            perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre ?? ""
          ) ? (
            equipoBodega && (
              <VisualizarComputadoraBodega
                equipo={equipoBodega}
                componentesBodega={componentesBodega}
              />
            )
          ) : (
            perifericoId && (
              <h1>Visualizando otro equipo de bodega</h1>
            )
          )}
        </div>
      </div>
    );
  }
  // Switch o AP
  else if (equipoName === "Switch" || equipoName === "AP") {
    const { equipoRedBodega, loading, error } = useObtenerRedBodega(equipoId);

    useEffect(() => {
      if (equipoRedBodega && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoRedBodega.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoRedBodega, perifericos]);

    if (loading) return <CircularProgress />;
    if (error) return <div>Error al cargar los datos del equipo</div>;

    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Visualizar Bodega</h1>
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Periférico:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">
                {perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre || ""}
              </div>
            </div>
          </div>
          {perifericoId && equipoRedBodega && (
            <VisualizarBodegaRed
              perifericoName={equipoName}
              equipoRedBodega={equipoRedBodega}
            />
          )}
        </div>
      </div>
    );
  }
  // Otros activos simples
  else {
    const { equipoSimpleBodega, loading, error } = useObtenerEquipoSimpleBodega(equipoId);

    useEffect(() => {
      if (equipoSimpleBodega && perifericos.length > 0) {
        const selectedPeriferico = perifericos.find(
          (p) => p?.id_periferico === equipoSimpleBodega.id_periferico
        );
        setPerifericoId(selectedPeriferico?.id_periferico || null);
      }
    }, [equipoSimpleBodega, perifericos]);

    if (loading) return <CircularProgress />;
    if (error) return <div>Error al cargar los datos del equipo</div>;

    return (
      <div className="w-full max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-10">Visualizar Bodega</h1>
        <div className="flex flex-col gap-4 mb-14">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Periférico:</label>
              <div className="border rounded px-3 py-2 bg-gray-100">
                {perifericos.find((p) => p?.id_periferico === perifericoId)?.nombre || ""}
              </div>
            </div>
          </div>
          {perifericoId && equipoSimpleBodega && (
            <VisualizarBodegaSimple
              perifericoName={equipoName}
              equipoSimpleBodega={equipoSimpleBodega}
            />
          )}
        </div>
      </div>
    );
  }
};

export default VisualizarBodega;